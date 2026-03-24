const router = require('express').Router();
const ctrl = require('../controllers/sharesController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);

router.get('/', ctrl.getAll);
router.get('/history', ctrl.getHistory);
router.post('/', ctrl.create);
router.get('/:id', ctrl.getById);
router.patch('/:id/accept', ctrl.accept);
router.patch('/:id/reject', ctrl.reject);
router.delete('/:id', ctrl.delete);

module.exports = router;
