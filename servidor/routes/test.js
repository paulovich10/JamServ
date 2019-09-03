let express = require('express');
let router = express.Router();

const mysql = require('mysql');

const db = require('../db');

let connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'Jamdb',
    port: 8889
})

router.get('/', (req, res) => {
    connection.connect((err) => {
        if (err) return console.log(err)
        connection.query('select * from usuarios order by nombre asc', (err, rows) => {
            if (err) return res.send(err.message)
            res.json(rows);
        })
        res.send('Conexión completa')
    })
})

router.get('/v2', (req, res) => {
    db.get().query('select * from usuarios', (err, rows) => {
        if (err) return res.json(err);
        res.json(rows);
    })
})

// router.get('/insert', (req, res) => {
//     connection.connect((err) => {
//         if (err) return console.log(err);
//         let nombre = 'Mario';
//         let apellidos = 'Girón';
//         let matricula = 'AF455';
//         let activo = true;
//         let arr = [nombre, apellidos, matricula, activo, new Date()]
//         const query = `insert into alumnos (nombre, apellidos, matricula, activo, fecha_matricula) values (?, ?, ?, ?, ?)`;

//         // Primer param - Sentencia SQL. Donde tengamos que insertar valores colocamos el caracter ?
//         // Segundo param - (opcional) Array con los valores que se van a sustitir por las ?
//         // ¡¡ Cuidado con el orden!!
//         connection.query(query, arr, (err, result) => {
//             if (err) return res.send(err.message);
//             res.json(result);
//         })
//     });
// })

// router.get('/:alumnoId', (req, res) => {
//     connection.connect((err) => {
//         if (err) return console.log(err);
//         const query = 'select * from alumnos where id = ?';
//         connection.query(query, [req.params.alumnoId], (err, rows) => {
//             if (err) return res.send(err.message);
//             if (rows.length == 0) {
//                 res.send('No existe alumno para ese ID');
//             } else {
//                 res.json(rows[0]);
//             }
//         })
//     })
// })

module.exports = router;