// RECURSOS
const express = require('express');
const mysql = require('mysql2');
const app = express();

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_PORT:', process.env.DB_PORT);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_DATABASE:', process.env.DB_DATABASE);

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 1. Conectarse con la base de datos
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL ✅');
    connection.release();
});

// 2. Obtener datos de las tablas
app.get('/bankAccounts', (req, res) => {
    pool.query('SELECT * FROM bankAccounts', (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/transactions', (req, res) => {
    pool.query('SELECT * FROM transactions', (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.get('/notifications', (req, res) => {
    pool.query('SELECT * FROM notifications', (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

// 3. Conexion con la libreria express para enviar los datos recibidos por la app de android studio a la base de datos
app.use(express.json());

app.post('/users', (req, res) => {
    const { name } = req.body;
    pool.query('INSERT INTO users (name) VALUES (?)', [name], (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Usuario insertado correctamente', id: results.insertId });
    });
});

// 4. Iniciar la API
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT} ✅`);
});
