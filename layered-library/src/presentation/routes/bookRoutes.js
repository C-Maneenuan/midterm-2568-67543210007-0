// src/presentation/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// TODO: Define routes
// GET /api/books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id
router.get('/:id', bookController.getBookById);

// POST /api/books
router.post('/', bookController.createBook);

// PUT /api/books/:id
router.put('/:id', bookController.updateBook);

// PATCH /api/books/:id/borrow
router.patch('/:id/borrow', bookController.borrowBook);

// PATCH /api/books/:id/return
router.patch('/:id/return', bookController.returnBook);

// DELETE /api/books/:id
router.delete('/:id', bookController.deleteBook);

module.exports = router;