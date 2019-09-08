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
        expiresAt: moment().add(5, 'minutes').unix()
    }
    return jwt.encode(payload, 'en un lugar de la mancha');

}

module.exports = router;