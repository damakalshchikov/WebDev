import { useState } from 'react'
import styles from './Reviews.module.css'

const reviews = [
  {
    id: 1,
    author: 'Екатерина М.',
    date: '12 марта 2025',
    rating: 5,
    product: 'Кольцо «Ослепляющий взгляд»',
    text: 'Заказывала кольцо в подарок мужу на годовщину. Качество превзошло все ожидания — бриллиант сверкает невероятно. Упаковка тоже очень красивая. Буду заказывать ещё!',
  },
  {
    id: 2,
    author: 'Алексей В.',
    date: '3 февраля 2025',
    rating: 5,
    product: 'Браслет «Платиновый блеск»',
    text: 'Покупал браслет жене на день рождения. Она в восторге! Платина выглядит роскошно, застёжка надёжная. Сервис на высшем уровне, доставили вовремя.',
  },
  {
    id: 3,
    author: 'Ольга Т.',
    date: '20 января 2025',
    rating: 4,
    product: 'Серьги «Серебряная снежинка»',
    text: 'Очень нежные серьги, камни красивые. Единственное — хотелось бы чуть более детальную инструкцию по уходу. В целом довольна покупкой, буду рекомендовать подругам.',
  },
  {
    id: 4,
    author: 'Наталья С.',
    date: '15 декабря 2024',
    rating: 5,
    product: 'Серьги «Роскошная искра»',
    text: 'Давно мечтала об украшениях из платины. Серьги просто шикарные — лёгкие, блестящие, очень изящные. Носить одно удовольствие. Спасибо магазину за такое качество!',
  },
  {
    id: 5,
    author: 'Дмитрий К.',
    date: '8 ноября 2024',
    rating: 5,
    product: 'Кольцо «Вечная красота»',
    text: 'Покупал обручальное кольцо. Мастер-консультант помог подобрать размер дистанционно — всё подошло идеально. Невеста была в слезах от счастья. Рекомендую всем!',
  },
  {
    id: 6,
    author: 'Марина Л.',
    date: '22 октября 2024',
    rating: 4,
    product: 'Браслет «Тройная волна»',
    text: 'Браслет очень красивый, отлично подходит к любому образу. Серебро не темнеет — значит, родиевое покрытие работает. Немного долго шла доставка, но результат того стоил.',
  },
  {
    id: 7,
    author: 'Светлана П.',
    date: '5 сентября 2024',
    rating: 5,
    product: 'Серьги «Алая тайна»',
    text: 'Сапфиры просто волшебные! Цвет насыщенный, золото тёплое. Уже получила несколько комплиментов от коллег. Упакованы бережно, пришли без повреждений.',
  },
  {
    id: 8,
    author: 'Ирина Ж.',
    date: '17 августа 2024',
    rating: 5,
    product: 'Кольцо «Изумрудное изящество»',
    text: 'Лунный камень в этом кольце переливается просто магически! Серебро качественное, кольцо не давит. Цена очень адекватная для такой красоты. Однозначно рекомендую!',
  },
]

function Stars({ rating }) {
  return (
    <div className={styles.stars}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>★</span>
      ))}
    </div>
  )
}

function ReviewForm() {
  const [form, setForm] = useState({ author: '', product: '', text: '', rating: 0 })
  const [hovered, setHovered] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={styles.successBox}>
        <div className={styles.successIcon}>✓</div>
        <h2 className={styles.successTitle}>Спасибо за отзыв!</h2>
        <p className={styles.successText}>Ваш отзыв отправлен на модерацию и будет опубликован в ближайшее время.</p>
        <button
          className={styles.resetBtn}
          onClick={() => { setSubmitted(false); setForm({ author: '', product: '', text: '', rating: 0 }) }}
        >
          Оставить ещё один отзыв
        </button>
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.formTitle}>Оставить отзыв</h2>
      <div className={styles.formRow}>
        <label className={styles.label}>Ваше имя</label>
        <input
          className={styles.input}
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="Например: Екатерина М."
          required
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Название товара</label>
        <input
          className={styles.input}
          type="text"
          name="product"
          value={form.product}
          onChange={handleChange}
          placeholder="Например: Кольцо «Вечная красота»"
          required
        />
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Оценка</label>
        <div className={styles.ratingPicker}>
          {Array.from({ length: 5 }, (_, i) => (
            <span
              key={i}
              className={(hovered || form.rating) > i ? styles.starFilled : styles.starEmpty}
              style={{ cursor: 'pointer', fontSize: '1.6rem' }}
              onMouseEnter={() => setHovered(i + 1)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setForm(prev => ({ ...prev, rating: i + 1 }))}
            >★</span>
          ))}
        </div>
      </div>
      <div className={styles.formRow}>
        <label className={styles.label}>Текст отзыва</label>
        <textarea
          className={styles.textarea}
          name="text"
          value={form.text}
          onChange={handleChange}
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
  return (
    <div>
      <h1 className={styles.title}>Отзывы покупателей</h1>
      <ReviewForm />
      <div className={styles.list}>
        {reviews.map((review) => (
          <div key={review.id} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.author}>{review.author}</div>
              <div className={styles.date}>{review.date}</div>
            </div>
            <Stars rating={review.rating} />
            <div className={styles.product}>Товар: {review.product}</div>
            <p className={styles.text}>{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
