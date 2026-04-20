import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])
  const [allReservations, setAllReservations] = useState([])
  const [orders, setOrders] = useState([])
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      navigate('/')
    }
  }, [user, loading, navigate])

  useEffect(() => {
    if (!user) return

    const loadData = async () => {
      try {
        if (user.role === 'user') {
          const res = await fetch('/api/gift-cards/my-reservations', { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            setReservations(data)
          }
        }
        if (user.role === 'admin') {
          const [reviewsRes, reservationsRes, ordersRes] = await Promise.all([
            fetch('/api/reviews/pending', { credentials: 'include' }),
            fetch('/api/gift-cards/all-reservations', { credentials: 'include' }),
            fetch('/api/messages', { credentials: 'include' }),
          ])
          if (reviewsRes.ok) setPendingReviews(await reviewsRes.json())
          if (reservationsRes.ok) setAllReservations(await reservationsRes.json())
          if (ordersRes.ok) setOrders(await ordersRes.json())
        }
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user])

  async function handleOrderStatus(id, status) {
    const res = await fetch(`/api/messages/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
    }
  }

  async function handleReservationStatus(id, status) {
    const res = await fetch(`/api/gift-cards/reservations/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      setAllReservations(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    }
  }

  if (loading || dataLoading) {
    return <div className={styles.loading}>Загрузка...</div>
  }

  if (!user) return null

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Личный кабинет</h1>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Личные данные</h2>
        <div className={styles.infoCard}>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Имя</span>
            <span className={styles.infoValue}>{user.name}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Email</span>
            <span className={styles.infoValue}>{user.email}</span>
          </div>
          {user.phone && (
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Телефон</span>
              <span className={styles.infoValue}>{user.phone}</span>
            </div>
          )}
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Роль</span>
            <span className={`${styles.infoValue} ${styles.roleBadge} ${styles[user.role]}`}>
              {user.role === 'admin' ? 'Администратор' : 'Пользователь'}
            </span>
          </div>
        </div>
      </div>

      {user.role === 'user' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Зарезервированные подарочные карты</h2>
          {reservations.length === 0 ? (
            <p className={styles.empty}>
              Нет зарезервированных карт.{' '}
              <Link to="/gift-cards" className={styles.link}>Перейти к подарочным картам</Link>
            </p>
          ) : (
            <div className={styles.cardList}>
              {reservations.map(card => (
                <div key={card.id} className={styles.reservationCard}>
                  <div className={styles.cardName}>{card.name}</div>
                  <div className={styles.cardPrice}>{Number(card.price).toLocaleString('ru-RU')} ₽</div>
                  {card.description && <p className={styles.cardDesc}>{card.description}</p>}
                  <div className={styles.reservedAt}>
                    Зарезервировано: {new Date(card.reserved_at).toLocaleDateString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'admin' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>
            Отзывы на модерации{' '}
            {pendingReviews.length > 0 && (
              <span className={styles.badge}>{pendingReviews.length}</span>
            )}
          </h2>
          {pendingReviews.length === 0 ? (
            <p className={styles.empty}>Нет отзывов, ожидающих одобрения.</p>
          ) : (
            <p className={styles.pendingNote}>
              {pendingReviews.length} отзыв(ов) ожидают одобрения.{' '}
              <Link to="/reviews" className={styles.link}>Перейти к отзывам</Link>
            </p>
          )}
        </div>
      )}

      {user.role === 'admin' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Заказы из корзины</h2>
          {orders.length === 0 ? (
            <p className={styles.empty}>Нет заказов.</p>
          ) : (
            <div className={styles.cardList}>
              {orders.map(o => (
                <div key={o.id} className={styles.reservationCard}>
                  <div className={styles.cardName}>{o.sender_name} — {o.sender_email}</div>
                  <div className={styles.cardDesc} style={{ whiteSpace: 'pre-line' }}>{o.body}</div>
                  <div className={styles.reservedAt}>
                    {new Date(o.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  {o.status === 'pending' ? (
                    <div className={styles.statusActions}>
                      <button className={styles.confirmBtn} onClick={() => handleOrderStatus(o.id, 'confirmed')}>Подтвердить</button>
                      <button className={styles.rejectBtn} onClick={() => handleOrderStatus(o.id, 'rejected')}>Отклонить</button>
                    </div>
                  ) : (
                    <div className={`${styles.statusBadge} ${styles[o.status]}`}>
                      {o.status === 'confirmed' ? 'Подтверждён' : 'Отклонён'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {user.role === 'admin' && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Резервации подарочных карт</h2>
          {allReservations.length === 0 ? (
            <p className={styles.empty}>Нет резерваций.</p>
          ) : (
            <div className={styles.cardList}>
              {allReservations.map(r => (
                <div key={r.id} className={styles.reservationCard}>
                  <div className={styles.cardName}>{r.card_name}</div>
                  <div className={styles.cardPrice}>{Number(r.price).toLocaleString('ru-RU')} ₽</div>
                  <div className={styles.cardDesc}>{r.user_name} — {r.user_email}</div>
                  <div className={styles.reservedAt}>
                    Зарезервировано: {new Date(r.reserved_at).toLocaleDateString('ru-RU')}
                  </div>
                  {r.status === 'pending' ? (
                    <div className={styles.statusActions}>
                      <button className={styles.confirmBtn} onClick={() => handleReservationStatus(r.id, 'confirmed')}>Подтвердить</button>
                      <button className={styles.rejectBtn} onClick={() => handleReservationStatus(r.id, 'rejected')}>Отклонить</button>
                    </div>
                  ) : (
                    <div className={`${styles.statusBadge} ${styles[r.status]}`}>
                      {r.status === 'confirmed' ? 'Подтверждена' : 'Отклонена'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
