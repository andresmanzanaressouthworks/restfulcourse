const express = require("express");
const bookControler = require("../controllers/bookController");

function routes(Book) {
  const bookRouter = express.Router();
  const controller = bookControler(Book);
  bookRouter.route("/books").post(controller.post).get(controller.get);
  bookRouter.use("/books/:id", (req, res, next) => {
    Book.findById(req.params.id, (err, book) => {
      if (err) {
        return res.send(err);
      } else {
        if (book) {
          req.book = book;
          return next();
        }
        return res.status(404);
      }
    });
  });
  bookRouter
    .route("/books/:id")
    .get((req, res) => {
      const returnBook = req.book.toJSON();
      const author = encodeURIComponent(req.book.author);
      returnBook.links = {};
      returnBook.links.filterByThisAuthor = `http://${req.headers.host}/api/books?author=${author}`;
      res.json(returnBook);
    })
    .put((req, res) => {
      const { book } = req;
      const { title, author, genre, read } = req.body;
      book.title = title;
      book.author = author;
      book.genre = genre;
      book.read = read;
      book.save();
      return res.status(200).send(book);
    })
    .patch((req, res) => {
      const { book } = req;
      if (req.body._id) {
        delete req.body._id;
      }
      Object.entries(req.body).forEach((item) => {
        const key = item[0];
        const value = item[1];
        book[key] = value;
      });
      req.book.save((err) => {
        if (err) {
          return res.send(err);
        } else {
          return res.json(book);
        }
      });
    })
    .delete((req, res) => {
      req.book.remove((err) => {
        if (err) {
          return res.send(err);
        }
        return res.sendStatus(204);
      });
    });

  return bookRouter;
}

module.exports = routes;
