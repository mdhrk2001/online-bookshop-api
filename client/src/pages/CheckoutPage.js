import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../services/api';

function CheckoutPage() {
  const { cart, setCart } = useContext(CartContext);
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    paymentMethod: 'Cash on Delivery',
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/orders', {
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        paymentMethod: form.paymentMethod,
      }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
  
      setCart([]); // ✅ Directly clear local cart
      toast.success('Order placed successfully!');
      navigate('/order-success', {
        state: {
          orderId: res.data.order._id,
          order: res.data.order
        }
      });      
    } catch (err) {
      toast.error('Order failed');
    }
  };

  return (
    <form onSubmit={placeOrder}>
      <h2>Checkout</h2>

      <h3>Shipping Information</h3>
      <input name="fullName" placeholder="Full Name" value={form.fullName} onChange={handleChange} required />
      <input name="address" placeholder="Address" value={form.address} onChange={handleChange} required />
      <input name="city" placeholder="City" value={form.city} onChange={handleChange} required />
      <input name="postalCode" placeholder="Postal Code" value={form.postalCode} onChange={handleChange} required />
      <input name="country" placeholder="Country" value={form.country} onChange={handleChange} required />

      <h3>Payment Method</h3>
      <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
        <option value="Cash on Delivery">Cash on Delivery</option>
        <option value="Card">Card</option>
      </select>

      <h3>Total: ${total}</h3>
      <button type="submit">Place Order</button>
    </form>
  );
}

export default CheckoutPage;