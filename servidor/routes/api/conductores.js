let express = require('express');
let router = express.Router();
let modelConductor = require('../../models/conductores');

// router.use((req, res, next) => {
//     if (req.query.format === 'json') {
//         next();
//     } else {
//         res.json({ amenaza: 'Mi API sólo devuelve JSONSes' })
//     }
// })

// http://localhost:3000/api/estudiantes
router.get('/', (req, res) => {
    modelConductor.getAllP()
        .then(rows => res.json(rows))
        .catch(err => res.json(err))
});

// http://localhost:3000/api/estudiantes/7
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

router.put('/', (req, res) => {
    modelConductor.update(req.body.id, req.body)
        .then(result => res.json(result))
        .catch(err => res.json(err));
});

router.delete('/', (req, res) => {
    modelConductor.deleteById(req.body.id)
        .then(result => res.json(result))
        .catch(err => res.json(err));
})

module.exports = router;