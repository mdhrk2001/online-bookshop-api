import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  const fetchCart = async () => {
    if (!userToken) return;
    try {
      const res = await api.get('/cart', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Failed to load cart');
    }
  };

  useEffect(() => {
    fetchCart();
  }, [userToken]);

  const addToCart = async (book) => {
    try {
      const res = await api.post('/cart', {
        bookId: book.id,
        title: book.title,
        thumbnail: book.thumbnail,
        price: book.price,
        quantity: 1,
      }, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Failed to add to cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};