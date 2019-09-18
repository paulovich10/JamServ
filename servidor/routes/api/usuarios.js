let express = require('express');
let router = express.Router();
const bcrypt = require('bcrypt');
const moment = require('moment');
const jwt = require('jwt-simple');

let usuariosModel = require('../../models/usuarios');
let localizacionesModel = require('../../models/localizaciones')


router.post('/login', (req, res) => {
    usuariosModel.getByUsername(req.body.usuario)
        .then((user) => {
            if (user == null) return res.json({ error: 'Usuario y o contraseña erroneos (1)' })
            bcrypt.compare(req.body.password, user.password, (err, same) => {
                if (err) return res.json({ error: 'Error!!!!' })
                if (!same) return res.json({ error: 'Usuario y o contraseña erroneos (2)' })
                //console.log(user)
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

    // Compruebo si la fecha de expiración está caducada
    if (payload.expiresAt < moment().unix()) {
        return res.json({ error: 'Existe un error con el token. Está caducado' })
    }

    //console.log(payload);
    // Compruebo si el id del usuario existe en mi Base de Datos
    let resultado = await usuariosModel.getById(payload.userId)


    // Recuperamos la información del perfil del usuario y lo metemos dentro del objeto llamado respuesta (este objeto es el que utilizamos para devolver la información a Angular)
    let respuesta = { ...resultado[0][0] }
    respuesta.origen = { ...resultado[1][0] };
    respuesta.destino = { ...resultado[1][1] };

    res.json(respuesta)
    console.log(respuesta)

});

router.get('/mapa', (req, res) => {

    usuariosModel.getAll()
        //creamos un array para meterle los ids de los origenes y junto con las localizaciones de ese array mostrarlo en el mapa 
        .then(rows => {
            let arr = new Array();
            let arrTotal = new Array();
            //creamos dos arrays arrTotal y arr. Al hacer el bucle de abajo pasa antes por la query de donde extraigo los ids de las partidas  
            for (row of rows) {
                arr.push(row['fk_partida']);
                arrTotal.push({ usuario: row['usuario'], email: row['email'] });
            }

            usuariosModel.getAllPartida(arr)
                .then(rows => {
                    for (let i = 0; i < arr.length; i++) {
                        arrTotal[i].partida = rows[i];
                    }
                    res.json(arrTotal);
                })

        })


        .catch(err => res.json(err))

})

router.post('/profile/localizacion', async (req, res) => {
    console.log(req.body)
    try {
        let origen = {
            latitud: req.body.origenlat,
            longitud: req.body.origenlong
        }
        let destino = {
            latitud: req.body.destinolat,
            longitud: req.body.destinolong
        }

        let token = req.headers['autorizacion'];
        console.log('cabeceras', req.headers);

        try {
            payload = jwt.decode(token, process.env.SECRET_KEY);
        } catch (err) {
            return res.json({ error: 'Existe un error con el token. No es posible decodificar' })
        }

        //saco los ids del origen y del destino para meterlos en la tabla de usuario
        let response = await localizacionesModel.insertLoc(origen.latitud, origen.longitud, payload.userId);
        let response2 = await localizacionesModel.insertLoc(destino.latitud, destino.longitud, payload.userId);

        // console.log('id', response.insertId);
        // console.log('id2', response2.insertId)

        if (!req.headers['autorizacion']) {

            return res.json({ error: 'Hay un error en el token. No hay' }

            )

        }


        //console.log(payload)

        let usuarioLoc = await usuariosModel.getById(payload.userId)
        if (!usuarioLoc) {
            return res.json({ error: 'Existe un error con el token. No existe el usuario en la BD' })
        }

        let resFinal = await usuariosModel.updateLoc(payload.userId, {
            fk_partida: response.insertId,
            fk_destino: response2.insertId
        })

        res.send(resFinal)
        //console.log(resFinal);

    } catch (err) {

        res.json(err)
    }

});


const createToken = (pUser) => {
    //console.log(pUser.id);

    const payload = {
        userId: pUser.id,
        createdAt: moment().unix(),
        expiresAt: moment().add(60, 'minutes').unix()
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