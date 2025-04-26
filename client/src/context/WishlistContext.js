import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { userToken } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]);

  // 🔁 Load wishlist when token changes
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userToken) return;
      try {
        const res = await api.get('/wishlist', {
          headers: { Authorization: `Bearer ${userToken}` },
        });
        setWishlist(res.data);
      } catch (err) {
        console.error('Failed to fetch wishlist');
      }
    };

    fetchWishlist();
  }, [userToken]);

  // ➕ Add to wishlist
  const addToWishlist = async (item) => {
    try {
      const res = await api.post('/wishlist', item, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to add to wishlist');
    }
  };

  // ➖ Remove from wishlist
  const removeFromWishlist = async (bookId) => {
    try {
      const res = await api.delete(`/wishlist/${bookId}`, {
        headers: { Authorization: `Bearer ${userToken}` },
      });
      setWishlist(res.data);
    } catch (err) {
      console.error('Failed to remove from wishlist');
    }
  };

  // 🔁 Move item to cart then remove from wishlist
  const moveToCart = async (item, addToCart) => {
    try {
      await addToCart({
        id: item.bookId,
        title: item.title,
        thumbnail: item.thumbnail,
        price: item.price,
      });
      await removeFromWishlist(item.bookId);
    } catch (err) {
      console.error('Failed to move item to cart');
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        setWishlist, // optional, still exposed for flexibility
        addToWishlist,
        removeFromWishlist,
        moveToCart
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};