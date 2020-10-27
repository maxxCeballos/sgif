'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createCurso } = require('../controllers/curso');
const asynchandler = require('../middlewares/asynchandler');



//Rutas relacionada con alumno



//Rutas relacionadas con Curso
router.post('/consultarInfoAlumno', asynchandler( async (req, res) => {

    const curso = req.body;

    const response = await createCurso(curso);

    res.send({ ok: true, response  });
}));

router.get('/curso/consultarInfo/:id', asyncHandler( async (req, res) => {

    const cicloLectivo = req.params.id;
    const response = await getConsultarInfo(cicloLectivo);

    res.send({ ok: true, response  });
}));

//Rutas relacionada con alumno
module.exports=router;