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

const updateLoc = (pId, { latitud, longitud }) => {
    return new Promise((resolve, reject) => {
        db.get().query('update localizaciones set latitud = ?, longitud = ? where id = ?', [latitud, longitud], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

const insertLoc = (latitud, longitud, id_usuario) => {

    return new Promise((resolve, reject) => {
        console.log(latitud, longitud)
        let q = 'insert into localizaciones (latitud, longitud, id_usuario) values (?, ?, ?)';
        db.get().query(q, [latitud, longitud, id_usuario], (err, result) => {
            if (err) reject(err)
            resolve(result)
            console.log(result)
        });
    })
}

module.exports = {

    getAllLoc: getAllLoc,
    getByIdLoc: getByIdLoc,
    //updateLoc: updateLoc,
    insertLoc: insertLoc

}