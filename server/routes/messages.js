const express = require('express')
const router = express.Router()
const { getMessages, create, reply, updateStatus } = require('../controllers/messagesController')
const { requireAuth, requireUser, requireAdmin } = require('../middleware/auth')

router.get('/', requireAuth, getMessages)
router.post('/', requireUser, create)
router.post('/:id/reply', requireAdmin, reply)
router.patch('/:id/status', requireAdmin, updateStatus)

module.exports = router
