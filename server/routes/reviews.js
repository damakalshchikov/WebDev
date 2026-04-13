const express = require('express')
const router = express.Router()
const { getApproved, getPending, create, update, approve, remove } = require('../controllers/reviewsController')
const { requireUser, requireAdmin } = require('../middleware/auth')

router.get('/', getApproved)
router.get('/pending', requireAdmin, getPending)
router.post('/', requireUser, create)
router.put('/:id', requireUser, update)
router.patch('/:id/approve', requireAdmin, approve)
router.delete('/:id', requireAdmin, remove)

module.exports = router
