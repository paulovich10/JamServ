const db = require('../db');

const getAllLoc = () => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from localizaciones', (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}

const getByIdLoc = (pId) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from localizaciones where id = ?', [pId], (err, rows) => {
            if (err) reject(err)
            rows.length == 1 ? resolve(rows[0]) : resolve(null)
        })
    })
}

const updateLoc = (pId, { direccion, latitud, longitud, cp }) => {
    return new Promise((resolve, reject) => {
        db.get().query('update localizaciones set direccion = ?, latitud = ?, longitud = ?, cp = ? where id = ?', [direccion, latitud, longitud, cp], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

const insert = ({ nombre, apellidos, fecha_nacimiento, email, usuario, password }) => {
    return new Promise((resolve, reject) => {
        let q = 'insert into usuarios (nombre, apellidos, fecha_nacimiento, email, usuario, password) values (?, ?, ?, ?, ?, ?)';
        db.get().query(q, [nombre, apellidos, fecha_nacimiento, email, usuario, password], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    })
}

module.exports = {

    getAllLoc: getAllLoc,
    getByIdLoc: getByIdLoc,
    updateLoc: updateLoc

}