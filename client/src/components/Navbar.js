import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const { userToken, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav style={{ padding: '1rem', background: '#eee' }}>
      <Link to="/" style={{ marginRight: '1rem' }}>Home</Link>
      {userToken ? (
        <>
          <Link to="/cart" style={{ marginRight: '1rem' }}>
            Cart ({cart.length})
          </Link>
          <Link to="/profile" style={{ marginRight: '1rem' }}>Profile</Link>
          <button onClick={logout}>Logout</button>
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