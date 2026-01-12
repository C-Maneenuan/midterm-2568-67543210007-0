// src/business/services/bookService.js
const bookRepository = require('../../data/repositories/bookRepository');
const bookValidator = require('../validators/bookValidator');

class BookService {
    // TODO: Implement getAllBooks
    async getAllBooks(status = null) {
        // 1. ถ้ามี status ให้ validate
        if (status && !['available', 'borrowed'].includes(status)) {
            throw new Error('Invalid status filter');
        }
        
        // 2. เรียก bookRepository.findAll(status)
        const books = await bookRepository.findAll(status);
        
        // 3. คำนวณสถิติ (available, borrowed, total)
        const statistics = {
            total: books.length,
            available: books.filter(book => book.status === 'available').length,
            borrowed: books.filter(book => book.status === 'borrowed').length
        };
        
        // 4. return { books, statistics }
        return { books, statistics };
    }

    // TODO: Implement getBookById
    async getBookById(id) {
        // 1. Validate ID
        bookValidator.validateId(id);
        
        // 2. เรียก repository
        const book = await bookRepository.findById(id);
        
        // 3. ถ้าไม่เจอ throw NotFoundError
        if (!book) {
            const error = new Error('Book not found');
            error.name = 'NotFoundError';
            throw error;
        }
        
        // 4. return book
        return book;
    }

    // TODO: Implement createBook
    async createBook(bookData) {
        // 1. Validate book data
        bookValidator.validateBookData(bookData);
        
        // 2. Validate ISBN format
        bookValidator.validateISBN(bookData.isbn);
        
        // 3. เรียก repository.create()
        try {
            const createdBook = await bookRepository.create(bookData);
            
            // 4. return created book
            return createdBook;
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                const conflictError = new Error('ISBN already exists');
                conflictError.name = 'ConflictError';
                throw conflictError;
            }
            throw error;
        }
    }

    // TODO: Implement updateBook
    async updateBook(id, bookData) {
        // Validate input
        bookValidator.validateId(id);
        bookValidator.validateBookData(bookData);
        bookValidator.validateISBN(bookData.isbn);
        
        // Check if book exists
        const existingBook = await bookRepository.findById(id);
        if (!existingBook) {
            const error = new Error('Book not found');
            error.name = 'NotFoundError';
            throw error;
        }
        
        try {
            const updatedBook = await bookRepository.update(id, bookData);
            return updatedBook;
        } catch (error) {
            if (error.message.includes('UNIQUE constraint failed')) {
                const conflictError = new Error('ISBN already exists');
                conflictError.name = 'ConflictError';
                throw conflictError;
            }
            throw error;
        }
    }

    // TODO: Implement borrowBook
    async borrowBook(id) {
        // 1. ดึงหนังสือจาก repository
        const book = await this.getBookById(id);
        
        // 2. ตรวจสอบว่า status = 'available' หรือไม่
        if (book.status !== 'available') {
            const error = new Error('Book is already borrowed');
            error.name = 'ValidationError';
            throw error;
        }
        
        // 3. ถ้า borrowed อยู่แล้ว throw error (already checked above)
        
        // 4. เรียก repository.updateStatus(id, 'borrowed')
        const updatedBook = await bookRepository.updateStatus(id, 'borrowed');
        
        // 5. return updated book
        return updatedBook;
    }

    // TODO: Implement returnBook
    async returnBook(id) {
        // 1. ดึงหนังสือจาก repository
        const book = await this.getBookById(id);
        
        // 2. ตรวจสอบว่า status = 'borrowed' หรือไม่
        if (book.status !== 'borrowed') {
            const error = new Error('Book is not borrowed');
            error.name = 'ValidationError';
            throw error;
        }
        
        // 3. เรียก repository.updateStatus(id, 'available')
        const updatedBook = await bookRepository.updateStatus(id, 'available');
        
        // 4. return updated book
        return updatedBook;
    }

    // TODO: Implement deleteBook
    async deleteBook(id) {
        // 1. ดึงหนังสือจาก repository
        const book = await this.getBookById(id);
        
        // 2. ตรวจสอบว่า status ไม่ใช่ 'borrowed'
        if (book.status === 'borrowed') {
            const error = new Error('Cannot delete a borrowed book');
            error.name = 'ValidationError';
            throw error;
        }
        
        // 3. ถ้า borrowed ห้ามลบ throw error (already checked above)
        
        // 4. เรียก repository.delete(id)
        const result = await bookRepository.delete(id);
        
        return result;
    }
}

module.exports = new BookService();