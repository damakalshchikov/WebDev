const express = require('express')
const router = express.Router()
const { getMessages, create, reply } = require('../controllers/messagesController')
const { requireAuth, requireUser, requireAdmin } = require('../middleware/auth')

router.get('/', requireAuth, getMessages)
router.post('/', requireUser, create)
router.post('/:id/reply', requireAdmin, reply)

module.exports = router
