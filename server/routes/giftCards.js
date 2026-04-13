const express = require('express')
const router = express.Router()
const { getAll, create, remove, reserve, getUserReservations } = require('../controllers/giftCardsController')
const { requireAdmin, requireUser, requireAuth } = require('../middleware/auth')

router.get('/', getAll)
router.get('/my-reservations', requireAuth, getUserReservations)
router.post('/', requireAdmin, create)
router.delete('/:id', requireAdmin, remove)
router.post('/:id/reserve', requireUser, reserve)

module.exports = router
