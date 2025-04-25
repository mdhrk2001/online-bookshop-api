const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { placeOrder, getUserOrders } = require('../controllers/orderController');
const { body } = require('express-validator');
const validateRequest = require('../middleware/validateRequest');
const Order = require('../models/Order');

const router = express.Router();

router.use(protect);
// Validation rules for placing an order
router.post('/',
    [
      body('shippingAddress.fullName').notEmpty(),
      body('shippingAddress.address').notEmpty(),
      body('shippingAddress.city').notEmpty(),
      body('shippingAddress.postalCode').notEmpty(),
      body('shippingAddress.country').notEmpty(),
      body('paymentMethod').notEmpty(),
    ],
    validateRequest,
    placeOrder
  );
router.get('/', getUserOrders);

// implementing the invoice route
router.get('/:orderId/invoice', protect, async (req, res) => {
  const order = await Order.findById(req.params.orderId).populate('user', 'username email');
  if (!order) return res.status(404).json({ message: 'Order not found' });

  const html = `
    <html>
    <head>
      <title>Invoice</title>
      <style>
        body { font-family: Arial; padding: 20px; }
        h1 { color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
      </style>
    </head>
    <body>
      <h1>Invoice for Order: ${order._id}</h1>
      <p><strong>Customer:</strong> ${order.user.username} (${order.user.email})</p>
      <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>

      <h2>Shipping Address</h2>
      <p>
        ${order.shippingAddress.fullName}<br>
        ${order.shippingAddress.address}<br>
        ${order.shippingAddress.city}, ${order.shippingAddress.postalCode}<br>
        ${order.shippingAddress.country}
      </p>

      <h2>Order Items</h2>
      <table>
        <tr><th>Title</th><th>Qty</th><th>Price</th><th>Total</th></tr>
        ${order.items.map(item => `
          <tr>
            <td>${item.title}</td>
            <td>${item.quantity}</td>
            <td>$${item.price}</td>
            <td>$${item.price * item.quantity}</td>
          </tr>`).join('')}
      </table>

      <h3>Total: $${order.totalPrice}</h3>
      <button onclick="window.print()" style="margin-top:20px;padding:10px 15px;">
        🖨️ Print Invoice
      </button>
    </body>
    </html>
  `;

  res.send(html);
});

module.exports = router;