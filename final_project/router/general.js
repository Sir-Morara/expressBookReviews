const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

// Register new user
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;


  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }


  if (users[username]) {
    return res.status(400).json({ message: "Username already exists" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10); // Hash password
  users[username] = { password: hashedPassword };
  return res.status(201).json({ message: "User registered successfully" });
});

// Login user
public_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const user = users[username];

  if (!user || !bcrypt.compareSync(password, user.password)) { // Verify hashed password
    return res.status(401).json({ message: "Invalid username or password" });
  }


  const token = jwt.sign({ username }, 'v@2h#8iL$5nR8!qX', { expiresIn: '1h' });


  return res.status(200).json({ token });
});

// Get the book list available in the shop
public_users.get('/', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);
  if (book) {
    res.json(book);
  } else {
    res.status(404).json({ message: "Book not found" });
  }

});


// Get book details based on author
public_users.get('/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = Object.values(books).filter(book => book.author === author);

  if (booksByAuthor.length > 0) {
    res.json(booksByAuthor);
  } else {
    res.status(404).json({ message: "No books found for this author" });
  }
});

// Get all books based on title
public_users.get('/title/:title', (req, res) => {
  const title = req.params.title;
  const booksByTitle = Object.values(books).filter(book => book.title.toLowerCase().includes(title.toLowerCase()));

  if (booksByTitle.length > 0) {
    res.json(booksByTitle);
  } else {
    res.status(404).json({ message: "No books found with this title" });
  }
});

// Get book review
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(book => book.isbn === isbn);

  if (book && book.reviews) {
    res.json(book.reviews);
  } else if (book) {
    res.json({ message: "No reviews available for this book" });
  } else {
    res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
