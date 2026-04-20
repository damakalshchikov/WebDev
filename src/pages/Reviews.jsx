import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Reviews.module.css'

function Stars({ rating, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0)
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={(interactive ? (hovered || rating) : rating) > i ? styles.starFilled : styles.starEmpty}
          style={interactive ? { cursor: 'pointer', fontSize: '1.4rem' } : undefined}
          onMouseEnter={interactive ? () => setHovered(i + 1) : undefined}
          onMouseLeave={interactive ? () => setHovered(0) : undefined}
          onClick={interactive && onRate ? () => onRate(i + 1) : undefined}
        >★</span>
      ))}
    </div>
  )
}

function ReviewForm({ onSuccess }) {
  const { user } = useAuth()
  const [form, setForm] = useState({ product_name: '', text: '', rating: 0 })
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (!form.rating) {
      setError('Пожалуйста, выберите оценку')
      return
    }
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error)
      }
      setSubmitted(true)
      onSuccess()
    } catch (err) {
      setError(err.message)
    }
  }

  if (!user) {
    return (
      <div className={styles.authNotice}>
        Чтобы оставить отзыв, необходимо{' '}
        <Link to="/register" className={styles.authLink}>зарегистрироваться</Link>{' '}
        или войти в аккаунт.
      </div>
    )
  }

  if (user.role === 'admin') return null

  if (submitted) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Спасибо за отзыв!</h2>
        <p className={styles.successText}>Ваш отзыв отправлен на модерацию и будет опубликован в ближайшее время.</p>
        <button
          className={styles.resetBtn}
          onClick={() => { setSubmitted(false); setForm({ product_name: '', text: '', rating: 0 }) }}
        >
          Оставить ещё один отзыв
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Оставить отзыв</h2>
      {error && <div className={styles.formError}>{error}</div>}
      <div className={styles.formRow}>
        <label className={styles.label}>Название товара</label>
        <input
          className={styles.input}
          type="text"
          value={form.product_name}
          onChange={e => setForm(p => ({ ...p, product_name: e.target.value }))}
          placeholder="Например: Кольцо «Вечная красота»"
          required
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Оценка</label>
        <Stars
          rating={form.rating}
          interactive
          onRate={r => setForm(p => ({ ...p, rating: r }))}
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Текст отзыва</label>
        <textarea
          className={styles.textarea}
          value={form.text}
          onChange={e => setForm(p => ({ ...p, text: e.target.value }))}
          placeholder="Расскажите о вашем опыте покупки..."
          rows={4}
          required
        />
      </div>
      <button className={styles.submitBtn} type="submit">Отправить отзыв</button>
    </form>
  )
}

export default function Reviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editRating, setEditRating] = useState(0)

  useEffect(() => {
    fetchReviews()
  }, [user])

  async function fetchReviews() {
    try {
      const res = await fetch('/api/reviews')
      const data = await res.json()
      setReviews(Array.isArray(data) ? data : [])

      if (user?.role === 'admin') {
        const pRes = await fetch('/api/reviews/pending', { credentials: 'include' })
        const pData = await pRes.json()
        setPendingReviews(Array.isArray(pData) ? pData : [])
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleApprove(id) {
    await fetch(`/api/reviews/${id}/approve`, { method: 'PATCH', credentials: 'include' })
    fetchReviews()
  }

  async function handleDelete(id) {
    if (!confirm('Удалить отзыв?')) return
    await fetch(`/api/reviews/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchReviews()
  }

  async function handleEditSave(id) {
    const res = await fetch(`/api/reviews/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ text: editText, rating: editRating }),
    })
    if (res.ok) {
      setEditingId(null)
      fetchReviews()
    }
  }

  function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div>
      <h1 className={styles.title}>Отзывы покупателей</h1>
      <ReviewForm onSuccess={fetchReviews} />

      {user?.role === 'admin' && pendingReviews.length > 0 && (
        <div className={styles.pendingSection}>
          <h2 className={styles.pendingTitle}>
            Отзывы на модерации ({pendingReviews.length})
          </h2>
          {pendingReviews.map(review => (
            <div key={review.id} className={`${styles.card} ${styles.pendingCard}`}>
              <div className={styles.header}>
                <div className={styles.author}>{review.user_name || 'Пользователь'}</div>
                <div className={styles.date}>{formatDate(review.created_at)}</div>
              </div>
              <Stars rating={review.rating} />
              <div className={styles.product}>Товар: {review.product_name}</div>
              <p className={styles.text}>{review.text}</p>
              <div className={styles.adminControls}>
                <button className={styles.approveBtn} onClick={() => handleApprove(review.id)}>Одобрить</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(review.id)}>Удалить</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className={styles.list}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>Одобренных отзывов пока нет. Будьте первым!</p>
        ) : reviews.map(review => (
          <div key={review.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.author}>{review.user_name || 'Пользователь'}</div>
              <div className={styles.date}>{formatDate(review.created_at)}</div>
            </div>

            {editingId === review.id ? (
              <div>
                <Stars rating={editRating} interactive onRate={setEditRating} />
                <textarea
                  className={styles.textarea}
                  value={editText}
                  onChange={e => setEditText(e.target.value)}
                  rows={3}
                />
                <div className={styles.editControls}>
                  <button className={styles.saveBtn} onClick={() => handleEditSave(review.id)}>Сохранить</button>
                  <button className={styles.cancelBtn} onClick={() => setEditingId(null)}>Отмена</button>
                </div>
              </div>
            ) : (
              <>
                <Stars rating={review.rating} />
                <div className={styles.product}>Товар: {review.product_name}</div>
                <p className={styles.text}>{review.text}</p>
                <div className={styles.reviewControls}>
                  {user?.role === 'user' && review.user_id === user.id && (
                    <button className={styles.editBtn} onClick={() => {
                      setEditingId(review.id)
                      setEditText(review.text)
                      setEditRating(review.rating)
                    }}>Редактировать</button>
                  )}
                  {user?.role === 'admin' && (
                    <button className={styles.deleteBtn} onClick={() => handleDelete(review.id)}>Удалить</button>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
