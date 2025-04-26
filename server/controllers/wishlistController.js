const User = require('../models/User');

// GET: /api/wishlist
exports.getWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json(user.wishlist);
};

// POST: /api/wishlist
exports.addToWishlist = async (req, res) => {
  const { bookId, title, thumbnail, price } = req.body;
  const user = await User.findById(req.user._id);

  const exists = user.wishlist.some(item => item.bookId === bookId);
  if (!exists) {
    user.wishlist.push({ bookId, title, thumbnail, price });
    await user.save();
  }

  res.json(user.wishlist);
};

// DELETE: /api/wishlist/:bookId
exports.removeFromWishlist = async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter(item => item.bookId !== req.params.bookId);
  await user.save();
  res.json(user.wishlist);
};