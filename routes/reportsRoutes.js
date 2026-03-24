const router = require('express').Router();
const { summary, activeUsers, popularPlants } = require('../controllers/reportsController');

router.get('/summary', summary);
router.get('/active-users', activeUsers);
router.get('/popular-plants', popularPlants);

module.exports = router;
