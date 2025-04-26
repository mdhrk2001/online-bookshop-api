import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const { userToken, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [prevCartCount, setPrevCartCount] = useState(cart.length);
  const [animateCartBadge, setAnimateCartBadge] = useState(false);
  const [prevCount, setPrevCount] = useState(wishlist.length);
  const [animateBadge, setAnimateBadge] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
    setShowModal(false);
  };

  const cancelLogout = () => {
    setShowModal(false);
  };

  useEffect(() => {
    if (cart.length !== prevCartCount) {
      setAnimateCartBadge(true);
      setTimeout(() => setAnimateCartBadge(false), 300);
      setPrevCartCount(cart.length);
    }
  }, [cart.length, prevCartCount]);

  useEffect(() => {
    if (wishlist.length !== prevCount) {
      setAnimateBadge(true);
      setTimeout(() => setAnimateBadge(false), 300);
      setPrevCount(wishlist.length);
    }
  }, [wishlist.length, prevCount]);

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {userToken ? (
        <>
          <Link to="/cart" style={{ marginRight: '1rem', position: 'relative' }}>
            Cart
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.span
                  key="cart-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: animateCartBadge ? 1.4 : 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {cart.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link to="/wishlist" style={{ marginRight: '1rem', position: 'relative' }}>
            Wishlist
            <AnimatePresence>
              {wishlist.length > 0 && (
                <motion.span
                  key="wishlist-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: animateBadge ? 1.4 : 1 }}
                  exit={{ scale: 0 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-12px',
                    background: 'red',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  {wishlist.length}
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          <Link to="/checkout" style={{ marginRight: '1rem' }}>Checkout</Link>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>

          <button onClick={handleLogout}>Logout</button>

          <ConfirmModal
            isOpen={showModal}
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
            message="Are you sure you want to logout?" // ✅ Custom message
          />
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}

export default Navbar;