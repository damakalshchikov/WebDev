import styles from './Footer.module.css'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div>
          <div className={styles.brand}>ДИАМАНД</div>
          <div className={styles.contacts}>
            <div>г. Ростов-на-Дону, ул. Большая Садовая, 75</div>
            <div>+7 (800) 555-35-35</div>
            <div>info@diamand.com</div>
          </div>
        </div>
        <div className={styles.copy}>© 2005–2026 ДИАМАНД. Все права защищены.</div>
      </div>
    </footer>
  )
}
