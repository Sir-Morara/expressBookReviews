const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs'); // Added bcrypt for hashing
const secretKey = 'v@2h#8iL$5nR8!qX'; // Updated secret key
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = {};

const isValid = (username) => { // Check if username exists
    return Object.keys(users).includes(username);
}

const authenticatedUser = (username, password) => { // Compare hashed password
    return users[username] && bcrypt.compareSync(password, users[username].password);
}

regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
    res.json({ token });
});


regd_users.put("/auth/review/:isbn", (req, res) => {
    
  const token = req.headers['authorization']?.split(' ')[1];
    const { isbn } = req.params;
    const { review } = req.body;

    if (!token) {
        return res.status(403).json({ message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);
        req.username = decoded.username; // Use username from token
    } catch (err) {
        return res.status(403).json({ message: "Invalid token" });
    }

    if (!isbn || !review) {
        return res.status(400).json({ message: "ISBN and review are required" });
    }

    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    books[isbn].reviews = books[isbn].reviews || {};
    books[isbn].reviews[req.username] = review; // Use username from token

    res.json({ message: "Review added successfully" });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];
  const { isbn } = req.params;

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.username = decoded.username; // Attach username to request object
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }

  if (!isbn) {
    return res.status(400).json({ message: "ISBN is required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  const userReviews = books[isbn].reviews;

  if (!userReviews || !userReviews[req.username]) {
    return res.status(404).json({ message: "Review not found for this user" });
  }

  delete userReviews[req.username];
  
  res.json({ message: "Review deleted successfully" });
});


module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
