const User = require('../models/User');

// GET: /api/cart
exports.getCart = async (req, res) => {
  res.json(req.user.cart);
};

// POST: /api/cart
exports.addToCart = async (req, res) => {
  const { bookId, title, thumbnail, price, quantity } = req.body;
  const user = await User.findById(req.user._id);

  const existingItem = user.cart.find(item => item.bookId === bookId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({ bookId, title, thumbnail, price, quantity });
  }

  await user.save();
  res.json(user.cart);
};

// PUT: /api/cart/:bookId
exports.updateQuantity = async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);

  const item = user.cart.find(item => item.bookId === req.params.bookId);
  if (item) {
    item.quantity = quantity;
    await user.save();
    res.json(user.cart);
  } else {
    res.status(404).json({ message: 'Item not found in cart' });
  }
};

// DELETE: /api/cart/:bookId
exports.removeFromCart = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter(item => item.bookId !== req.params.bookId);
  await user.save();
  res.json(user.cart);
};

// ✅ DELETE: /api/cart
exports.clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    res.json([]);
  } catch (err) {
    console.error('Failed to clear cart:', err);
    res.status(500).json({ message: 'Failed to clear cart' });
  }
};