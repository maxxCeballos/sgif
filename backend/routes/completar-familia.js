'use strict'

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { asociarPadre, createPadreNuevo, createPadreRol, asociarHermano, createHermano } = require('../controllers/completar-familia');
const { getAlumnoById } = require('../controllers/alumno');
const { getPersonaById } = require('../controllers/persona');

router.get('/completar-familia/alumno/:dni', asyncHandler(async (req, res) => {
    const dni = req.params.dni;

    const response = await getAlumnoById(dni);

    res.send({ ok: true, response })

}))

router.put('/completar-familia/asociar-padre/:dniPadre', asyncHandler(async (req, res) => {
    const dniPadre = req.params.dniPadre;
    const oidAlumno = req.query.oidAlumno;

    //TODO: verficar que sea un oid valido de alumno

    const response = await asociarPadre(dniPadre, oidAlumno);

    res.send({ ok: true, response });
}))

/**
 * ruta para buscar si existe una persona. Si existe se la devuelve al usuario, para mostrarlo por pantalla
 * recibe por param el dni de la persona para buscarlo
 */
router.get('/completar-familia/persona/:dni', asyncHandler(async (req, res) => {
    const dniPersona = req.params.dniPersona;

    const response = await getPersonaById(dniPersona);

    res.send({ ok: true, response });
}))

//TODO: revisar nombres rutas
/**
 * ruta que crea la persona y le asocia el rol del padre
 */
router.post('/completar-familia/padre-nuevo', asyncHandler(async (req, res) => {
    const datosPadre = req.body.padre;    
    const oidAlumno = req.body.oidAlumno;

    //TODO: verficar que sea un oid valido de alumno

    const response = await createPadreNuevo(datosPadre, oidAlumno);

    res.send({ ok: true, response });

}))

/** * 
 * ruta que asocia el rol del padre si la persona ya existe en el sistema
 */
//TODO: verificar que los datos recibidos de la persona coincidan con los almacenados
router.post('/completar-familia/padre-rol', asyncHandler(async (req, res) => {
    const datosPersona = req.body.persona;
    const datosPadre = req.body.padre;    
    const oidAlumno = req.body.oidAlumno;
    
    //TODO: verficar que sea un oid valido de alumno

    const response = await createPadreRol(datosPadre, datosPersona,oidAlumno);

    res.send({ ok: true, response });

}))

//FIXME: usar oid
router.put('/completar-familia/asociar-hermano/:dni', asyncHandler(async (req, res) => {
    const dniHermano = req.params.dni;
    const dniAlumno = req.query.dniAlumno;

    //TODO: verficar que sea un oid valido de alumno

    const response = await asociarHermano(dniHermano, dniAlumno);

    res.send({ ok: true, response });
}))

//FIXME: usar oid
router.post('/completar-familia/hermano', asyncHandler(async (req, res) => {
    const hermano = req.body.hermano;
    const dniAlumno = req.body.dniAlumno;

    //TODO: verficar que sea un oid valido de alumno

    const response = await createHermano(hermano, dniAlumno);

    res.send({ ok: true, response });

}))

module.exports = router;