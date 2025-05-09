const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  return users.some(user => user.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
regd_users.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
    req.session.authorization = { accessToken, username };
    return res.status(200).json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required." });
  }

  if (books[isbn]) {
    if (!books[isbn].reviews) {
      books[isbn].reviews = {};
    }

    books[isbn].reviews[username] = review;

    return res.status(200).json({ message: "Review successfully added or modified." });
  } else {
    return res.status(404).json({ message: "Book not found." });
  }
});

//Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({ message: "User not logged in." });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: "Book not found." });
  }

  if (book.reviews && book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: "Review deleted successfully." });
  } else {
    return res.status(404).json({ message: "No review by this user to delete." });
  }
});

module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.authenticated = regd_users;
module.exports.users = users;
