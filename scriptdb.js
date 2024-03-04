const axios = require('axios');
const mysql = require('mysql');
require('dotenv').config();

const db = mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DB || 'prueba_tecnica'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Conectado a la base de datos');
});

axios.get('https://jsonplaceholder.typicode.com/users')
    .then(response => {
        const users = response.data;

        users.forEach(user => {
            let sql = `INSERT INTO usuarios (id, name, username, email, phone, website) VALUES (?, ?, ?, ?, ?, ?)`;
            db.query(sql, [user.id, user.name, user.username, user.email, user.phone, user.website], (err, result) => {
                if (err) throw err;
            });

            sql = `INSERT INTO direcciones (id, street, suite, city, zipcode, lat, lng) VALUES (?, ?, ?, ?, ?, ?, ?)`;
            db.query(sql, [user.id, user.address.street, user.address.suite, user.address.city, user.address.zipcode, user.address.geo.lat, user.address.geo.lng], (err, result) => {
                if (err) throw err;
            });

            sql = `INSERT INTO companias (id, name, catchPhrase, bs) VALUES (?, ?, ?, ?)`;
            db.query(sql, [user.id, user.company.name, user.company.catchPhrase, user.company.bs], (err, result) => {
                if (err) throw err;
            });
        });

        console.log('Datos insertados correctamente');
    })
    .catch(error => {
        console.error(error);
    });
