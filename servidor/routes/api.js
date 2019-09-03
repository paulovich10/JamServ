let express = require('express');
let router = express.Router();

let apiConductoresRouter = require('./api/conductores');

router.use('/conductores', apiConductoresRouter);

module.exports = router;