'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { validarFechaInscripcion, validarAlumno, registrarAlumnoNuevo, registrarAlumnoRol,
    reinscribirAlumno, createResponsableRol, createResponsableNuevo } = require('../controllers/inscribir-alumno');
const { getResponsableById } = require('../controllers/responsable');
const { getPersonaById } = require('../controllers/persona');
const { vDni } = require('../middlewares/validaRequests');
const { vResponsableNuevo, vResponsableRol, vRegistrarAlumnoNuevo, vRegistrarAlumnoRol, vReinscribirAlumno } = require('../middlewares/validaInscribirAlumno');

router.get('/insc-alumno/validar-fecha', asyncHandler(async (req, res) => {

    const response = await validarFechaInscripcion();    

    res.send({ ok: true, response })
}))

router.get('/insc-alumno/alumno/:dni', vDni, asyncHandler(async (req, res) => {
    const dni = req.params.dni

    const response = await validarAlumno(dni)

    res.send({ ok: true, response })
}))

router.get('/insc-alumno/responsable/:dni', vDni, asyncHandler(async (req, res) => {
    const dni = req.params.dni;

    const response = await getResponsableById(dni);

    res.send({ ok: true, response })
}))

/**
 * ruta para buscar si existe una persona. Si existe se la devuelve al usuario, para mostrarlo por pantalla
 * recibe por param el dni de la persona para buscarlo
 */
router.get('/insc-alumno/persona/:dni', vDni, asyncHandler(async (req, res) => {
    const dniPersona = req.params.dni;

    const response = await getPersonaById(dniPersona);

    res.send({ ok: true, response });
}))

router.post('/insc-alumno/responsable', vResponsableNuevo, asyncHandler(async (req, res) => {
    const responsable = req.body.responsable;

    const response = await createResponsableNuevo(responsable);

    res.send({ ok: true, response })
}))

router.put('/insc-alumno/responsable/persona/:oidPersona', vResponsableRol, asyncHandler(async (req, res) => {
    const oidPersona = req.params.oidPersona;
    const datosResponsable = req.body.responsable;

    const response = await createResponsableRol(datosResponsable, oidPersona);

    res.send({ ok: true, response });
}))

router.post('/insc-alumno/alumno', vRegistrarAlumnoNuevo, asyncHandler(async (req, res) => {
    //esta ruta capta las responsabilidades de generar el legajo y registrar el alumno con todo lo que conlleva    
    const alumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    const response = await registrarAlumnoNuevo(alumno, oidResponsable);

    res.send({ ok: true, response });
}))

router.put('/insc-alumno/alumno/persona/:oidPersona', vRegistrarAlumnoRol, asyncHandler(async (req, res) => {
    const oidPersona = req.params.oidPersona;
    const datosAlumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    const response = await registrarAlumnoRol(datosAlumno, oidPersona, oidResponsable);
    console.log("asdasdad ", response);

    res.send({ ok: true, response });
}))

router.put('/insc-alumno/alumno/:oidAlumno', vReinscribirAlumno, asyncHandler(async (req, res) => {
    const oidAlumno = req.params.oidAlumno;
    const valorAnio = req.query.anio;

    const response = await reinscribirAlumno(valorAnio, oidAlumno);

    // No se agrega el completar familia alumno, porque lo gestiona el front al llamar al otro endpoint por OID

    res.send({ ok: true, response })
}))

module.exports = router;
