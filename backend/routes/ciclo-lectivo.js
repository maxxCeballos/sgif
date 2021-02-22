'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { getCicloLectivo, createCicloLectivo, getCicloLectivoById } = require('../controllers/ciclo-lectivo');

router.post('/ciclo-lectivo', asyncHandler(async (req, res) => {
    const cicloLectivoObj = req.body;

    const response = await createCicloLectivo(cicloLectivoObj);

    res.send({ ok: true, response });
}));

router.get('/ciclo-lectivo', asyncHandler(async (req, res) => {
    const response = await getCicloLectivo();

    //console.log(response);

    res.send({ ok: true, response });
}));

router.get('/ciclo-lectivo/:cicloLectivo', asyncHandler(async (req, res) => {
    const anioCicloLectivo = req.params.cicloLectivo;

    const response = await getCicloLectivoById(anioCicloLectivo);

    res.send({ ok: true, response })
}))

module.exports = router;