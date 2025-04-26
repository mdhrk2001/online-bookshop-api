const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {
  getCart,
  addToCart,
  updateQuantity,
  removeFromCart,
  clearCart, // ✅ Add this
} = require('../controllers/cartController');

const router = express.Router();

router.use(protect);
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:bookId', updateQuantity);
router.delete('/:bookId', removeFromCart);
router.delete('/', clearCart); // ✅ Add this route

module.exports = router;