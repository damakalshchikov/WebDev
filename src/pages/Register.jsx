import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import PrivacyModal from '../components/PrivacyModal/PrivacyModal'
import styles from './Register.module.css'

export default function Register() {
  const { register } = useAuth()
  const navigate = useNavigate()
  const [phone, setPhone] = useState('+7')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [consentPD, setConsentPD] = useState(false)
  const [consentPolicy, setConsentPolicy] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState(null)

  function handlePhone(e) {
    let val = e.target.value
    if (!val.startsWith('+7')) val = '+7'
    const digits = val.slice(2).replace(/\D/g, '').slice(0, 10)
    setPhone('+7' + digits)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('Введите имя')
    if (!/^\+7\d{10}$/.test(phone)) return setError('Введите корректный номер телефона (+7XXXXXXXXXX)')
    if (!email.includes('@')) return setError('Введите корректный email')
    if (password.length < 6) return setError('Пароль должен содержать не менее 6 символов')
    if (password !== confirmPassword) return setError('Пароли не совпадают')
    if (!consentPD) return setError('Необходимо согласие на обработку персональных данных')
    if (!consentPolicy) return setError('Необходимо принять Политику конфиденциальности')

    setLoading(true)
    try {
      await register(name, phone, email, password)
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.wrap}>
      <h1 className={styles.title}>Регистрация</h1>
      <form className={styles.form} onSubmit={handleSubmit}>
        {error && <div className={styles.error}>{error}</div>}
        <div className={styles.field}>
          <label className={styles.label}>Имя</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Введите имя" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Номер телефона</label>
          <input type="tel" value={phone} onChange={handlePhone} placeholder="+7XXXXXXXXXX" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Введите email" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Пароль</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Введите пароль" className={styles.input} required />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Повторите пароль</label>
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Повторите пароль" className={styles.input} required />
        </div>
        <div className={styles.notice}>
          <span className={styles.noticeIcon}>🔒</span>
          <div>
            <strong>Безопасность данных:</strong> Ваши данные обрабатываются только для
            предоставления услуг и не передаются третьим лицам без вашего согласия.
          </div>
        </div>

        <label className={styles.checkLabel}>
          <input type="checkbox" className={styles.checkbox} checked={consentPD} onChange={e => setConsentPD(e.target.checked)} />
          <span>Даю согласие на{' '}
            <button type="button" className={styles.docLink} onClick={() => setModal('consent')}>
              обработку персональных данных
            </button>{' '}
            согласно ФЗ-152 «О персональных данных»
          </span>
        </label>
        <label className={styles.checkLabel}>
          <input type="checkbox" className={styles.checkbox} checked={consentPolicy} onChange={e => setConsentPolicy(e.target.checked)} />
          <span>Ознакомился(-ась) с{' '}
            <button type="button" className={styles.docLink} onClick={() => setModal('policy')}>
              Политикой конфиденциальности
            </button>{' '}
            и принимаю её условия
          </span>
        </label>

        <button className={styles.submitBtn} type="submit" disabled={loading}>
          {loading ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
        <p className={styles.hint}>Нажимая «Зарегистрироваться», вы подтверждаете согласие с условиями обработки данных.</p>
      </form>
      {modal && <PrivacyModal doc={modal} onClose={() => setModal(null)} />}
    </div>
  )
}
