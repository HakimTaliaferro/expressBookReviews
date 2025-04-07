const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
return users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
return users.some(user => user.username === username && user.password === password);

}

//only registered users can login
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
  
    // Validate input
    if (!review) {
      return res.status(400).json({ message: "Review is required." });
    }
  
    // Check if book exists
    if (books[isbn]) {
      // Initialize reviews object if it doesn't exist
      if (!books[isbn].reviews) {
        books[isbn].reviews = {};
      }
  
      // Add or modify review
      books[isbn].reviews[username] = review;
  
      return res.status(200).json({ message: "Review successfully added or modified." });
    } else {
      return res.status(404).json({ message: "Book not found." });
    }
    
  });

module.exports.isValid = isValid;
module.exports.authenticatedUser = authenticatedUser;
module.exports.authenticated = regd_users;
module.exports.users = users;
