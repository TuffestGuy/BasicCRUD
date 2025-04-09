const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',  // Change if necessary
    password: 'Miracleboi12345',  // Change if necessary
    database: 'task_manager'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL Database.');
});

// Fetch tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a task
app.post('/tasks', (req, res) => {
    const { title, description, deadline } = req.body;
    db.query('INSERT INTO tasks (title, description, deadline) VALUES (?, ?, ?)',
        [title, description, deadline], (err, result) => {
            if (err) throw err;
            res.json({ id: result.insertId, title, description, deadline });
        });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tasks WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.json({ message: 'Task deleted' });
    });
});

// Start server
app.listen(3000, () => console.log('Server running on port 3000'));