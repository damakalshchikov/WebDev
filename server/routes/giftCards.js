const express = require('express')
const router = express.Router()
const { getAll, create, remove, reserve, getUserReservations, getAllReservations, updateReservationStatus } = require('../controllers/giftCardsController')
const { requireAdmin, requireUser, requireAuth } = require('../middleware/auth')

router.get('/', getAll)
router.get('/my-reservations', requireAuth, getUserReservations)
router.get('/all-reservations', requireAdmin, getAllReservations)
router.patch('/reservations/:id/status', requireAdmin, updateReservationStatus)
router.post('/', requireAdmin, create)
router.delete('/:id', requireAdmin, remove)
router.post('/:id/reserve', requireUser, reserve)

module.exports = router
