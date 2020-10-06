'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();

const { createAlumno, updateAlumno, getAllAlumnos, getAlumnoById, deleteAlumno } = require('../controllers/alumno');
const asynchandler = require('../middlewares/asynchandler');


router.post('/alumno', asyncHandler( async (req, res) => {

    const alumno = req.body

    const response = await createAlumno(alumno);

    res.send({ ok: true, response  });
}));


router.get('/alumno/:dni', asynchandler( async (req, res) => {

    const dni = req.params.dni

    const response = await getAlumnoById(dni)

    res.send({ ok: true, response })

}));


router.get('/alumno', asyncHandler( async (req, res) => {

    const response = await getAllAlumnos();

    res.send({ ok: true, response });

}));


router.put('/alumno', asyncHandler( async (req, res) => {

    const alumno = req.body

    const response = await updateAlumno(alumno);

    res.send({ ok: true, response });

}));


router.delete('/alumno/:dni', asyncHandler( async (req, res) => {

    const dni = req.params.dni

    const response = await deleteAlumno(dni)

    res.send({ ok: true, response })    
}));



module.exports = router;