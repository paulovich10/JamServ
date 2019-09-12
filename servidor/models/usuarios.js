const db = require('../db');



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