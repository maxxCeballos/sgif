'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asynchandler');
const { registrarNotasTrimestrales } = require('../controllers/notas-trimestrales');

router.post('/registrar-notas-trimestrales', asynchandler(async (req, res) => {

    const response = await registrarNotasTrimestrales()

    res.send({ ok: true, response})
}))


router.get('/registrar-notas-trimestrales/cursos)