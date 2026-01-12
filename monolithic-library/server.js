const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database connection
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        initializeDatabase();
    }
});

// Initialize database tables
function initializeDatabase() {
    // Create books table
    db.run(`CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        isbn TEXT UNIQUE NOT NULL,
        status TEXT DEFAULT 'available',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`, (err) => {
        if (err) {
            console.error('Error creating books table:', err.message);
        } else {
            console.log('Books table ready.');
            // Insert sample data if table is empty
            insertSampleData();
        }
    });
}

// Insert sample data
function insertSampleData() {
    db.get("SELECT COUNT(*) as count FROM books", (err, row) => {
        if (err) {
            console.error('Error checking books count:', err.message);
            return;
        }
        
        if (row.count === 0) {
            const sampleBooks = [
                { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', isbn: '9780743273565' },
                { title: 'To Kill a Mockingbird', author: 'Harper Lee', isbn: '9780061120084' },
                { title: '1984', author: 'George Orwell', isbn: '9780451524935' },
                { title: 'Pride and Prejudice', author: 'Jane Austen', isbn: '9780141439518' },
                { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769174' }
            ];
            
            const stmt = db.prepare("INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)");
            sampleBooks.forEach(book => {
                stmt.run(book.title, book.author, book.isbn);
            });
            stmt.finalize();
            console.log('Sample books inserted.');
        }
    });
}

// API Routes

// GET /api/books - Get all books with optional status filter
app.get('/api/books', (req, res) => {
    const status = req.query.status;
    let query = "SELECT * FROM books";
    let params = [];
    
    if (status && status !== 'all') {
        query += " WHERE status = ?";
        params.push(status);
    }
    
    query += " ORDER BY created_at DESC";
    
    db.all(query, params, (err, books) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        // Get statistics
        db.all("SELECT status, COUNT(*) as count FROM books GROUP BY status", (err, stats) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            const statistics = {
                total: books.length,
                available: 0,
                borrowed: 0
            };
            
            stats.forEach(stat => {
                if (stat.status === 'available') {
                    statistics.available = stat.count;
                } else if (stat.status === 'borrowed') {
                    statistics.borrowed = stat.count;
                }
            });
            
            res.json({ books, statistics });
        });
    });
});

// GET /api/books/:id - Get a specific book
app.get('/api/books/:id', (req, res) => {
    const id = req.params.id;
    
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        res.json(book);
    });
});

// POST /api/books - Create a new book
app.post('/api/books', (req, res) => {
    const { title, author, isbn } = req.body;
    
    // Validation
    if (!title || !author || !isbn) {
        return res.status(400).json({ error: 'Title, author, and ISBN are required' });
    }
    
    // ISBN validation (basic check for 10-13 digits)
    if (!/^\d{10}(\d{3})?$/.test(isbn.replace(/[-\s]/g, ''))) {
        return res.status(400).json({ error: 'Invalid ISBN format' });
    }
    
    const query = "INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)";
    
    db.run(query, [title, author, isbn], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'ISBN already exists' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        
        // Return the created book
        db.get("SELECT * FROM books WHERE id = ?", [this.lastID], (err, book) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.status(201).json(book);
        });
    });
});

// PUT /api/books/:id - Update a book
app.put('/api/books/:id', (req, res) => {
    const id = req.params.id;
    const { title, author, isbn } = req.body;
    
    // Validation
    if (!title || !author || !isbn) {
        return res.status(400).json({ error: 'Title, author, and ISBN are required' });
    }
    
    // ISBN validation
    if (!/^\d{10}(\d{3})?$/.test(isbn.replace(/[-\s]/g, ''))) {
        return res.status(400).json({ error: 'Invalid ISBN format' });
    }
    
    const query = `UPDATE books SET 
        title = ?, 
        author = ?, 
        isbn = ?, 
        updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?`;
    
    db.run(query, [title, author, isbn, id], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                res.status(400).json({ error: 'ISBN already exists' });
            } else {
                res.status(500).json({ error: err.message });
            }
            return;
        }
        
        if (this.changes === 0) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        // Return the updated book
        db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(book);
        });
    });
});

// PATCH /api/books/:id/borrow - Borrow a book
app.patch('/api/books/:id/borrow', (req, res) => {
    const id = req.params.id;
    
    // Check if book exists and is available
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        if (book.status !== 'available') {
            res.status(400).json({ error: 'Book is already borrowed' });
            return;
        }
        
        // Update book status
        const query = `UPDATE books SET 
            status = 'borrowed', 
            updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`;
        
        db.run(query, [id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Return the updated book
            db.get("SELECT * FROM books WHERE id = ?", [id], (err, updatedBook) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(updatedBook);
            });
        });
    });
});

// PATCH /api/books/:id/return - Return a book
app.patch('/api/books/:id/return', (req, res) => {
    const id = req.params.id;
    
    // Check if book exists and is borrowed
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        if (book.status !== 'borrowed') {
            res.status(400).json({ error: 'Book is not borrowed' });
            return;
        }
        
        // Update book status
        const query = `UPDATE books SET 
            status = 'available', 
            updated_at = CURRENT_TIMESTAMP 
            WHERE id = ?`;
        
        db.run(query, [id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            // Return the updated book
            db.get("SELECT * FROM books WHERE id = ?", [id], (err, updatedBook) => {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json(updatedBook);
            });
        });
    });
});

// DELETE /api/books/:id - Delete a book
app.delete('/api/books/:id', (req, res) => {
    const id = req.params.id;
    
    // Check if book exists
    db.get("SELECT * FROM books WHERE id = ?", [id], (err, book) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        
        if (!book) {
            res.status(404).json({ error: 'Book not found' });
            return;
        }
        
        // Delete the book
        db.run("DELETE FROM books WHERE id = ?", [id], function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            
            if (this.changes === 0) {
                res.status(404).json({ error: 'Book not found' });
                return;
            }
            
            res.json({ message: 'Book deleted successfully' });
        });
    });
});

// Serve the frontend for any other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Monolithic Library Server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\nShutting down gracefully...');
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});