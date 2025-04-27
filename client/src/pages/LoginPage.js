import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function LoginPage() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // ✅ New
  const [showResend, setShowResend] = useState(false);
  const [message, setMessage] = useState('');

  const loginHandler = async (e) => {
    e.preventDefault();
    setMessage('');
    setShowResend(false);

    try {
      const res = await api.post('/auth/login', { email, password });
      login(res.data.token, rememberMe); // ✅ Pass rememberMe to login()
      alert('Logged in!');
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setMessage(msg);

      // Show resend button if user is unverified
      if (msg.toLowerCase().includes('verify')) {
        setShowResend(true);
      }
    }
  };

  const resendVerification = async () => {
    try {
      const res = await api.post('/auth/resend-verification', { email });
      alert(res.data.message || 'Verification email sent again.');
    } catch (err) {
      alert('Failed to resend verification email.');
    }
  };

  return (
    <div>
      <form onSubmit={loginHandler}>
        <h2>Login</h2>
        
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
          required
        />

        {/* ✅ Remember Me checkbox */}
        <div style={{ margin: '10px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />{' '}
            Remember Me
          </label>
        </div>

        <button type="submit">Login</button>
      </form>

      {message && <p style={{ color: 'red' }}>{message}</p>}

      {showResend && (
        <button onClick={resendVerification} style={{ marginTop: '10px' }}>
          Resend Verification Email
        </button>
      )}
    </div>
  );
}

export default LoginPage;