let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
let modelConductor = require('../../models/conductores');
let usuariosModel = require('../../models/usuarios');
const jwt = require('jwt-simple');
const moment = require('moment');


// router.use((req, res, next) => {
//     if (req.query.format === 'json') {
//         next();
//     } else {
//         res.json({ amenaza: 'Mi API sólo devuelve JSONSes' })
//     }
// })

// router.use(middlewares.checkUserAuthenticated);

// http://localhost:3000/api/conductores
router.get('/', (req, res) => {
    modelConductor.getAllP()
        .then(rows => res.json(rows))
        .catch(err => res.json(err))
});



// http://localhost:3000/api/conductores/7
router.get('/:conductorId', (req, res) => {
    modelConductor.getById(req.params.conductorId)
        .then(conductor => res.json(conductor))
        .catch(err => res.json(err));
});



router.post('/', (req, res) => {
    modelConductor.insert(req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err));
});



router.post('/registro', async (req, res) => {
    console.log(req.body);
    req.body.password = bcrypt.hashSync(req.body.password, 10);

    try {
        let email = await modelConductor.getByEmail(req.body.email)
        let username = await usuariosModel.getByUsername(req.body.usuario)
        if (email) {
            return res.json({ error: 'El email de usuario ya existe' })
        }
        if (username) {
            return res.json({ error: 'El usuario ya existe' })
        }


        alert('usuario logado con exito')

        let result = await modelConductor.insert(req.body);
        let usuario = await modelConductor.getById(result.insertId);


        // res.json(usuario);
        res.json({
            token: createToken(usuario),
            username: usuario.usuario
        });


    } catch (err) {
        res.json(err);
    }
});



router.delete('/', (req, res) => {
    modelConductor.deleteById(req.body.id)
        .then(result => res.json(result))
        .catch(err => res.json(err));
})

const createToken = (pUser) => {
    //console.log(pUser.id);

    const payload = {
        userId: pUser.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(5, 'minutes').unix()
    }
    return jwt.encode(payload, 'en un lugar de la mancha');

}

module.exports = router;