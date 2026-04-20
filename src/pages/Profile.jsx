import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import styles from './Profile.module.css'

export default function Profile() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [reservations, setReservations] = useState([])
  const [pendingReviews, setPendingReviews] = useState([])
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
          const res = await fetch('/api/reviews/pending', { credentials: 'include' })
          if (res.ok) {
            const data = await res.json()
            setPendingReviews(data)
          }
        }
      } finally {
        setDataLoading(false)
      }
    }

    loadData()
  }, [user])

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
    </div>
  )
}
