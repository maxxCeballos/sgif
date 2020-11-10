'use strict'

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { asociarPadre, createPadre, asociarHermano, createHermano } = require('../controllers/completar-familia');
const { getAlumnoById } = require('../controllers/alumno');

router.get('/completar-familia/alumno/:dni', asyncHandler(async (req, res) => {
    const dni = req.params.dni;

    const response = await getAlumnoById(dni);

    res.send({ ok: true, response })

}))

router.put('/completar-familia/asociar-padre/:dni', asyncHandler(async (req, res) => {
    const dniPadre = req.params.dni;
    const dniAlumno = req.query.dniAlumno;

    const response = await asociarPadre(dniPadre, dniAlumno);

    res.send({ ok: true, response });
}))

router.post('/completar-familia/padre', asyncHandler(async (req, res) => {
    const padre = req.body.padre;
    const dniAlumno = req.body.dniAlumno;

    const response = await createPadre(padre, dniAlumno);

    res.send({ok:true, response});

}))

router.put('/completar-familia/asociar-hermano/:dni', asyncHandler(async (req, res) => {
    const dniHermano = req.params.dni;
    const dniAlumno = req.query.dniAlumno;

    const response = await asociarHermano(dniHermano, dniAlumno);

    res.send({ ok: true, response });
}))

router.post('/completar-familia/hermano', asyncHandler(async (req, res) => {
    const hermano = req.body.hermano;
    const dniAlumno = req.body.dniAlumno;

    const response = await createHermano(hermano, dniAlumno);

    res.send({ok:true, response});

}))

module.exports = router;