const express = require('express');
const mysql = require('mysql2');
const app = express();

const pool = mysql.createPool(process.env.MYSQL_URL);

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error conectando a MySQL:', err);
        return;
    }
    console.log('Conectado a MySQL ✅');
    connection.release();
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en puerto ${PORT} ✅`);
});
