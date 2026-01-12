// server.js
const express = require('express');
const bookRoutes = require('./src/presentation/routes/bookRoutes');
const errorHandler = require('./src/presentation/routes/errorHandler');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001; // Different port from monolithic

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/books', bookRoutes);

// Error handling (ต้องอยู่ท้ายสุด)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
    console.log(`Layered Library Management System running on http://localhost:${PORT}`);
});