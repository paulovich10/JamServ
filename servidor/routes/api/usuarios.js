let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jwt-simple');

let usuariosModel = require('../../models/usuarios');


router.post('/login', (req, res) => {
    usuariosModel.getByUsername(req.body.usuario)
        .then((user) => {
            if (user == null) return res.json({ error: 'Usuario y o contraseña erroneos (1)' })
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) return res.json({ error: 'Error!!!!' })
                if (!same) return res.json({ error: 'Usuario y o contraseña erroneos (2)' })
                console.log(user)
                res.json({
                    token: createToken(user),
                    username: user.usuario
                })
                //console.log(res.json)
            });
        })
        .catch((err) => {
            res.json(err);
        })
});


router.get('/profile', async (req, res) => {
    if (!req.headers['autorizacion']) {

        return res.json({ error: 'Hay un error en el token. No hay' }

        )

    }

    let token = req.headers['autorizacion'];
    let payload = null;

    try {
        payload = jwt.decode(token, process.env.SECRET_KEY);
    } catch (err) {
        return res.json({ error: 'Existe un error con el token. No es posible decodificar' })
    }

    //console.log(payload);
    // Compruebo si el id del usuario existe en mi Base de Datos
    let usuario = await usuariosModel.getById(payload.userId)
    if (!usuario) {
        return res.json({ error: 'Existe un error con el token. No existe el usuario en la BD' })
    }

    // Compruebo si la fecha de expiración está caducada
    if (payload.expiresAt < moment().unix()) {
        return res.json({ error: 'Existe un error con el token. Está caducado' })
    }

    res.json(usuario)

});



const createToken = (pUser) => {
    //console.log(pUser.id);

    const payload = {
        userId: pUser.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(20, 'minutes').unix()
    }
    return jwt.encode(payload, 'en un lugar de la mancha');

}

router.put('/update', async (req, res) => {

    if (!req.headers['autorizacion']) {

        return res.json({ error: 'hay un error en el token, no hay' });

    }

    let token = req.headers['autorizacion'];
    let payload = null;

    try {
        payload = jwt.decode(token, process.env.SECRET_KEY)
    } catch (err) {
        console.log(err);
        return res.json({ error: 'Hay un error con el token, no es posible decodificar' })
    }
    //res.send(payload);
    let response = await usuariosModel.update(payload.userId, req.body);
    console.log(response);
    res.send(response)

});

module.exports = router;