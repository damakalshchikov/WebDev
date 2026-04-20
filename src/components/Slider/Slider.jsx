import { useState, useEffect, useRef } from 'react'
import styles from './Slider.module.css'

export default function Slider({ images = [], alt = '', interval = 4000 }) {
  const filtered = images.filter(Boolean)
  const [index, setIndex] = useState(0)
  const timerRef = useRef(null)

  function resetTimer() {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setIndex(i => (i + 1) % filtered.length), interval)
  }

  useEffect(() => {
    if (filtered.length <= 1) return
    resetTimer()
    return () => clearInterval(timerRef.current)
  }, [filtered.length, interval])

  if (filtered.length === 0) return <div className={styles.noImage}>Нет фото</div>
  if (filtered.length === 1) return <img src={filtered[0]} alt={alt} className={styles.image} />

  function prev(e) {
    e.stopPropagation()
    setIndex(i => (i - 1 + filtered.length) % filtered.length)
    resetTimer()
  }

  function next(e) {
    e.stopPropagation()
    setIndex(i => (i + 1) % filtered.length)
    resetTimer()
  }

  return (
    <div className={styles.slider}>
      <img src={filtered[index]} alt={alt} className={styles.image} />
      <button className={`${styles.btn} ${styles.prev}`} onClick={prev} aria-label="Предыдущее фото">&#8249;</button>
      <button className={`${styles.btn} ${styles.next}`} onClick={next} aria-label="Следующее фото">&#8250;</button>
      <div className={styles.dots}>
        {filtered.map((_, i) => (
          <span
            key={i}
            className={`${styles.dot} ${i === index ? styles.active : ''}`}
            onClick={e => { e.stopPropagation(); setIndex(i); resetTimer() }}
          />
        ))}
      </div>
    </div>
  )
}
