import { useState } from 'react'
import styles from './Register.module.css'

export default function Register() {
  const [phone, setPhone] = useState('+7')

  function handlePhone(e) {
    let val = e.target.value
    if (!val.startsWith('+7')) val = '+7'
    const digits = val.slice(2).replace(/\D/g, '').slice(0, 10)
    setPhone('+7' + digits)
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Регистрация</h1>
      <div className={styles.form}>
        <div className={styles.field}>
          <label className={styles.label}>Имя</label>
          <input type="text" placeholder="Введите имя" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Номер телефона</label>
          <input
            type="tel"
            value={phone}
            onChange={handlePhone}
            placeholder="+7XXXXXXXXXX"
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input type="email" placeholder="Введите email" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <input type="password" placeholder="Введите пароль" className={styles.input} />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Повторите пароль</label>
          <input type="password" placeholder="Повторите пароль" className={styles.input} />
        </div>
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>🔒</span>
          <div>
            <strong>Безопасность данных:</strong> Ваши данные обрабатываются только для
            предоставления услуг и не передаются третьим лицам без вашего согласия.
          </div>
        </div>

        <label className={styles.checkLabel}>
          <input type="checkbox" className={styles.checkbox} />
          <span>Даю согласие на <u>обработку персональных данных</u> согласно ФЗ-152 «О персональных данных»</span>
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" className={styles.checkbox} />
          <span>Ознакомился(-ась) с <u>Политикой конфиденциальности</u> и принимаю её условия</span>
        </label>

        <button className={styles.submitBtn}>Зарегистрироваться</button>
        <p className={styles.hint}>Нажимая «Зарегистрироваться», вы подтверждаете согласие с условиями обработки данных.</p>
      </div>
    </div>
  )
}
