const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{
  "username": "example_user",
  "password": "password123"
}];

const isValid = (username)=>{ //returns boolean
  //write code to check is the username is valid
  return username.length >= 4;
}

const authenticatedUser = (username,password)=>{ 
  //returns boolean
  //write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
      return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  //return res.status(300).json({message: "Yet to be implemented"});
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({message: "Error loggin in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).send("User successfully logged in");   
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"})
  }
});

// Add a book review
// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.username; // Assuming username is stored in the session

  if (!username) {
    return res.status(401).json({ message: "Unauthorized. Please log in to add or modify reviews." });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required." });
  }
  if (authenticatedUser(username, password)){

    // Check if the user has already posted a review for the same ISBN
    const existingReviewIndex = books[isbn].reviews.findIndex((item) => item.username === username);

    if (existingReviewIndex !== -1) {
      // If the user has already posted a review, modify the existing review
      books[isbn].reviews[existingReviewIndex].review = review;
      return res.status(200).json({ message: "Review modified successfully." });
  } else {
      // If the user has not posted a review yet, add a new review
      books[isbn].reviews.push({ username, review });
      return res.status(200).json({ message: "Review added successfully." });
  }
  }

});



// Delete a book review based on the session username
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const { isbn } = req.params; // Retrieve ISBN from request parameters
  const { username } = req.session.authenticated || {}; // Retrieve username from session

  if (!username) {
    return res.status(401).json({ message: 'User not authenticated' });
  }
  // Find the book with the provided ISBN
  const bookIndex = books.findIndex(book => book.isbn === isbn);

  if (bookIndex !== -1) {
    if (!books[bookIndex].reviews) {
      return res.status(404).json({ message: 'No reviews found for this book' });
    }

    // Filter reviews based on the session username and delete
    const initialReviewsLength = books[bookIndex].reviews.length;
    books[bookIndex].reviews = books[bookIndex].reviews.filter(review => review.username !== username);

    if (books[bookIndex].reviews.length !== initialReviewsLength) {
      return res.status(200).json({ message: 'Review(s) deleted successfully', book: books[bookIndex] });
    } else {
      return res.status(404).json({ message: 'No reviews found for the user on this book' });
    }
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
