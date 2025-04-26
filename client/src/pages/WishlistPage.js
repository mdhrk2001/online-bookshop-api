import { useContext } from 'react';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';

function WishlistPage() {
  const { addToCart } = useContext(CartContext);
  const {
    wishlist,
    removeFromWishlist,
    moveToCart
  } = useContext(WishlistContext);

  const handleMoveToCart = async (item) => {
    await moveToCart(item, addToCart);
    toast.success(`${item.title} moved to cart`);
  };

  const handleRemove = async (bookId) => {
    await removeFromWishlist(bookId);
    toast.info('Removed from wishlist');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <AnimatePresence>
          {wishlist.map(item => (
            <motion.div
              key={item.bookId}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -100, transition: { duration: 0.4 } }}
              layout
              style={{
                border: '1px solid #ccc',
                margin: '10px 0',
                padding: '10px',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center'
              }}
            >
              <img src={item.thumbnail} alt={item.title} width="80" />
              <div style={{ flexGrow: 1 }}>
                <h4>{item.title}</h4>
                <p>${item.price}</p>
              </div>
              <div>
                <button onClick={() => handleMoveToCart(item)} style={{ marginRight: '0.5rem' }}>
                  ➕ Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item.bookId)}
                  style={{ background: '#dc3545', color: 'white' }}
                >
                  Remove
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}

export default WishlistPage;