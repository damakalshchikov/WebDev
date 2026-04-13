import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './ProductDetail.module.css'

const CATEGORY_LABELS = {
  gold: 'Золото',
  silver: 'Серебро',
  platinum: 'Платина',
}

export default function ProductDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [showFittingModal, setShowFittingModal] = useState(false)
  const [fittingMessage, setFittingMessage] = useState('')
  const [fittingSuccess, setFittingSuccess] = useState(false)

  useEffect(() => {
    fetch(`/api/products/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) {
          setError(data.error)
        } else {
          setProduct(data)
          setEditForm(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setError('Ошибка загрузки товара')
        setLoading(false)
      })
  }, [id])

  async function handleDelete() {
    if (!confirm('Удалить этот товар?')) return
    await fetch(`/api/products/${id}`, { method: 'DELETE', credentials: 'include' })
    navigate('/catalog')
  }

  async function handleEdit(e) {
    e.preventDefault()
    const res = await fetch(`/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...editForm, price: parseFloat(editForm.price) }),
    })
    const data = await res.json()
    if (res.ok) {
      setProduct(data)
      setEditing(false)
    }
  }

  async function handleFitting(e) {
    e.preventDefault()
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({
        subject: `Запись на примерку: ${product.name}`,
        body: fittingMessage || `Хочу записаться на примерку украшения "${product.name}"`,
      }),
    })
    if (res.ok) {
      setFittingSuccess(true)
      setFittingMessage('')
    }
  }

  if (loading) {
    return <div className={styles.notFound}><p>Загрузка...</p></div>
  }

  if (error || !product) {
    return (
      <div className={styles.notFound}>
        <p>{error || 'Товар не найден.'}</p>
        <Link to="/catalog" className={styles.back}>← Вернуться в каталог</Link>
      </div>
    )
  }

  if (editing && user?.role === 'admin') {
    return (
      <div className={styles.page}>
        <Link to="/catalog" className={styles.back}>← Каталог</Link>
        <form className={styles.editForm} onSubmit={handleEdit}>
          <h2 className={styles.editTitle}>Редактировать товар</h2>
          <input className={styles.editInput} value={editForm.name || ''} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))} placeholder="Название" required />
          <input className={styles.editInput} value={editForm.short_description || ''} onChange={e => setEditForm(p => ({ ...p, short_description: e.target.value }))} placeholder="Краткое описание" />
          <textarea className={styles.editTextarea} value={editForm.description || ''} onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))} placeholder="Полное описание" rows={3} />
          <input className={styles.editInput} type="number" value={editForm.price || ''} onChange={e => setEditForm(p => ({ ...p, price: e.target.value }))} placeholder="Цена" required />
          <input className={styles.editInput} value={editForm.material || ''} onChange={e => setEditForm(p => ({ ...p, material: e.target.value }))} placeholder="Материал" />
          <textarea className={styles.editTextarea} value={editForm.care || ''} onChange={e => setEditForm(p => ({ ...p, care: e.target.value }))} placeholder="Уход" rows={2} />
          <input className={styles.editInput} value={editForm.image || ''} onChange={e => setEditForm(p => ({ ...p, image: e.target.value }))} placeholder="URL изображения" />
          <div className={styles.editActions}>
            <button type="submit" className={styles.saveBtn}>Сохранить</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setEditing(false)}>Отмена</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <Link to="/catalog" className={styles.back}>← Каталог</Link>

      {user?.role === 'admin' && (
        <div className={styles.adminActions}>
          <button className={styles.editBtn} onClick={() => setEditing(true)}>Редактировать</button>
          <button className={styles.deleteBtn} onClick={handleDelete}>Удалить</button>
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.imageWrap}>
          {product.image
            ? <img src={product.image} alt={product.name} className={styles.image} />
            : <div className={styles.noImage}>Нет фото</div>
          }
        </div>
        <div className={styles.info}>
          <span className={`${styles.badge} ${styles[product.category]}`}>
            {CATEGORY_LABELS[product.category] || product.category}
          </span>
          <h1 className={styles.name}>{product.name}</h1>
          <div className={styles.price}>{Number(product.price).toLocaleString('ru-RU')} ₽</div>
          <p className={styles.description}>{product.description}</p>
          {product.material && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Материал</h2>
              <p>{product.material}</p>
            </div>
          )}
          {product.care && (
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>Уход за украшением</h2>
              <p>{product.care}</p>
            </div>
          )}
          {user?.role === 'user' && (
            <button className={styles.fittingBtn} onClick={() => setShowFittingModal(true)}>
              Записаться на примерку
            </button>
          )}
        </div>
      </div>

      {showFittingModal && (
        <div className={styles.modalOverlay} onClick={e => { if (e.target === e.currentTarget) { setShowFittingModal(false); setFittingSuccess(false) } }}>
          <div className={styles.modal}>
            <button className={styles.modalClose} onClick={() => { setShowFittingModal(false); setFittingSuccess(false) }}>✕</button>
            {fittingSuccess ? (
              <div className={styles.fittingSuccess}>
                <div className={styles.successIcon}>✓</div>
                <h3>Запрос отправлен!</h3>
                <p>Мы свяжемся с вами для подтверждения примерки.</p>
                <button className={styles.fittingCloseBtn} onClick={() => { setShowFittingModal(false); setFittingSuccess(false) }}>Закрыть</button>
              </div>
            ) : (
              <form onSubmit={handleFitting}>
                <h3 className={styles.modalTitle}>Записаться на примерку</h3>
                <p className={styles.modalProduct}>Украшение: <strong>{product.name}</strong></p>
                <textarea
                  className={styles.fittingTextarea}
                  placeholder="Дополнительные пожелания (необязательно)"
                  value={fittingMessage}
                  onChange={e => setFittingMessage(e.target.value)}
                  rows={3}
                />
                <button type="submit" className={styles.fittingSubmitBtn}>Записаться</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
