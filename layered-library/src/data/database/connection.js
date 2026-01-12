// src/data/database/connection.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../../library.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Connected to SQLite database');
        initializeDatabase();
    }
});

function initializeDatabase() {
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
                { title: 'The Catcher in the Rye', author: 'J.D. Salinger', isbn: '9780316769174' },
                { title: 'Warhammer 40,000: Codex', author: 'Games Workshop', isbn: '9781788269761' },
                { title: 'Warhammer 40,000: Guilliman', author: 'David Annandale', isbn: '9781788267071' },
                { title: 'Warhammer 40,000: The Devastation of Baal', author: 'Guy Haley', isbn: '9781788266487' },
                { title: 'Warhammer 40,000: Dark Imperium', author: 'Guy Haley', isbn: '9781788267775' },
                { title: 'Warhammer 40,000: The Twice-Dead King', author: 'Necromunda', isbn: '9781788269045' },
                { title: 'George Floyd Creepypastas Volume 1', author: 'Internet Horror Collection', isbn: '9798567345123' },
                { title: 'George Floyd Creepypastas Volume 2', author: 'Dark Web Archives', isbn: '9798567345678' }
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

module.exports = db;