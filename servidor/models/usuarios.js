const db = require('../db');

const update = ({ nombre, apellidos, fecha_nacimiento, usuario, email, password }) => {
    return new Promise((resolve, reject) => {
        db.get().query('insert into usuarios (nombre, apellidos, fecha_nacimiento, usuario, email, password) values (?, ?, ?, ?, ?,?)', [nombre, apellidos, fecha_nacimiento, usuario, email, password], (err, result) => {
            if (err) reject(err);
            resolve(result);
        })
    })
}

const getById = (pId) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from usuarios where id = ?', [pId], (err, rows) => {
            if (err) reject(err)
            rows.length == 1 ? resolve(rows[0]) : resolve(null)
        })
    })
}

const getByUsername = (pUsername) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from usuarios where usuario = ?', [pUsername], (err, rows) => {
            if (err) reject(err)
            if (rows.length != 1) resolve(null)
            resolve(rows[0])
        })
    })
}



module.exports = {
    // insert: insert,
    getById: getById,
    getByUsername: getByUsername
}