import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';
import api from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

function BookDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [book, setBook] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/books/${id}`);
        setBook(res.data);
        setRating(Math.floor(Math.random() * 5) + 1); // ⭐ Set random rating once
      } catch (err) {
        console.error('Failed to fetch book details:', err.message);
        toast.error('Failed to load book details.');
      }
    };

    if (id) fetchBook();
  }, [id]);

  const handleAddToCart = () => {
    if (book.stock === 0) {
      toast.error('Out of Stock');
      return;
    }
    addToCart(book);
    toast.success(`${book.title} added to cart`);
  };

  const handleBuyNow = () => {
    if (book.stock === 0) {
      toast.error('Out of Stock');
      return;
    }
    addToCart(book);
    navigate('/checkout');
  };

  if (!book) return <p style={{ padding: '1rem' }}>Loading...</p>;

  const renderDescription = () => {
    if (!book.description) {
      return <p style={{ color: '#666' }}>No Description Available.</p>;
    }

    const shortened = book.description.slice(0, 500);

    return (
      <div style={{ fontSize: '16px', lineHeight: '1.6', color: '#333', marginTop: '1rem' }}>
        <AnimatePresence initial={false}>
          <motion.div
            key={showFullDescription ? 'full' : 'short'}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div
              dangerouslySetInnerHTML={{
                __html: showFullDescription
                  ? book.description
                  : shortened + (book.description.length > 500 ? '...' : ''),
              }}
            />
          </motion.div>
        </AnimatePresence>

        {book.description.length > 500 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            style={{
              marginTop: '10px',
              background: 'none',
              border: 'none',
              color: '#007BFF',
              cursor: 'pointer',
              textDecoration: 'underline',
              fontSize: '14px'
            }}
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>
    );
  };

  const renderRating = () => (
    <div style={{ marginTop: '10px' }}>
      <strong>Rating:</strong> {' '}
      {'⭐'.repeat(rating)}
      {'☆'.repeat(5 - rating)}
    </div>
  );

  return (
    <div style={{ padding: '1rem', position: 'relative', paddingBottom: '140px' }}>
      
      {/* 🔙 Back to Home */}
      <Link
        to="/"
        style={{
          display: 'inline-block',
          marginBottom: '20px',
          background: '#007BFF',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '5px',
          textDecoration: 'none'
        }}
      >
        ← Back to Home
      </Link>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem' }}>
        <img
          src={book.thumbnail || 'https://via.placeholder.com/300x400?text=No+Image'}
          alt={book.title}
          style={{ width: '300px', height: '400px', objectFit: 'cover', borderRadius: '8px' }}
        />

        <div style={{ flex: '1', minWidth: '250px' }}>
          <h2 style={{ fontSize: '28px' }}>{book.title}</h2>

          {book.authors && (
            <p><strong>Author{book.authors.length > 1 ? 's' : ''}:</strong> {book.authors.join(', ')}</p>
          )}

          {book.categories && (
            <p><strong>Categories:</strong> {book.categories.join(', ')}</p>
          )}

          <p><strong>Price:</strong> ${book.price}</p>
          <p><strong>Stock:</strong> {book.stock > 0 ? `${book.stock} available` : 'Out of Stock'}</p>

          {/* Rating */}
          {renderRating()}

          {/* Description */}
          {renderDescription()}
        </div>
      </div>

      {/* 🚀 Floating Action Buttons */}
      {book.stock > 0 && (
        <div style={{ position: 'fixed', bottom: '20px', right: '20px', display: 'flex', gap: '10px', zIndex: 1000 }}>
          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={handleAddToCart}
            style={{
              padding: '12px 24px',
              background: '#ffc107',
              color: '#333',
              fontSize: '16px',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            ➕ Add to Cart
          </motion.button>

          <motion.button
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
            onClick={handleBuyNow}
            style={{
              padding: '12px 24px',
              background: '#28a745',
              color: 'white',
              fontSize: '16px',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            🚀 Buy Now
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default BookDetailsPage;