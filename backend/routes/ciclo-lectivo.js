'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const {getCicloLectivo, createCicloLectivo} = require('../controllers/ciclo-lectivo');

router.post('/ciclo-lectivo', asyncHandler(async (req, res) => {
    const cicloLectivo = req.body;

    const response = await createCicloLectivo(cicloLectivo);

    res.send({ ok: true, response });
}));

router.get('/ciclo-lectivo', asyncHandler(async (req, res) => {
    const response = await getCicloLectivo();

    res.send({ ok: true, response });
}));

module.exports = router;