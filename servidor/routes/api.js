let express = require('express');
let router = express.Router();

let apiConductoresRouter = require('./api/conductores');
let apiUsuariosRouter = require('./api/usuarios');

router.use('/conductores', apiConductoresRouter);
router.use('/usuarios', apiUsuariosRouter);

module.exports = router;