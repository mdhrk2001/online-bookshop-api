import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';
import { Link } from 'react-router-dom';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [query, setQuery] = useState('programming');
  const [priceFilter, setPriceFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get(`/books/search?q=${query}`);
        setBooks(res.data);
        setFilteredBooks(res.data); // Set initial filtered data too
      } catch (err) {
        console.error('Failed to fetch books');
      }
    };
    fetchBooks();
  }, [query]);

  // Apply Filters + Sorting when books change or filters change
  useEffect(() => {
    let updated = [...books];

    // Price Filtering
    if (priceFilter === 'low') {
      updated = updated.filter(book => book.price <= 20);
    } else if (priceFilter === 'medium') {
      updated = updated.filter(book => book.price > 20 && book.price <= 50);
    } else if (priceFilter === 'high') {
      updated = updated.filter(book => book.price > 50);
    }

    // Sorting
    if (sortOrder === 'price-asc') {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === 'price-desc') {
      updated.sort((a, b) => b.price - a.price);
    } else if (sortOrder === 'title-asc') {
      updated.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredBooks(updated);
  }, [books, priceFilter, sortOrder]);

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📚 Books</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ marginBottom: '1rem', width: '300px', padding: '5px' }}
      />

      {/* Filters & Sorting */}
      <div style={{ marginBottom: '1rem' }}>
        <select value={priceFilter} onChange={(e) => setPriceFilter(e.target.value)} style={{ marginRight: '10px' }}>
          <option value="">Filter by Price</option>
          <option value="low">Low (≤ $20)</option>
          <option value="medium">Medium ($20 - $50)</option>
          <option value="high">High (≥ $50)</option>
        </select>

        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="">Sort</option>
          <option value="price-asc">Price Low → High</option>
          <option value="price-desc">Price High → Low</option>
          <option value="title-asc">Title A → Z</option>
        </select>
      </div>

      {/* Book Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {filteredBooks.length === 0 ? (
          <p>No books found.</p>
        ) : (
          filteredBooks.map(book => (
            <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
              <Link to={`/books/${book.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
              <img src={book.thumbnail} alt={book.title} width="100%" height="200px" />
              <h4>{book.title}</h4>
              </Link>
              <p>Price: ${book.price}</p>
              <button onClick={() => addToCart(book)}>Add to Cart</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;