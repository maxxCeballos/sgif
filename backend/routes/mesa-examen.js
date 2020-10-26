'use strict';

const express = require('express');

const router = express.Router();

const { createResultadoMesa } = require('../controllers/resultadoMesa');

router.post('/mesa-examen', (req, res) => {


    res.status(200).send({ status: true, data: alumno });
});

router.post('/resultado-mesa/:dni', async (req, res) => {
    const resultadoMesa = req.body;

    const response = await createResultadoMesa(resultadoMesa);

    res.send({ ok: true, response });
})

module.exports = router;