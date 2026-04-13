import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './Contacts.module.css'

const branches = [
  {
    name: 'Центральный салон',
    address: 'ул. Большая Садовая, 75',
    phone: '+7 (863) 123-45-67',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
  },
  {
    name: 'Салон «Северный»',
    address: 'пр. Шолохова, 100',
    phone: '+7 (863) 234-56-78',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
  },
  {
    name: 'Салон «Западный»',
    address: 'ул. Малиновского, 25',
    phone: '+7 (863) 345-67-89',
    hours: ['Пн–Пт: 10:00–20:00', 'Сб–Вс: 10:00–18:00'],
  },
]

export default function Contacts() {
  const { user } = useAuth()
  const [form, setForm] = useState({ subject: '', body: '' })
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      setSuccess(true)
      setForm({ subject: '', body: '' })
    } catch (err) {
      setError(err.message)
    } finally {
      setSending(false)
    }
  }

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

      {user?.role === 'user' && (
        <div className={styles.contactForm}>
          <h2 className={styles.formTitle}>Напишите нам</h2>
          {success ? (
            <div className={styles.formSuccess}>
              <p>Ваше сообщение отправлено! Мы ответим в ближайшее время.</p>
              <button className={styles.resetBtn} onClick={() => setSuccess(false)}>Написать ещё</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className={styles.formError}>{error}</div>}
              <div className={styles.formField}>
                <label className={styles.formLabel}>Тема</label>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Тема сообщения"
                  value={form.subject}
                  onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                />
              </div>
              <div className={styles.formField}>
                <label className={styles.formLabel}>Сообщение *</label>
                <textarea
                  className={styles.formTextarea}
                  placeholder="Ваше сообщение..."
                  value={form.body}
                  onChange={e => setForm(p => ({ ...p, body: e.target.value }))}
                  rows={5}
                  required
                />
              </div>
              <button type="submit" className={styles.formBtn} disabled={sending}>
                {sending ? 'Отправка...' : 'Отправить'}
              </button>
            </form>
          )}
        </div>
      )}

      {!user && (
        <div className={styles.contactNote}>
          <p>Войдите в аккаунт, чтобы написать нам напрямую.</p>
        </div>
      )}
    </div>
  )
}
