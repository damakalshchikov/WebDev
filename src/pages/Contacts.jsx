import styles from './Contacts.module.css'

const branches = [
  {
    name: 'Центральный салон',
    address: 'ул. Большая Садовая, 75',
    phone: '+7 (863) 123-45-67',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
    mapQ: 'Ростов-на-Дону, Большая Садовая, 75',
  },
  {
    name: 'Салон «Северный»',
    address: 'пр. Шолохова, 100',
    phone: '+7 (863) 234-56-78',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
    mapQ: 'Ростов-на-Дону, проспект Шолохова, 100',
  },
  {
    name: 'Салон «Западный»',
    address: 'ул. Малиновского, 25',
    phone: '+7 (863) 345-67-89',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
    mapQ: 'Ростов-на-Дону, улица Малиновского, 25',
  },
]

export default function Contacts() {
  return (
    <div>
      <h1 className={styles.title}>Контакты</h1>

      <div className={styles.block}>
        <div className={styles.blockTitle}>Основной офис</div>
        <div className={styles.row}>
          <span className={styles.label}>Адрес</span>
          <span className={styles.value}>г. Ростов-на-Дону, ул. Большая Садовая, 75</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Юр. адрес</span>
          <span className={styles.value}>344002, г. Ростов-на-Дону, ул. Пушкинская, 10, офис 3</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Телефон</span>
          <span className={styles.value}>+7 (800) 555-35-35 (бесплатно)</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>info@diamand.com</span>
        </div>
      </div>

      <h2 className={styles.branchesTitle}>Наши салоны</h2>
      <div className={styles.branches}>
        {branches.map((b) => (
          <div key={b.name} className={styles.branch}>
            <div className={styles.branchName}>{b.name}</div>
            <div className={styles.branchInfo}>
              <div>{b.address}</div>
              <div>{b.phone}</div>
              {b.hours.map(line => <div key={line}>{line}</div>)}
            </div>
          </div>
        ))}
      </div>

      <h2 className={styles.mapTitle}>Где нас найти</h2>
      <div className={styles.map}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2713.5!2d39.7125!3d47.2226!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDfCsDEzJzIxLjQiTiAzOcKwNDInNDUuMCJF!5e0!3m2!1sru!2sru!4v1234567890"
          width="100%"
          height="400"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          title="Карта"
        />
      </div>
    </div>
  )
}
