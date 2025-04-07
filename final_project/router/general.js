const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();



public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Step 1: Check if both username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Step 2: Check if the user already exists
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Step 3: Add new user to the users array
    users.push({ username, password });

    // Step 4: Return success message
    return res.status(201).json({ message: "User successfully registered." });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    try {
      // Make the GET request using Axios
      const response = await axios.get('./bookdb.js'); 
      // Return the list of books as JSON
      res.status(200).json(response.data);
    } catch (error) {
      res.status(500).json({
        message: "Error fetching books list",
        error: error.message
      });
    }
  });

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    try {
      const isbn = req.params.isbn;
      const response = await axios.get(`./bookdb.js/${isbn}`);  
      if (response.data) {
        res.status(200).json(response.data);  // Return book details as JSON
      } else {
        res.status(404).json({ message: "Book with ISBN " + isbn + " not found" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching book details",
        error: error.message
      });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    try {
      const author = req.params.author;
      const response = await axios.get(`./bookdb.js/${author}`);  
      if (response.data.length > 0) {
        res.status(200).json(response.data);  // Return books by author as JSON
      } else {
        res.status(404).json({ message: "No books found for this author" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching books by author",
        error: error.message
      });
    }
  });

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    try {
      const title = req.params.title.toLowerCase();
      const response = await axios.get(`./bookdb.js/${title}`);  
  
      if (response.data.length > 0) {
        res.status(200).json(response.data);  // Return books with the given title as JSON
      } else {
        res.status(404).json({ message: "No books found with this title" });
      }
    } catch (error) {
      res.status(500).json({
        message: "Error fetching books by title",
        error: error.message
      });
    }
  });

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book && book.reviews) {
    res.json(book.reviews);
  } else {
    res.status(404).json({ message: "Reviews not found for this ISBN" });
  }

  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
