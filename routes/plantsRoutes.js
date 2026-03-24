const router = require('express').Router();
const ctrl = require('../controllers/plantsController');
const { authenticate } = require('../middleware/auth');

router.get('/', ctrl.getAll);
router.get('/my/list', authenticate, ctrl.getMyPlants);
router.get('/my/compatible', authenticate, ctrl.getCompatible);
router.get('/:id', ctrl.getById);
router.post('/', authenticate, ctrl.create);
router.put('/:id', authenticate, ctrl.update);
router.delete('/:id', authenticate, ctrl.delete);

module.exports = router;
