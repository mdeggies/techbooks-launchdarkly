'use strict';

const express = require('express')
const goodreads = require('goodreads-api-node');
const async = require('async');
const cors = require('cors')

const app = express()
const port = 3000

require('dotenv').config();

const goodreads_api_key = process.env.GOODREADS_API_KEY;
const goodreads_api_secret = process.env.GOODREADS_API_SECRET;
const gr = goodreads({ key: goodreads_api_key, secret: goodreads_api_secret });

app.use(cors())

// Return an array of tech book details from GoodReads in the format
// { "title": book_title, "author": book_author, "image": url }
async function returnBookDetails(page) {
    const details = [];
    const getBooks = await gr.searchBooks({ q: "technology", page: page, field: "all" });
    const books = getBooks.search.results.work;
    async.each(books, function (book, cb) {
        if ("best_book" in book) {
            if ("title" in book.best_book && "author" in book.best_book && "image_url" in book.best_book) {
                const title = book.best_book.title;
                const author = book.best_book.author.name;
                const image = book.best_book.image_url;
                const rating = book.average_rating;
                details.push({ "title": title, "author": author, "rating": rating, "image": image });
            }
        }
        cb();
    });
    return details;
}

// Resolve the promise from the async function and catch any errors
const asyncMiddleware = fn =>
    (req, res, next) => {
        Promise.resolve(fn(req, res, next))
            .catch(next);
    };

// Return the book details array as the response, when /books is invoked
app.get('/books', asyncMiddleware(async (req, res, next) => {
    if (req.query.page) {
        const books = await returnBookDetails(req.query.page);
        res.send(books)
    }
}));

app.listen(port, () => console.log(`App listening on port ${port}!`));
