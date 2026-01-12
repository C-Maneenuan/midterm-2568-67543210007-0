// src/presentation/routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// TODO: Define routes
// GET /api/books
router.get('/', bookController.getAllBooks);

// GET /api/books/:id
// POST /api/books
// PUT /api/books/:id
// PATCH /api/books/:id/borrow
// PATCH /api/books/:id/return
// DELETE /api/books/:id

// ให้นักศึกษาเขียนเองต่อที่นี่

module.exports = router;