import { useEffect, useState, useContext } from 'react';
import api from '../services/api';
import { CartContext } from '../context/CartContext';

function HomePage() {
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState('programming');
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await api.get(`/books/search?q=${query}`);
        setBooks(res.data);
      } catch (err) {
        console.error('Failed to fetch books');
      }
    };
    fetchBooks();
  }, [query]);

  return (
    <div>
      <h2>Books</h2>
      <input
        type="text"
        placeholder="Search books..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
        {books.map(book => (
          <div key={book.id} style={{ border: '1px solid #ccc', padding: '10px', width: '200px' }}>
            <img src={book.thumbnail} alt={book.title} width="100%" />
            <h4>{book.title}</h4>
            <p>Price: ${book.price}</p>
            <button onClick={() => addToCart(book)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HomePage;