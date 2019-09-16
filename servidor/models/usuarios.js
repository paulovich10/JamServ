const db = require('../db');



const getById = (pId) => {
    return new Promise((resolve, reject) => {
        db.get().query('select usuarios.* ,localizaciones.`latitud`, localizaciones.`longitud` from usuarios, localizaciones where usuarios.id = ? AND (usuarios.fk_partida = localizaciones.id OR usuarios.fk_destino = localizaciones.id )', [pId], (err, rows) => {
            if (err) reject(err)
            rows.length == 2 ? resolve(rows[0], rows[1]) : resolve(null)
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
const update = (pId, { nombre, apellidos, fecha_nacimiento, email, usuario }) => {
    return new Promise((resolve, reject) => {
        db.get().query('update usuarios set nombre = ?, apellidos = ?, fecha_nacimiento = ?, email = ?, usuario = ? where id = ?', [nombre, apellidos, fecha_nacimiento, email, usuario, pId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

const updateLoc = (pId, { fk_partida, fk_destino }) => {
    console.log(pId, fk_partida, fk_destino);
    return new Promise((resolve, reject) => {
        db.get().query('update usuarios set fk_partida = ?, fk_destino = ? where id = ?', [fk_partida, fk_destino, pId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    })
}

module.exports = {
    // insert: insert,
    getById: getById,
    getByUsername: getByUsername,
    update: update,
    updateLoc: updateLoc

}