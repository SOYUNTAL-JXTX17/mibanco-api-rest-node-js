const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL');
});


app.get('/users', (req, res) => {
    db.query('SELECT * FROM users', (err, results) => {
        if (err) {
            console.error('Error en query:', err);
            return res.status(500).json({ 
                error: err.message,
                code: err.code 
            });
        }
        res.json(results);
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', function () {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
