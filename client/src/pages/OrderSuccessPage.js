import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';

function OrderSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const orderId = location.state?.orderId;
  const order = location.state?.order;

  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!orderId || !order) {
      navigate('/');
    }
  }, [orderId, order, navigate]);

  const total = order?.items?.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <motion.div
      style={{ padding: '2rem', textAlign: 'center' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      {/* 🎉 Confetti */}
      <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />

      <h2>✅ Order Placed Successfully!</h2>
      <p>Thank you for your purchase.</p>
      <p><strong>Order ID:</strong> {orderId}</p>

      {/* 🧾 Styled Summary */}
      {order && (
        <div style={{
          marginTop: '2rem',
          maxWidth: '600px',
          marginInline: 'auto',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          backgroundColor: '#f9f9f9',
          textAlign: 'left'
        }}>
          <h3>🛒 Order Summary</h3>
          {order.items.map((item, index) => (
            <div
              key={index}
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '10px',
                gap: '10px'
              }}
            >
              <img src={item.thumbnail} alt={item.title} width="60" height="90" style={{ borderRadius: '4px' }} />
              <div>
                <strong>{item.title}</strong><br />
                Quantity: {item.quantity}<br />
                Price: ${item.price}
              </div>
            </div>
          ))}
          <h4 style={{ textAlign: 'right' }}>Total: ${total}</h4>
        </div>
      )}

      {/* Buttons */}
      <div style={{ marginTop: '2rem' }}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/')}
          style={{
            marginRight: '1rem',
            padding: '10px 20px',
            background: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Back to Home
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/profile')}
          style={{
            padding: '10px 20px',
            background: '#28A745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          View My Orders
        </motion.button>
      </div>

      {/* 📄 Invoice Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={() => window.open(`http://localhost:5000/api/orders/${orderId}/invoice`, '_blank')}
        style={{
          marginTop: '1rem',
          padding: '10px 20px',
          background: '#6c63ff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        📄 Download Invoice
      </motion.button>
    </motion.div>
  );
}

export default OrderSuccessPage;