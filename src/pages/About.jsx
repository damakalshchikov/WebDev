import styles from './About.module.css'

const timeline = [
  {
    year: '2005',
    text: 'Открытие первого ювелирного салона в Ростове-на-Дону. Небольшой магазин с авторскими украшениями быстро завоевал доверие покупателей.',
  },
  {
    year: '2010',
    text: 'Расширение сети: открытие 5 новых салонов в Ростовской области. Запуск собственной ювелирной мастерской.',
  },
  {
    year: '2015',
    text: 'Сеть ДИАМАНД выросла до 12 магазинов. Запуск интернет-магазина с доставкой по всей России.',
  },
  {
    year: '2020',
    text: 'Открытие мастерской индивидуальных украшений — теперь каждый клиент может заказать эксклюзивное изделие по собственному эскизу.',
  },
]

export default function About() {
  return (
    <div>
      <section className={styles.intro}>
        <img src="/images/about.png" alt="О компании" className={styles.aboutImage} />
        <div className={styles.introText}>
          <h1>О компании</h1>
          <p>
            ДИАМАНД — ювелирная сеть с 20-летней историей, основанная в 2005 году
            в Ростове-на-Дону. Мы специализируемся на украшениях из золота, серебра и платины
            с драгоценными и полудрагоценными камнями.
          </p>
          <p>
            Вся наша продукция сопровождается сертификатами качества и государственным
            пробирным клеймом. Мы работаем только с проверенными поставщиками и гарантируем
            подлинность каждого изделия.
          </p>
        </div>
      </section>

      <section>
        <h2 className={styles.timelineTitle}>История компании</h2>
        <div className={styles.timeline}>
          {timeline.map((item) => (
            <div key={item.year} className={styles.timelineItem}>
              <div className={styles.year}>{item.year}</div>
              <div className={styles.timelineText}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
