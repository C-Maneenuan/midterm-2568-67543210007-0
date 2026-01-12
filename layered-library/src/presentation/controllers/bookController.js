// src/presentation/controllers/bookController.js
const bookService = require('../../business/services/bookService');

class BookController {
    // TODO: Implement getAllBooks
    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            
            // เรียก bookService.getAllBooks()
            const data = await bookService.getAllBooks(status);
            
            // ส่ง response กลับ
            res.json(data);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement getBookById
    async getBookById(req, res, next) {
        try {
            const { id } = req.params;
            
            const book = await bookService.getBookById(id);
            res.json(book);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement createBook
    async createBook(req, res, next) {
        try {
            const bookData = req.body;
            
            const createdBook = await bookService.createBook(bookData);
            res.status(201).json(createdBook);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement updateBook
    async updateBook(req, res, next) {
        try {
            const { id } = req.params;
            const bookData = req.body;
            
            const updatedBook = await bookService.updateBook(id, bookData);
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement borrowBook
    async borrowBook(req, res, next) {
        try {
            const { id } = req.params;
            
            const updatedBook = await bookService.borrowBook(id);
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement returnBook
    async returnBook(req, res, next) {
        try {
            const { id } = req.params;
            
            const updatedBook = await bookService.returnBook(id);
            res.json(updatedBook);
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement deleteBook
    async deleteBook(req, res, next) {
        try {
            const { id } = req.params;
            
            const result = await bookService.deleteBook(id);
            res.json(result);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new BookController();