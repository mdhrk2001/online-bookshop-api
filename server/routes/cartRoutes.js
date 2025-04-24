const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getCart, addToCart, updateQuantity, removeFromCart
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:bookId', updateQuantity);
router.delete('/:bookId', removeFromCart);

module.exports = router;