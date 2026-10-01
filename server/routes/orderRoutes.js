const router = require('express').Router();
const c = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', protect, c.createOrder);
router.get('/my-orders', protect, c.getMyOrders);
router.get('/stats/summary', protect, adminOnly, c.getStats); // above '/:id'
router.get('/', protect, adminOnly, c.getAllOrders);
router.get('/:id', protect, c.getOrder);
router.put('/:id/status', protect, adminOnly, c.updateOrderStatus);

module.exports = router;
