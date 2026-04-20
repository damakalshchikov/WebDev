import Slider from '../components/Slider/Slider'
import styles from './Home.module.css'

const categories = [
  { material: 'Золото', name: 'Кольца' },
  { material: 'Золото', name: 'Серьги' },
  { material: 'Золото', name: 'Браслеты' },
  { material: 'Золото', name: 'Цепочки' },
  { material: 'Золото', name: 'Ожерелья' },
  { material: 'Золото', name: 'Подвески' },
  { material: 'Серебро', name: 'Кольца' },
  { material: 'Серебро', name: 'Серьги' },
  { material: 'Серебро', name: 'Браслеты' },
  { material: 'Платина', name: 'Кольца' },
  { material: 'Платина', name: 'Ожерелья' },
  { material: 'Платина', name: 'Броши' },
]

export default function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <div className={styles.heroSlider}>
          <Slider images={['/images/shop.png', '/images/shop2.png', '/images/shop3.png']} alt="Ювелирный магазин" interval={5000} />
        </div>
        <div className={styles.heroText}>
          <h1>Добро пожаловать в ДИАМАНД</h1>
          <p>
            Мы рады приветствовать вас в нашем ювелирном магазине. Более 15 лет мы создаём
            украшения, которые становятся частью важнейших моментов вашей жизни.
          </p>
          <p>
            В нашем ассортименте — изделия из золота, серебра и платины с драгоценными камнями.
            Каждое украшение сопровождается сертификатом качества и государственным пробирным клеймом.
          </p>
          <p>
            Откройте для себя мир изысканных украшений ручной работы и эксклюзивных коллекций
            от лучших ювелирных домов.
          </p>
        </div>
      </section>

      <section>
        <h2 className={styles.categoriesTitle}>Наш ассортимент</h2>
        <div className={styles.categories}>
          {categories.map((cat, i) => (
            <div key={i} className={styles.categoryCard}>
              <div className={styles.categoryMaterial}>{cat.material}</div>
              <div className={styles.categoryName}>{cat.name}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
