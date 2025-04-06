const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).send(JSON.stringify(books, null, 4));
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;  // Get the ISBN from the request parameters
  const book = books[isbn];      // Try to find the book by ISBN in the books object
  
  if (book) {
    // If the book is found, return it as a JSON response
    res.status(200).json(book);
  } else {
    // If the book is not found, return a 404 error with a message
    res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
  }
  
  return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author;
let result = [];
for (let key in books) {
  if (books[key].author.toLowerCase() === author.toLowerCase()) {
    result.push(books[key]);
  }
}
if (result.length > 0) {
  res.send(JSON.stringify(result, null, 4));
} else {
  res.status(404).json({ message: "No books found for this author" });
}
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title.toLowerCase();
let result = [];
for (let key in books) {
  if (books[key].title.toLowerCase().includes(title)) {
    result.push(books[key]);
  }
}
if (result.length > 0) {
  res.send(JSON.stringify(result, null, 4));
} else {
  res.status(404).json({ message: "No books found with this title" });
}


  return res.status(300).json({message: "Yet to be implemented"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
