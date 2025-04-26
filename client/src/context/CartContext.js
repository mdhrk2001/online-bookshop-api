import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [cart, setCart] = useState([]);

  // 🔄 Fetch cart when token is available
  useEffect(() => {
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

    fetchCart();
  }, [userToken]);

  // ➕ Add item to cart
  const addToCart = async (book) => {
    try {
      const res = await api.post(
        '/cart',
        {
          bookId: book.id,
          title: book.title,
          thumbnail: book.thumbnail,
          price: book.price,
          quantity: 1,
        },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setCart(res.data);
    } catch (err) {
      console.error('Failed to add to cart');
    }
  };

  // ➖ Remove item from cart
  const removeFromCart = async (bookId) => {
    try {
      const res = await api.delete(`/cart/${bookId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCart(res.data);
    } catch (err) {
      console.error('Failed to remove item from cart');
    }
  };

  // 🔁 Update item quantity
  const updateQuantity = async (bookId, quantity) => {
    try {
      const res = await api.put(
        `/cart/${bookId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${userToken}` },
        }
      );
      setCart(res.data);
    } catch (err) {
      console.error('Failed to update cart quantity');
    }
  };

  // 🧹 Clear entire cart
  const clearCart = async () => {
    try {
      await api.delete('/cart', {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setCart([]);
    } catch (err) {
      console.error('Failed to clear cart');
    }
  };

  // 🧼 Auto-clear on logout
  useEffect(() => {
    if (!userToken) {
      setCart([]);
    }
  }, [userToken]);

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};