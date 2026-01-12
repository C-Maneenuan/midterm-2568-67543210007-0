// server.js
const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const errorHandler = require('./src/presentation/middlewares/errorHandler');

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/books', bookRoutes);

// Error handling (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Library Management System running on http://localhost:${PORT}`);
});