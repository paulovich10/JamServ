const db = require('../db');

// Recupera todos los estudiantes a través de una promesa


const insert = ({ nombre, apellidos, fecha_nacimiento, email, usuario, password }) => {
    return new Promise((resolve, reject) => {
        let q = 'insert into usuarios (nombre, apellidos, fecha_nacimiento, email, usuario, password) values (?, ?, ?, ?, ?, ?)';
        db.get().query(q, [nombre, apellidos, fecha_nacimiento, email, usuario, password], (err, result) => {
            if (err) reject(err)
            resolve(result)
        });
    })
}

const getByEmail = (pEmail) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from usuarios where email = ?', [pEmail], (err, rows) => {
            if (err) reject(err)
            rows.lenght == 0 ? resolve('No existe el conductor para ese email') : resolve(rows[0])
        })
    })
}

const getById = (pConductorId) => {
    return new Promise((resolve, reject) => {
        db.get().query('select * from usuarios where id = ?', [pConductorId], (err, rows) => {
            if (err) reject(err)
            rows.length == 0 ? resolve('No existe el conductor para esa id') : resolve(rows[0])
        })
    })
}

const deleteById = (pId) => {
    return new Promise((resolve, reject) => {
        db.get().query('delete from usuarios where id = ?', [pId], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
}


module.exports = {

    insert: insert,
    getById: getById,
    deleteById: deleteById,
    getByEmail: getByEmail

}