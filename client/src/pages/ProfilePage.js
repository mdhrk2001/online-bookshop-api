import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function ProfilePage() {
  const { userToken } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [form, setForm] = useState({ username: '', email: '', password: '' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/users/profile', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setProfile(res.data);
        setForm({
          username: res.data.username,
          email: res.data.email,
          password: '',
        });
      } catch (err) {
        alert('Failed to load profile');
      }
    };

    const fetchOrders = async () => {
      try {
        const res = await api.get('/orders', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setOrders(res.data);
      } catch (err) {
        alert('Failed to load orders');
      }
    };

    fetchProfile();
    fetchOrders();
  }, [userToken]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const updateProfile = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put('/users/profile', form, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      alert('Profile updated');
      setProfile(res.data);
    } catch (err) {
      alert('Update failed');
    }
  };

  return (
    <div>
      <h2>Profile</h2>

      {profile && (
        <p>
          <strong>Logged in as:</strong> {profile.username} ({profile.email})
        </p>
      )}

      <form onSubmit={updateProfile}>
        <input
          name="username"
          value={form.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="New Password"
        />
        <button type="submit">Update Profile</button>
      </form>

      <hr />

      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        <ul>
          {orders.map(order => (
            <li key={order._id} style={{ marginBottom: '10px' }}>
              <p><strong>Order ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> ${order.totalPrice}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <a
                href={`http://localhost:5000/api/orders/${order._id}/invoice`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Invoice
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ProfilePage;