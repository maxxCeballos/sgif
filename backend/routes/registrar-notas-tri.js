'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asynchandler');

const { getCursos, getDetalleCurso, getNotasHorariosDictado } = require('../controllers/notas-trimestrales');

router.get('/notas-trimestrales/cursos', asyncHandler(async (req, res) => {

    const response = await getCursos()

    res.send({ ok: true, response})
}))


router.get('/notas-trimestrales/cursos/detalle', asyncHandler(async (req, res) => {

    const idCurso = req.query.cursoID;

    const response = await getDetalleCurso(idCurso);

    res.send({ ok: true, response});
}))

router.get('/notas-trimestrales/dictado/notas', asyncHandler(async (req, res) => {

    const idDictado = req.query.dictadoID;

    const response = await getNotasHorariosDictado(idDictado);

    res.send({ ok: true, response});
}))


module.exports = router