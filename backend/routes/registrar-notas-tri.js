'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asynchandler');

const { getCursos, getDetalleCurso, registrarNotasTrimestrales, calcularPresentismo } = require('../controllers/notas-trimestrales');
const asynchandler = require('../middlewares/asynchandler');

router.get('/notas-trimestrales/cursos', asyncHandler(async (req, res) => {

    const trimestre = req.query.trimestre;

    const response = await getCursos(trimestre);

    res.send({ ok: true, response});
}))


router.get('/notas-trimestrales/curso/detalle', asyncHandler(async (req, res) => {

    const idCurso = req.query.cursoID;

    const response = await getDetalleCurso(idCurso);

    res.send({ ok: true, response});
}))

router.get('/notas-trimestrales/dictado/alumno', asynchandler(async (req, res) => {

    const idDictado = req.query.dictadoID;
    const idAlumno = req.query.alumnoID;

    const response = await calcularPresentismo(idDictado, idAlumno);

    res.send({ ok: true, response})
}))

router.post('/notas-trimestrales/alta', asynchandler(async (req, res) => {

    const alumnoID = req.body.alumnoID;
    const trimestre = req.body.trimestre;
    const nota = req.body.nota;
    const dictadoID = req.body.dictadoID;

    const response = await registrarNotasTrimestrales(alumnoID, trimestre, nota, dictadoID);

    res.send({ ok: true, response})
}))

module.exports = router