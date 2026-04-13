import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import styles from './GiftCards.module.css'

export default function GiftCards() {
  const { user } = useAuth()
  const [cards, setCards] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newCard, setNewCard] = useState({ name: '', description: '', price: '' })
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchCards()
  }, [])

  async function fetchCards() {
    try {
      const res = await fetch('/api/gift-cards')
      const data = await res.json()
      setCards(data)
    } finally {
      setLoading(false)
    }
  }

  async function handleReserve(id) {
    setError('')
    setSuccess('')
    const res = await fetch(`/api/gift-cards/${id}/reserve`, {
      method: 'POST',
      credentials: 'include',
    })
    const data = await res.json()
    if (res.ok) {
      setSuccess('Карта успешно зарезервирована!')
    } else {
      setError(data.error)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Удалить подарочную карту?')) return
    await fetch(`/api/gift-cards/${id}`, { method: 'DELETE', credentials: 'include' })
    fetchCards()
  }

  async function handleAdd(e) {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/gift-cards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ ...newCard, price: parseFloat(newCard.price) }),
    })
    if (res.ok) {
      setShowAddForm(false)
      setNewCard({ name: '', description: '', price: '' })
      fetchCards()
    } else {
      const data = await res.json()
      setError(data.error)
    }
  }

  if (loading) return <div className={styles.loading}>Загрузка...</div>

  return (
    <div>
      <h1 className={styles.title}>Подарочные карты</h1>
      <p className={styles.subtitle}>
        Подарите радость близким — выберите подарочную карту «ДИАМАНД»
      </p>

      {error && <div className={styles.error}>{error}</div>}
      {success && <div className={styles.success}>{success}</div>}

      {user?.role === 'admin' && (
        <div className={styles.adminBar}>
          <button className={styles.addBtn} onClick={() => setShowAddForm(s => !s)}>
            {showAddForm ? 'Отмена' : '+ Добавить карту'}
          </button>
        </div>
      )}

      {showAddForm && user?.role === 'admin' && (
        <form className={styles.addForm} onSubmit={handleAdd}>
          <h3 className={styles.formTitle}>Новая подарочная карта</h3>
          <input
            className={styles.formInput}
            placeholder="Название карты"
            value={newCard.name}
            onChange={e => setNewCard(p => ({ ...p, name: e.target.value }))}
            required
          />
          <textarea
            className={styles.formTextarea}
            placeholder="Описание (необязательно)"
            value={newCard.description}
            onChange={e => setNewCard(p => ({ ...p, description: e.target.value }))}
          />
          <input
            className={styles.formInput}
            type="number"
            placeholder="Номинал (₽)"
            value={newCard.price}
            onChange={e => setNewCard(p => ({ ...p, price: e.target.value }))}
            required
          />
          <div className={styles.formActions}>
            <button type="submit" className={styles.saveBtn}>Добавить</button>
            <button type="button" className={styles.cancelBtn} onClick={() => setShowAddForm(false)}>Отмена</button>
          </div>
        </form>
      )}

      <div className={styles.grid}>
        {cards.map(card => (
          <div key={card.id} className={styles.card}>
            <div className={styles.cardIcon}>🎁</div>
            <div className={styles.cardName}>{card.name}</div>
            <div className={styles.cardPrice}>{Number(card.price).toLocaleString('ru-RU')} ₽</div>
            {card.description && <p className={styles.cardDesc}>{card.description}</p>}
            <div className={styles.cardActions}>
              {user?.role === 'user' && (
                <button className={styles.reserveBtn} onClick={() => handleReserve(card.id)}>
                  Зарезервировать
                </button>
              )}
              {user?.role === 'admin' && (
                <button className={styles.deleteBtn} onClick={() => handleDelete(card.id)}>
                  Удалить
                </button>
              )}
              {!user && (
                <p className={styles.loginNote}>Войдите, чтобы зарезервировать карту</p>
              )}
            </div>
          </div>
        ))}
        {cards.length === 0 && (
          <p className={styles.empty}>Подарочных карт пока нет.</p>
        )}
      </div>
    </div>
  )
}
