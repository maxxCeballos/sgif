'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asynchandler');
const  { buscarProfesor, createCurso, createDictado } = require('../controllers/curso');

router.post('/alta-curso', asyncHandler(async (req, res) => {

    const anio = req.query.anio;

    const response = await createCurso(anio);

    res.send({ ok: true, response });
}));

router.get('/alta-curso/profesor', asyncHandler(async (req, res) => {

    const materia = req.query.materia;

    const response = await buscarProfesor(materia);

    res.send({ ok: true, response });
}));

router.post('/alta-curso/dictado', asyncHandler( async (req, res) => {
    
    const { cicloLectivo, programa, horarios, nombreMateria, anioMateria, idProfesor, idCurso } = req.body.dictado;

    const response = await createDictado(cicloLectivo, programa, horarios, nombreMateria, anioMateria, idProfesor, idCurso);

    res.send({ ok: true, response });

}))


module.exports = router