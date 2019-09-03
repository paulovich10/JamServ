const jwt = require('jwt-simple');
const moment = require('moment');
const userModel = require('../models/usuarios');

const checkUserAuthenticated = async (req, res, next) => {
    // Compruebo si existe la cabecera Authentication
    if (!req.headers['authentication']) {
        return res.json({ error: 'Existe un error con el token. No hay' })
    }

    let token = req.headers['authentication'];
    let payload = null
    // Compruebo si puedo decodificar el token, y lo hago.
    try {
        payload = jwt.decode(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.json({ error: 'Existe un error con el token. No es posible decodificar' })
    }

    console.log(payload);
    // Compruebo si el id del usuario existe en mi Base de Datos
    let usuario = await userModel.getById(payload.userId)
    if (!usuario) {
        return res.json({ error: 'Existe un error con el token. No existe el usuario en la BD' })
    }

    // Compruebo si la fecha de expiración está caducada
    if (payload.expiresAt < moment().unix()) {
        return res.json({ error: 'Existe un error con el token. Está caducado' })
    }

    next();
};

module.exports = {
    checkUserAuthenticated: checkUserAuthenticated
};