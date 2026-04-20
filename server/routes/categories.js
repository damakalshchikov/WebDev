const express = require('express')
const router = express.Router()
const { getAll, create } = require('../controllers/categoriesController')
const { requireAdmin } = require('../middleware/auth')

router.get('/', getAll)
router.post('/', requireAdmin, create)

module.exports = router
