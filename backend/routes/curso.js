'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createCurso,getCursoAlumno } = require('../controllers/curso');
const asynchandler = require('../middlewares/asynchandler');


router.post('/curso', asynchandler( async (req, res) => {

    const curso = req.body;

    const response = await createCurso(curso);

    res.send({ ok: true, response  });
}));

router.get('/curso/:cicloLectivo/:oidAlumno', asyncHandler( async (req, res) => {

    const cicloLectivo = req.params.cicloLectivo;
    const alumno = req.params.oidAlumno;
    const response = await getCursoAlumno(cicloLectivo,alumno);

    res.send({ ok: true, response  });
}));



module.exports=router;