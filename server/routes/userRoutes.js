const router = require('express').Router();
const { getUsers, getUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', protect, adminOnly, getUsers);
router.get('/:id', protect, adminOnly, getUser);

module.exports = router;
