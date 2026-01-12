// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');

class BookService {
    // TODO: Implement getAllBooks
    async getAllBooks(status = null) {
        // 1. ถ้ามี status ให้ validate
        // 2. เรียก bookRepository.findAll(status)
        // 3. คำนวณสถิติ (available, borrowed, total)
        // 4. return { books, statistics }
    }

    // TODO: Implement getBookById
    async getBookById(id) {
        // 1. Validate ID
        // 2. เรียก repository
        // 3. ถ้าไม่เจอ throw NotFoundError
        // 4. return book
    }

    // TODO: Implement createBook
    async createBook(bookData) {
        // 1. Validate book data
        // 2. Validate ISBN format
        // 3. เรียก repository.create()
        // 4. return created book
    }

    // TODO: Implement updateBook
    async updateBook(id, bookData) {
        // ให้นักศึกษาเขียนเอง
    }

    // TODO: Implement borrowBook
    async borrowBook(id) {
        // 1. ดึงหนังสือจาก repository
        // 2. ตรวจสอบว่า status = 'available' หรือไม่
        // 3. ถ้า borrowed อยู่แล้ว throw error
        // 4. เรียก repository.updateStatus(id, 'borrowed')
        // 5. return updated book
    }

    // TODO: Implement returnBook
    async returnBook(id) {
        // ให้นักศึกษาเขียนเอง (คล้ายกับ borrowBook)
    }

    // TODO: Implement deleteBook
    async deleteBook(id) {
        // 1. ดึงหนังสือจาก repository
        // 2. ตรวจสอบว่า status ไม่ใช่ 'borrowed'
        // 3. ถ้า borrowed ห้ามลบ throw error
        // 4. เรียก repository.delete(id)
    }
}

module.exports = new BookService();