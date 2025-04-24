import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CartPage() {
  const { cart, fetchCart } = useContext(CartContext);
  const { userToken } = useContext(AuthContext);
  const navigate = useNavigate();

  const updateQuantity = async (bookId, quantity) => {
    if (quantity < 1) return;
    try {
      await api.put(`/cart/${bookId}`, { quantity }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchCart();
    } catch (err) {
      alert('Failed to update quantity');
    }
  };

  const removeItem = async (bookId) => {
    try {
      await api.delete(`/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      fetchCart();
    } catch (err) {
      alert('Failed to remove item');
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div key={item.bookId} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              <img src={item.thumbnail} alt={item.title} width="100px" />
              <h4>{item.title}</h4>
              <p>Price: ${item.price}</p>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.bookId, parseInt(e.target.value))}
                style={{ width: '50px' }}
              />
              <button onClick={() => removeItem(item.bookId)}>Remove</button>
            </div>
          ))}
          <h3>Total: ${total}</h3>
          <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
}

export default CartPage;