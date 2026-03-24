import { useState, useRef, useEffect } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import { products } from '../../data/products'
import styles from './Header.module.css'

const links = [
  { to: '/', label: 'Главная' },
  { to: '/about', label: 'О нас' },
  { to: '/catalog', label: 'Каталог' },
  { to: '/contacts', label: 'Контакты' },
]

function SearchBar() {
  const [query, setQuery] = useState('')
  const searchRef = useRef(null)
  const navigate = useNavigate()

  const results = query.trim()
    ? products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.description.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 6)
    : []

  useEffect(() => {
    function handleClick(e) {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setQuery('')
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleSelect(id) {
    setQuery('')
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
              <img src={p.image} alt={p.name} className={styles.dropdownImg} />
              <div className={styles.dropdownInfo}>
                <div className={styles.dropdownName}>{p.name}</div>
                <div className={styles.dropdownPrice}>{p.price.toLocaleString('ru-RU')} ₽</div>
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

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <NavLink to="/" className={styles.brand}>
            <img src="/images/logo.png" alt="ДИАМАНД" className={styles.logo} />
            <span className={styles.brandName}>ДИАМАНД</span>
          </NavLink>
          <div className={styles.loginForm}>
            <input type="text" placeholder="Логин" className={styles.input} />
            <input type="password" placeholder="Пароль" className={styles.input} />
            <div className={styles.loginActions}>
              <button className={styles.loginBtn}>Вход</button>
              <Link to="/register" className={styles.registerLink}>
                Ещё не зарегистрированы?
              </Link>
            </div>
          </div>
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
