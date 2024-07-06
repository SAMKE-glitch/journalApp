const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');
let url = 'http://localhost:5000/';

const listBooks = new Promise((resolve, reject) => {
  resolve(JSON.stringify({books}, null, 10));
});

const doesExist = (username)=>{
  let usersWithSameName = users.filter((user)=>{
      return user.username === username
  });
  if (usersWithSameName.length > 0){
      return true;
  } else {
      return false
  }
}
public_users.post("/register", (req,res) => {
//Write your code here
//return res.status(300).json({message: "Yet to be implemented"});
const username = req.body.username;
const password = req.body.password;

if (username && password) {
  if (!doesExist(username)) {
      users.push({"username":username, "password": password});
      return res.status(200).json({message: "User successfully registered. Now you can login"});
  } else {
      return res.status(404).json({message: "User already exists"});
  }
}
return res.status(404).json({message: "Unable to register user"});
});

// Get the book list available in the shop
public_users.get('/books',function (req, res) {
  //Write your code here
    //res.send(JSON.stringify(books,null,10));
    const listBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 10)));
    });

    listBooks.then(() => console.log("Promise for Task 10 resolved"));

});
//public_users.get('/',function (req, res) {
//Write your code here
//res.send(JSON.stringify(books,null,4));
//return res.status(300).json({message: "Yet to be implemented"});
//});

// Get book details based on ISBN
public_users.get('/books/isbn/:isbn', async function filterBooks (req, res) {
  let newBookList = await listBooks;
  const booksByIsbn = req.params.isbn;
  const bookArray = Object.values(books);
  
  bookArray.filter((book) => {
      if (book.isbn === booksByIsbn) {
          return Promise.resolve(res.send(JSON.stringify(newBookList)));
      } else {
          return console.log("Can't find book with ISBN provided.");
      }
  });
});
//public_users.get('/isbn/:isbn',function (req, res) {
//Write your code here
//return res.status(300).json({message: "Yet to be implemented"});
//const isbn = req.params.isbn;
// checking if the isbn exists in the books
//if(books.hasOwnProperty(isbn)){
  //return res.status(200).json( {book: books[isbn] })
//}
//else {
  //return res.status(404).json({ message: "Book not found" });
//}
//});

// Get book details based on author
public_users.get('/books/author/:author',function (req, res) {
  //Write your code here
    const booksByAuthor = req.params.author;
    //const bookArray = Object.values(books);
    const listBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 10)));
    });
    const filterBooks = new Promise((resolve, reject) => {
        if (books.author === booksByAuthor) {
            resolve(res.send(JSON.stringify({books}, null, 10)));
        }
    });

    listBooks.then((successMessage) => {
        console.log("From Callback " + successMessage)
        filterBooks.then((successMessage) => {
            console.log("From Callback " + successMessage)
        })
    })
});
//public_users.get('/author/:author',function (req, res) {
//Write your code here
//return res.status(300).json({message: "Yet to be implemented"});
//const author = req.params.author;
//const matchingBooks = [];

// iterate through the books object to find books by the specified author
//for (const x in books) {
  //if (books.hasOwnProperty(x)) {
      //if (books[x].author === author) {
          //matchingBooks.push(books[x]);
      //}
  //}
//}
//if (matchingBooks.length > 0) {
  // If books by the author are found, return them
  //return res.status(200).json({ books: matchingBooks});
//}
//else {
  //return restart.status(404).json({ message: "No books found by the specified author"});
//}
//});

// Get all books based on title
public_users.get('/books/title/:title',function (req, res) {
  //Write your code here
    const booksByTitle = req.params.title;
    //const bookArray = Object.values(books);
    const listBooks = new Promise((resolve, reject) => {
        resolve(res.send(JSON.stringify({books}, null, 10)));
    });
    const filterBooks = new Promise((resolve, reject) => {
        if (book.title === booksByTitle) {
            resolve(res.send(JSON.stringify({books}, null, 10)));
        }
    });

    listBooks.then((successMessage) => {
        console.log("From Callback " + successMessage)
        filterBooks.then((successMessage) => {
            console.log("From Callback " + successMessage)
        })
    })
});
//public_users.get('/title/:title',function (req, res) {
//Write your code here
//return res.status(300).json({message: "Yet to be implemented"});
//const title = req.params.title;
//const matchingBook = [];

// iterate through the books object to find books by the specified author
//for (const y in books) {
  //if (books.hasOwnProperty(y)) {
      //if (books[y].title === title) {
          //matchingBook.push(books[y]);
      //}
  //}
//}
//if (matchingBook.length > 0) {
  // If books by the author are found, return them
  //return res.status(200).json({ books: matchingBook});
//}
//else {
  //return restart.status(404).json({ message: "No books found by the specified author"});
//}
//});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
//Write your code here
//return res.status(300).json({message: "Yet to be implemented"});
const isbn = req.params.isbn;
// Check if the provided ISBN exists in the books object
if (books.hasOwnProperty(isbn)) {
  // If the book exists, check if it has any reviews
  const bookReviews = books[isbn].reviews;
  if (Object.keys(bookReviews).length > 0) {
      // If there are reviews for the book, return them
      return res.status(200).json({ reviews: bookReviews });
  } else {
      // If there are no reviews for the book, return a message
      return res.status(404).json({ message: "No reviews found for the book" });
  }
} else {
  // If the provided ISBN does not match any book, return a message
  return res.status(404).json({ message: "Book not found" });
}
});


module.exports.general = public_users;
