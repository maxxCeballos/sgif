'use strict'

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { asociarPadre, createPadreNuevo, createPadreRol, asociarHermano, createHermanoNuevo, createHermanoRol } = require('../controllers/completar-familia');
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
    //completar-familia/padre
    const datosPadre = req.body.padre;    
    const oidAlumno = req.body.oidAlumno;

    const response = await createPadreNuevo(datosPadre, oidAlumno);

    res.send({ ok: true, response });

}))

/** * 
 * ruta que asocia el rol del padre si la persona ya existe en el sistema
 */
//TODO: verificar que los datos recibidos de la persona coincidan con los almacenados
router.put('/completar-familia/padre-rol/:oidPersona', asyncHandler(async (req, res) => {
    //completar-familia/padre/persona/:oidPersona
    const oidPersona = req.params.oidPersona;  
    const datosPadre = req.body.padre;      
    const oidAlumno = req.body.oidAlumno;

    const response = await createPadreRol(datosPadre, oidPersona,oidAlumno);

    res.send({ ok: true, response });

}))

router.put('/completar-familia/asociar-hermano/:dniHermano', asyncHandler(async (req, res) => {
    const dniHermano = req.params.dniHermano;
    const oidAlumno = req.query.oidAlumno;

    //TODO: verficar que sea un oid valido de alumno

    const response = await asociarHermano(dniHermano, oidAlumno);

    res.send({ ok: true, response });
}))

//TODO: revisar nombres rutas
/**
 * ruta que crea la persona y le asocia el rol de hermano
 */
router.post('/completar-familia/hermano-nuevo', asyncHandler(async (req, res) => {
    //completar-familia/hermano
    const datosHermano = req.body.hermano;    
    const oidAlumno = req.body.oidAlumno;

    const response = await createHermanoNuevo(datosHermano, oidAlumno);

    res.send({ ok: true, response });

}))

/** * 
 * ruta que asocia el rol de hermano  si la persona ya existe en el sistema
 */
//TODO: verificar que los datos recibidos de la persona coincidan con los almacenados
router.put('/completar-familia/hermano-rol/:oidPersona', asyncHandler(async (req, res) => {
    //completar-familia/hermano/persona/:oidPersona
    const oidPersona = req.params.oidPersona;  
    const datosHermano = req.body.hermano;      
    const oidAlumno = req.body.oidAlumno;

    const response = await createHermanoRol(datosHermano, oidPersona,oidAlumno);

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