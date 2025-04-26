import { Link, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import { toast } from 'react-toastify';
import ConfirmModal from './ConfirmModal';

function Navbar() {
  const { userToken, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { wishlist } = useContext(WishlistContext);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    setShowModal(true);
  };

  const confirmLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/'); // ✅ redirect to HomePage
    setShowModal(false);
  };  

  const cancelLogout = () => {
    setShowModal(false);
  };

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {userToken ? (
        <>
          <Link to="/cart" style={{ marginRight: '1rem', position: 'relative' }}>
            Cart
            {cart.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px'
              }}>
                {cart.length}
              </span>
            )}
          </Link>
          <Link to="/wishlist" style={{ marginRight: '1rem', position: 'relative' }}>
            Wishlist
            {wishlist.length > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-12px',
                background: 'red',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px'
              }}>
                {wishlist.length}
              </span>
            )}
          </Link>
          <Link to="/checkout" style={{ marginRight: '1rem' }}>Checkout</Link>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
          <button onClick={handleLogout}>Logout</button>
          <ConfirmModal
            isOpen={showModal}
            onConfirm={confirmLogout}
            onCancel={cancelLogout}
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