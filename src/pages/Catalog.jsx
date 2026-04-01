import ProductCard from '../components/ProductCard/ProductCard'
import { products, CATEGORY_META } from '../data/products'
import styles from './Catalog.module.css'

const categories = Object.entries(CATEGORY_META).map(([id, meta]) => ({
  id,
  title: meta.title,
  products: products.filter(p => p.category === id),
}))

export default function Catalog() {
  return (
    <div>
      <h1 className={styles.title}>Каталог украшений</h1>
      {categories.map((category) => (
        <section key={category.id} className={styles.category}>
          <h2 className={`${styles.categoryTitle} ${styles[category.id]}`}>
            {category.title}
          </h2>
          <div className={styles.grid}>
            {category.products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
