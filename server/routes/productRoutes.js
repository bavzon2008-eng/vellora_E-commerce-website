const router = require('express').Router();
const c = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', c.getProducts);
router.get('/meta/filters', c.getMeta); // must stay above '/:id'
router.get('/:id', c.getProduct);
router.post('/', protect, adminOnly, c.createProduct);
router.put('/:id', protect, adminOnly, c.updateProduct);
router.delete('/:id', protect, adminOnly, c.deleteProduct);

module.exports = router;
