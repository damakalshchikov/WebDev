const express = require('express')
const session = require('express-session')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const productsRoutes = require('./routes/products')
const categoriesRoutes = require('./routes/categories')
const reviewsRoutes = require('./routes/reviews')
const messagesRoutes = require('./routes/messages')
const giftCardsRoutes = require('./routes/giftCards')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}))

app.use(session({
  secret: process.env.SESSION_SECRET || 'jewelry-diamand-secret-2024',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
}))

app.use('/api/auth', authRoutes)
app.use('/api/products', productsRoutes)
app.use('/api/categories', categoriesRoutes)
app.use('/api/reviews', reviewsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/gift-cards', giftCardsRoutes)

app.listen(PORT, () => {
  console.log(`Сервер запущен на порту ${PORT}`)
})
