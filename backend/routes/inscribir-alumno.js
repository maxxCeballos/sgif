'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { validarFechaInscripcion, validarAlumno, registrarAlumno, regRespYActAlumno, reinscribirAlumno } = require('../controllers/inscribir-alumno');
const { getResponsableById } = require('../controllers/responsable');
const asynchandler = require('../middlewares/asynchandler');

router.get('/insc-alumno/validar-fecha', asynchandler(async (req, res) => {

    const response = await validarFechaInscripcion();

    console.log(response);

    res.send({ ok: true, response})
}))

router.get('/insc-alumno/validar-alumno/:dni', asynchandler(async (req, res) => {
    const dni = req.params.dni

    const response = await validarAlumno(dni)

    //console.log(response);

    res.send({ ok: true, response })
}))

router.post('/insc-alumno/alumno', asyncHandler(async (req, res) => {
    //FIXME: corregir inscripcion alumno vacio
    //TODO: crear la persona despues del alumno y asignarle el OID
    const alumno = req.body

    const response = await registrarAlumno(alumno);
    
    console.log("Alumno Registrado");

    res.send({ ok: true, response });
}))

router.get('/insc-alumno/responsable/:dni', asynchandler(async (req, res) => {
    const dni = req.params.dni;    
    
    const response = await getResponsableById(dni);

    res.send({ ok: true, response })
}))

router.post('/insc-alumno/reg-resp-act-alum', asyncHandler(async (req, res) => {
    const responsable = req.body.responsable;
    const dniAlumno = req.body.dniAlumno;  

    //FIXME: ver nombre    
    const response = await regRespYActAlumno(responsable, dniAlumno);

    res.send({ ok: true, response })
}))

router.put('/insc-alumno/reinscribir-alumno', asynchandler(async (req, res) => {

    const dniAlumno = req.body.dniAlumno;

    //TODO:revisar
    //const valorAnio = req.params.anioCorrespondiente;
    const valorAnio = req.body.anioCorrespondiente; //se cambia el año o el estado reinscripto    

    const response = await reinscribirAlumno(valorAnio, dniAlumno);

    res.send({ ok: true, response })
}))

module.exports = router;
