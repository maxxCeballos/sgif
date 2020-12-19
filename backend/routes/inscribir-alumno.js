'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { validarFechaInscripcion, validarAlumno, registrarAlumno, reinscribirAlumno } = require('../controllers/inscribir-alumno');
const { getResponsableById, createResponsable } = require('../controllers/responsable');
const asynchandler = require('../middlewares/asynchandler');

router.get('/insc-alumno/validar-fecha', asynchandler(async (req, res) => {

    const response = await validarFechaInscripcion();

    //console.log(response);

    res.send({ ok: true, response})
}))

router.get('/insc-alumno/validar-alumno/:dni', asynchandler(async (req, res) => {
    const dni = req.params.dni

    const response = await validarAlumno(dni)

    //console.log(response);

    res.send({ ok: true, response })
}))

router.get('/insc-alumno/responsable/:dni', asynchandler(async (req, res) => {
    const dni = req.params.dni;    
    
    const response = await getResponsableById(dni);

    res.send({ ok: true, response })
}))

router.post('/insc-alumno/responsable', asyncHandler(async (req, res) => {
    const responsable = req.body.responsable;    

    const response = await createResponsable(responsable);

    res.send({ ok: true, response })
}))

router.post('/insc-alumno/alumno', asyncHandler(async (req, res) => {
    //esta ruta capta las responsabilidades de generar el legajo y registrar el alumno con todo lo que conlleva
    //FIXME: corregir inscripcion alumno vacio    
    const alumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;    

    const response = await registrarAlumno(alumno,oidResponsable);
    
    console.log("Alumno Registrado");

    res.send({ ok: true, response });
}))

router.put('/insc-alumno/reinscribir-alumno/:dni', asynchandler(async (req, res) => {
    //TODO:revisar posible error
    const dniAlumno = req.params.dni;
    const valorAnio = req.query.anio;  

    const response = await reinscribirAlumno(valorAnio, dniAlumno);

    res.send({ ok: true, response })
}))

module.exports = router;
