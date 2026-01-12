// src/presentation/controllers/bookController.js
const bookService = require('../../business/services/bookService');

class BookController {
    // TODO: Implement getAllBooks
    async getAllBooks(req, res, next) {
        try {
            const { status } = req.query;
            // เรียก bookService.getAllBooks()
            // ส่ง response กลับ
        } catch (error) {
            next(error);
        }
    }

    // TODO: Implement getBookById
    async getBookById(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement createBook
    async createBook(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement updateBook
    async updateBook(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement borrowBook
    async borrowBook(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement returnBook
    async returnBook(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement deleteBook
    async deleteBook(req, res, next) {
        // ให้นักศึกษาเขียนเอง
    }
}

module.exports = new BookController();