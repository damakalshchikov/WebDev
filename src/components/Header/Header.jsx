import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Header.module.css'

const links = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/contacts', label: 'Контакты' },
  { to: '/reviews', label: 'Отзывы' },
  { to: '/gift-cards', label: 'Подарочные карты' },
]

function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const searchRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?search=${encodeURIComponent(query)}`)
        const data = await res.json()
        setResults(Array.isArray(data) ? data.slice(0, 6) : [])
      } catch {
        setResults([])
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery('')
        setResults([])
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(id) {
    setQuery('')
    setResults([])
    navigate(`/catalog/${id}`)
  }

  return (
    <div className={styles.searchBar} ref={searchRef}>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="Поиск украшений..."
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      {query.trim() && (
        <div className={styles.dropdown}>
          {results.length > 0 ? results.map(p => (
            <div key={p.id} className={styles.dropdownItem} onClick={() => handleSelect(p.id)}>
              {p.image && <img src={p.image} alt={p.name} className={styles.dropdownImg} />}
              <div className={styles.dropdownInfo}>
                <div className={styles.dropdownName}>{p.name}</div>
                <div className={styles.dropdownPrice}>{Number(p.price).toLocaleString('ru-RU')} ₽</div>
              </div>
            </div>
          )) : (
            <div className={styles.noResults}>Ничего не найдено</div>
          )}
        </div>
      )}
    </div>
  )
}

function LoginForm() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        className={styles.input}
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Пароль"
        className={styles.input}
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      {error && <div className={styles.loginError}>{error}</div>}
      <div className={styles.loginActions}>
        <button type="submit" className={styles.loginBtn} disabled={submitting}>
          {submitting ? '...' : 'Вход'}
        </button>
        <Link to="/register" className={styles.registerLink}>
          Ещё не зарегистрированы?
        </Link>
      </div>
    </form>
  )
}

function UserActions() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    await logout()
    navigate('/')
  }

  return (
    <div className={styles.userActions}>
      <span className={styles.userName}>Привет, {user.name}!</span>
      <Link to="/profile" className={styles.actionLink}>Личный кабинет</Link>
      <button onClick={handleLogout} className={styles.logoutBtn}>Выход</button>
    </div>
  )
}

export default function Header() {
  const { user, loading } = useAuth()

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <NavLink to="/" className={styles.brand}>
            <img src="/images/logo.png" alt="ДИАМАНД" className={styles.logo} />
            <span className={styles.brandName}>ДИАМАНД</span>
          </NavLink>
          {!loading && (user ? <UserActions /> : <LoginForm />)}
        </div>
        <nav className={styles.nav}>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                isActive ? `${styles.navLink} ${styles.active}` : styles.navLink
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <SearchBar />
      </div>
    </header>
  )
}
