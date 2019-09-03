let express = require('express');
let router = express.Router();

const modelConductor = require('../models/conductores');

// http://localhost:3000/conductores/

router.get('/', (req, res) => {
    modelConductor.getAllP()
        .then((rows) => {
            res.render('conductores/list', { conductores: rows });
        })
        .catch((err) => {
            res.send(err);
        })
});

router.get('/new', (req, res) => {
    res.render('conductores/form');
})

router.get('/delete/:conductorId', (req, res) => {
    modelConductor.deleteById(req.params.conductorId)
        .then((result) => {
            console.log(result);
            res.redirect('/conductores')
        })
        .catch((err) => {
            console.log(err);
        })
});

router.get('/update/:conductorId', (req, res) => {
    modelConductor.getById(req.params.conductorId)
        .then((conductor) => {
            res.render('conductores/formUpdate', { conductor: conductor });
        })
        .catch((err) => {
            console.log(err);
        })
})

router.get('/:conductorId', async (req, res) => {
    let conductor = await modelConductor.getById(req.params.conductorId)

    res.render('conductores/show', {
        condcutorId: req.params.condcutorId,
        conductor: conductor
    });
})



router.post('/edit', (req, res) => {
    modelConductor.update(req.body.id, req.body)
        .then((result) => {
            res.redirect(`/conductores/${req.body.id}`);
        })
        .catch((err) => {
            console.log(err);
        })
})

router.post('/create', (req, res) => {
    console.log(req.body);
    modelConductor.insert(req.body)
        .then((result) => {
            console.log(result);
            res.redirect('/conductores')
        })
        .catch((err) => {
            console.log(err);
        })
})

module.exports = router;