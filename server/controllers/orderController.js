const Order = require('../models/Order');
const User = require('../models/User');

exports.placeOrder = async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const user = await User.findById(req.user._id);

  if (!user.cart || user.cart.length === 0) {
    return res.status(400).json({ message: 'Cart is empty' });
  }

  const totalPrice = user.cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  const order = await Order.create({
    user: req.user._id,
    items: user.cart,
    shippingAddress,
    paymentMethod,
    totalPrice,
    isPaid: true,
    paidAt: Date.now(),
  });

  user.cart = []; // clear cart
  await user.save();

  res.status(201).json({ message: 'Order placed successfully', order });
};

exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
};