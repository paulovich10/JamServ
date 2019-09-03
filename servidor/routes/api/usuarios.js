let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');
const moment = require('moment');

let usuariosModel = require('../../models/usuarios');

router.post('/registro', async (req, res) => {
    // usuariosModel.insert(req.body)
    //     .then(result => {
    //         console.log(result.insertId)
    //         usuariosModel.getById(result.insertId)
    //             .then(usuario => {
    //                 res.json(usuario)
    //             })
    //             .catch(err => {
    //                 res.json(err)
    //             })
    //     })
    //     .catch(err => {
    //         res.json(err);
    //     })
    req.body.password = bcrypt.hashSync(req.body.password, 10);
    try {
        let result = await usuariosModel.insert(req.body);
        let usuario = await usuariosModel.getById(result.insertId);
        // res.json(usuario);
        res.json({ token: createToken(usuario) })
    } catch (err) {
        res.json(err);
    }
});

router.post('/login', (req, res) => {
    usuariosModel.getByUsername(req.body.username)
        .then((user) => {
            if (user == null) return res.json({ error: 'Usuario y o contraseña erroneos (1)' })
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) return res.json({ error: 'Error!!!!' })
                if (!same) return res.json({ error: 'Usuario y o contraseña erroneos (2)' })
                res.json({ token: createToken(user) })
            });
        })
        .catch((err) => {
            res.json(err);
        })
});

router.post('/loginv2', async (req, res) => {
    try {
        let user = await usuariosModel.getByUsername(req.body.username);
        if (user == null) return res.json({ error: 'Usuario y o contraseña erroneos (1)' });
        let same = bcrypt.compareSync(req.body.password, user.password);
        if (!same) return res.json({ error: 'Usuario y o contraseña erroneos (2)' });
        res.json({ success: 'Usuario correcto' });
    } catch (err) {
        res.json({ error: err })
    }
});

const createToken = (pUser) => {
    const payload = {
        userId: pUser.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(5, 'minutes').unix()
    }
    return jwt.encode(payload, process.env.SECRET_KEY);
}

module.exports = router;