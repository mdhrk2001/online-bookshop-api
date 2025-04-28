import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { toast } from 'react-toastify';

function HomePage() {
  const { cart, addToCart } = useContext(CartContext);

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState(''); // 🔥 User input
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const defaultQuery = 'programming'; // 🌟 fallback keyword

  // 📚 Fetch books from API
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      setError('');
      try {
        const keyword = query.trim() ? query : defaultQuery;
        const res = await api.get(`/books/search?q=${keyword}`);
        setBooks(res.data || []);
        setFilteredBooks(res.data || []);
      } catch (err) {
        console.error('Failed to fetch books:', err.message);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  // 🎯 Apply Filters and Sorting
  useEffect(() => {
    let updated = [...books];

    if (priceFilter === 'low') {
      updated = updated.filter(book => book.price <= 20);
    } else if (priceFilter === 'medium') {
      updated = updated.filter(book => book.price > 20 && book.price <= 50);
    } else if (priceFilter === 'high') {
      updated = updated.filter(book => book.price > 50);
    }

    if (sortOrder === 'price-asc') {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'title-asc') {
      updated.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(updated);
  }, [books, priceFilter, sortOrder]);

  // 🛒 Handle Add to Cart
  const handleAddToCart = (book) => {
    const exists = cart.find(item => item.bookId === book.id || item.id === book.id);
    if (exists) {
      toast.info('Book is already in the cart!');
      return;
    }
    addToCart(book);
    toast.success(`${book.title} added to cart!`);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 Book Collection</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          marginBottom: '1rem',
          width: '300px',
          padding: '8px',
          borderRadius: '4px',
          border: '1px solid #ccc'
        }}
      />

      {/* Filters and Sorting */}
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <select
          value={priceFilter}
          onChange={(e) => setPriceFilter(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="">Filter by Price</option>
          <option value="low">Low (≤ $20)</option>
          <option value="medium">Medium ($20 - $50)</option>
          <option value="high">High (≥ $50)</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: '5px', borderRadius: '4px' }}
        >
          <option value="">Sort</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="title-asc">Title A → Z</option>
        </select>
      </div>

      {/* Loading or Error */}
      {loading ? (
        <p>Loading books...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          {/* Book Grid */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
            {filteredBooks.length === 0 ? (
              <p>No books found.</p>
            ) : (
              filteredBooks.map((book) => (
                <div
                  key={book.id}
                  style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    width: '200px',
                    borderRadius: '8px',
                    textAlign: 'center',
                  }}
                >
                  <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    <img
                      src={book.thumbnail || 'https://via.placeholder.com/150'}
                      alt={book.title}
                      width="100%"
                      height="200px"
                      style={{ objectFit: 'cover', borderRadius: '4px' }}
                    />
                    <h4 style={{ margin: '10px 0' }}>{book.title}</h4>
                  </Link>
                  <p><strong>${book.price}</strong></p>
                  <button
                    onClick={() => handleAddToCart(book)}
                    style={{
                      marginTop: '5px',
                      padding: '5px 10px',
                      backgroundColor: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default HomePage;