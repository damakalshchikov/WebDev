import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import ProductCard from '../components/ProductCard/ProductCard'
import styles from './Catalog.module.css'

// Названия для известных категорий
const CATEGORY_TITLES = {
  gold:     'Золото',
  silver:   'Серебро',
  platinum: 'Платина',
}

export default function Catalog() {
  const { user } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showAddCategory, setShowAddCategory] = useState(false)
  // Временные категории, созданные в текущей сессии (до появления первого товара)
  const [pendingCategories, setPendingCategories] = useState([])
  const [newProduct, setNewProduct] = useState({
    name: '', short_description: '', description: '', price: '',
    image: '', category: 'gold', material: '', care: '',
  })
  const [newCategoryId, setNewCategoryId] = useState('')
  const [newCategoryTitle, setNewCategoryTitle] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  async function fetchProducts() {
    try {
      const res = await fetch('/api/products')
      const data = await res.json()
      setProducts(Array.isArray(data) ? data : [])
    } catch {
      setError('Ошибка загрузки товаров')
    } finally {
      setLoading(false)
    }
  }

  async function handleAddProduct(e) {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ ...newProduct, price: parseFloat(newProduct.price) }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      setSuccessMsg('Товар добавлен!')
      setShowAddProduct(false)
      setNewProduct({ name: '', short_description: '', description: '', price: '', image: '', category: 'gold', material: '', care: '' })
      await fetchProducts()
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (err) {
      setError(err.message)
    }
  }

  function handleAddCategory(e) {
    e.preventDefault()
    const id = newCategoryId.trim()
    const title = newCategoryTitle.trim()
    if (id && title && !pendingCategories.some(c => c.id === id)) {
      setPendingCategories(prev => [...prev, { id, title }])
    }
    setNewCategoryId('')
    setNewCategoryTitle('')
    setShowAddCategory(false)
  }

  // Базовые категории всегда доступны (для формы и для отображения даже до загрузки товаров)
  const BASE_CATEGORIES = [
    { id: 'gold',     title: 'Золото' },
    { id: 'silver',   title: 'Серебро' },
    { id: 'platinum', title: 'Платина' },
  ]

  // Категории выводятся из реальных товаров в БД — никакой потери при обновлении страницы
  const productCategoryIds = [...new Set(products.map(p => p.category).filter(Boolean))]
  const categoriesFromProducts = productCategoryIds.map(id => ({
    id,
    title: CATEGORY_TITLES[id] || id,
  }))

  // Список для отображения: все категории из БД + базовые, которых нет в БД
  const baseNotInDB = BASE_CATEGORIES.filter(c => !productCategoryIds.includes(c.id))
  const displayCategories = [...categoriesFromProducts, ...baseNotInDB]

  // Временные категории этой сессии, у которых ещё нет товаров
  const allKnownIds = new Set(displayCategories.map(c => c.id))
  const pendingWithoutProducts = pendingCategories.filter(c => !allKnownIds.has(c.id))

  // Итоговый список для формы: базовые + из БД + временные (всегда есть хотя бы gold/silver/platinum)
  const allCategories = [
    ...displayCategories,
    ...pendingWithoutProducts,
  ]

  // Для отображения: категории с товарами видны всем; пустые — только администратору
  const categorizedProducts = allCategories.map(cat => ({
    ...cat,
    products: products.filter(p => p.category === cat.id),
  })).filter(cat => cat.products.length > 0 || user?.role === 'admin')

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div>
      <h1 className={styles.title}>Каталог украшений</h1>

      {error && <div className={styles.error}>{error}</div>}
      {successMsg && <div className={styles.success}>{successMsg}</div>}

      {user?.role === 'admin' && (
        <div className={styles.adminBar}>
          <button className={styles.adminBtn} onClick={() => { setShowAddCategory(s => !s); setShowAddProduct(false) }}>
            + Категория
          </button>
          <button className={styles.adminBtn} onClick={() => { setShowAddProduct(s => !s); setShowAddCategory(false) }}>
            + Украшение
          </button>
        </div>
      )}

      {showAddCategory && user?.role === 'admin' && (
        <form className={styles.adminForm} onSubmit={handleAddCategory}>
          <h3 className={styles.formTitle}>Новая категория</h3>
          <input
            className={styles.formInput}
            placeholder="ID (напр. rose-gold)"
            value={newCategoryId}
            onChange={e => setNewCategoryId(e.target.value)}
            required
          />
          <input
            className={styles.formInput}
            placeholder="Название (напр. Розовое золото)"
            value={newCategoryTitle}
            onChange={e => setNewCategoryTitle(e.target.value)}
            required
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Добавить</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddCategory(false)}>Отмена</button>
          </div>
        </form>
      )}

      {showAddProduct && user?.role === 'admin' && (
        <form className={styles.adminForm} onSubmit={handleAddProduct}>
          <h3 className={styles.formTitle}>Новое украшение</h3>
          <input className={styles.formInput} placeholder="Название *" value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} required />
          <input className={styles.formInput} placeholder="Краткое описание" value={newProduct.short_description} onChange={e => setNewProduct(p => ({ ...p, short_description: e.target.value }))} />
          <textarea className={styles.formTextarea} placeholder="Полное описание" value={newProduct.description} onChange={e => setNewProduct(p => ({ ...p, description: e.target.value }))} rows={3} />
          <input className={styles.formInput} placeholder="Материал" value={newProduct.material} onChange={e => setNewProduct(p => ({ ...p, material: e.target.value }))} />
          <input className={styles.formInput} placeholder="Уход за украшением" value={newProduct.care} onChange={e => setNewProduct(p => ({ ...p, care: e.target.value }))} />
          <input className={styles.formInput} type="number" min="0" step="0.01" placeholder="Цена (₽) *" value={newProduct.price} onChange={e => setNewProduct(p => ({ ...p, price: e.target.value }))} required />
          <input className={styles.formInput} placeholder="URL изображения" value={newProduct.image} onChange={e => setNewProduct(p => ({ ...p, image: e.target.value }))} />
          <select className={styles.formSelect} value={newProduct.category} onChange={e => setNewProduct(p => ({ ...p, category: e.target.value }))}>
            {allCategories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.title}</option>
            ))}
          </select>
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Сохранить</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddProduct(false)}>Отмена</button>
          </div>
        </form>
      )}

      {categorizedProducts.map((category) => (
        <section key={category.id} className={styles.category}>
          <h2 className={`${styles.categoryTitle} ${styles[category.id] || styles.customCategory}`}>
            {category.title}
          </h2>
          <div className={styles.grid}>
            {category.products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                image={product.image}
                name={product.name}
                price={Number(product.price)}
                description={product.short_description || product.description}
              />
            ))}
          </div>
          {category.products.length === 0 && user?.role === 'admin' && (
            <p className={styles.emptyCategory}>Нет товаров в этой категории</p>
          )}
        </section>
      ))}
    </div>
  )
}
