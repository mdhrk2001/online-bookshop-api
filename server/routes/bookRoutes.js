const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query.q;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
    const books = response.data.items.map(book => ({
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      price: Math.floor(Math.random() * 40) + 10, // mock price
    }));
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch books' });
  }
});

router.get('/:id', async (req, res) => {
  const bookId = req.params.id;
  try {
    const response = await axios.get(`https://www.googleapis.com/books/v1/volumes/${bookId}`);
    const book = response.data;

    const singleBook = {
      id: book.id,
      title: book.volumeInfo.title,
      authors: book.volumeInfo.authors,
      description: book.volumeInfo.description,
      thumbnail: book.volumeInfo.imageLinks?.thumbnail,
      price: Math.floor(Math.random() * 40) + 10, // again mock price
      stock: Math.floor(Math.random() * 20), // 🛒 mock stock 0-20
    };

    res.json(singleBook);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch book details' });
  }
});


module.exports = router;