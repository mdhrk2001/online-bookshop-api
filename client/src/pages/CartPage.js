import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function CartPage() {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);
  
  const { addToWishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleQuantityChange = (bookId, value) => {
    if (value < 1) return;
    updateQuantity(bookId, value);
    toast.success('Quantity updated');
  };

  const handleRemove = (bookId) => {
    removeFromCart(bookId);
    toast.info('Item removed');
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  const handleSaveForLater = async (item) => {
    try {
      await addToWishlist({
        bookId: item.bookId,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
      });
      removeFromCart(item.bookId);
      toast.info(`${item.title} moved to wishlist`);
    } catch (err) {
      toast.error('Failed to move item to wishlist');
    }
  };  

  return (
    <div style={{ padding: '1rem' }}>
      <h2>🛒 Your Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map(item => (
            <div
              key={item.bookId}
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                padding: '10px',
                marginBottom: '10px',
                gap: '1rem',
              }}
            >
              <img src={item.thumbnail} alt={item.title} width="80" height="100" />
              <div style={{ flexGrow: 1 }}>
                <h4>{item.title}</h4>
                <p>Price: ${item.price}</p>
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.bookId, parseInt(e.target.value))}
                  style={{ width: '50px' }}
                  min="1"
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                <button
                  onClick={() => handleRemove(item.bookId)}
                  style={{
                    padding: '5px 10px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Remove
                </button>

                <button
                  onClick={() => handleSaveForLater(item)}
                  style={{
                    padding: '5px 10px',
                    background: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  ❤️ Save for Later
                </button>
              </div>
            </div>
          ))}

          <h3>Total: ${total}</h3>

          <div style={{ marginTop: '1rem' }}>
            <button
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
              style={{
                padding: '10px 20px',
                background: cart.length === 0 ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                marginRight: '1rem',
              }}
            >
              Proceed to Checkout
            </button>

            <button
              onClick={handleClearCart}
              style={{
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;