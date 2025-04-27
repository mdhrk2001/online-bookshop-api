const express = require('express');
const axios = require('axios');
const router = express.Router();

const API_KEY = process.env.GOOGLE_BOOKS_API_KEY;

const cache = {}; // 🧠 Simple in-memory cache
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in milliseconds

// 📚 Helper functions for cache
const setCache = (key, data) => {
  cache[key] = {
    data,
    expiry: Date.now() + CACHE_TTL,
  };
};

const getCache = (key) => {
  const cached = cache[key];
  if (!cached) return null;
  if (Date.now() > cached.expiry) {
    delete cache[key]; // Expired, clean it
    return null;
  }
  return cached.data;
};

// 📚 Search books
router.get('/search', async (req, res) => {
  const query = req.query.q;
  const cacheKey = `search_${query}`;

  const cached = getCache(cacheKey);
  if (cached) {
    console.log('✅ Serving from CACHE (search):', query);
    return res.json(cached);
  }

  try {
    const response = await axios.get('https://www.googleapis.com/books/v1/volumes', {
      params: { q: query, key: API_KEY },
    });

    const books = response.data.items?.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      price: Math.floor(Math.random() * 40) + 10,
    })) || [];

    setCache(cacheKey, books);
    console.log('✅ Saved to CACHE (search):', query);

    res.json(books);
  } catch (err) {
    console.error('❌ Google API Error (Search):', err.message);
    res.status(503).json({ message: 'Failed to fetch books. Please try again later.' });
  }
});

// 📖 Get single book details
router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  const cacheKey = `book_${bookId}`;

  const cached = getCache(cacheKey);
  if (cached) {
    console.log('✅ Serving from CACHE (book):', bookId);
    return res.json(cached);
  }

  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`, {
      params: { key: API_KEY },
    });

    const book = response.data;

    const singleBook = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      price: Math.floor(Math.random() * 40) + 10,
      stock: Math.floor(Math.random() * 20),
    };

    setCache(cacheKey, singleBook);
    console.log('✅ Saved to CACHE (book):', bookId);

    res.json(singleBook);
  } catch (err) {
    console.error('❌ Google API Error (Book Details):', err.message);
    res.status(503).json({ message: 'Failed to fetch book details. Please try again later.' });
  }
});

module.exports = router;