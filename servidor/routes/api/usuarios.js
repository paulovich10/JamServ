let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jwt-simple');

let usuariosModel = require('../../models/usuarios');
let modelConductor = require('../../models/conductores');


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


router.post('/profile', async (req, res) => {
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

    console.log(payload);
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

// router.post('/loginv2', async (req, res) => {
//     try {
//         let user = await usuariosModel.getByUsername(req.body.username);
//         if (user == null) return res.json({ error: 'Usuario y o contraseña erroneos (1)' });
//         let same = bcrypt.compareSync(req.body.password, user.password);
//         if (!same) return res.json({ error: 'Usuario y o contraseña erroneos (2)' });
//         res.json({ success: 'Usuario correcto' });
//     } catch (err) {
//         res.json({ error: err })
//     }
// });

const createToken = (pUser) => {
    //console.log(pUser.id);

    const payload = {
        userId: pUser.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(20, 'minutes').unix()
    }
    return jwt.encode(payload, 'en un lugar de la mancha');

}

module.exports = router;