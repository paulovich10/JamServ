const db = require('../db');

const getAll = () => {
    return new Promise((resolve, reject) => {
        db.get().query('select usuarios.fk_partida, fk_destino, usuarios.email, usuarios.usuario from usuarios where usuarios.fk_partida AND usuarios.fk_destino is not null',
            (err, rows) => {
                if (err) reject(err)
                resolve(rows)
            })
    })
}


const getAllPartida = (fkPartidaIds) => {

    console.log('ARRAY!!', fkPartidaIds);
    return new Promise((resolve, reject) => {

        db.get().query('select * from localizaciones where id in (?)', [fkPartidaIds], (err, rows) => {
            if (err) reject(err)
            resolve(rows)
        })
    })
}



const getById = (pId) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from usuarios where usuarios.id = ?; select * from localizaciones where localizaciones.id_usuario = ?', [pId, pId], (err, rows) => {
            console.log(rows)
            if (err) reject(err)
            resolve(rows)
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
    getAll: getAll,
    getById: getById,
    getByUsername: getByUsername,
    update: update,
    updateLoc: updateLoc,
    getAllPartida: getAllPartida

}