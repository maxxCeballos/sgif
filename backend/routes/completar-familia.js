'use strict'

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const { vDni } = require('../middlewares/validaRequests');
const { vAsociarPadre, vPadreNuevo,
    vPadreRol, vAsociarHermano, vHermano, vHermanoRol } = require('../middlewares/validaCompletarFamilia');

const router = express.Router();

const { asociarPadre, createPadreNuevo, createPadreRol,
    asociarHermano, createHermanoNuevo, createHermanoRol } = require('../controllers/completar-familia');
const { getAlumnoById } = require('../controllers/alumno');
const { getPersonaById } = require('../controllers/persona');

router.get('/completar-familia/alumno/:dni', vDni, asyncHandler(async (req, res) => {
    const dni = req.params.dni;

    const response = await getAlumnoById(dni);

    res.send({ ok: true, response })

}))

router.put('/completar-familia/asociar-padre/:dni', vAsociarPadre, asyncHandler(async (req, res) => {
    const dniPadre = req.params.dni;
    const oidAlumno = req.query.oidAlumno;

    const response = await asociarPadre(dniPadre, oidAlumno);

    res.send({ ok: true, response });
}))

/**
 * ruta para buscar si existe una persona. Si existe se la devuelve al usuario, para mostrarlo por pantalla
 * recibe por param el dni de la persona para buscarlo
 */
router.get('/completar-familia/persona/:dni', vDni, asyncHandler(async (req, res) => {
    const dniPersona = req.params.dni;

    const response = await getPersonaById(dniPersona);

    res.send({ ok: true, response });
}))

/**
 * ruta que crea la persona y le asocia el rol del padre
 */
router.post('/completar-familia/padre', vPadreNuevo, asyncHandler(async (req, res) => {
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    const response = await createPadreNuevo(datosPadre, oidAlumno);

    res.send({ ok: true, response });
}))

/** * 
 * ruta que asocia el rol del padre si la persona ya existe en el sistema
 */
router.put('/completar-familia/padre/persona/:oidPersona', vPadreRol, asyncHandler(async (req, res) => {
    const oidPersona = req.params.oidPersona;
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    const response = await createPadreRol(datosPadre, oidPersona, oidAlumno);

    res.send({ ok: true, response });

}))

router.put('/completar-familia/asociar-hermano/:dni', vAsociarHermano, asyncHandler(async (req, res) => {
    const dniHermano = req.params.dniHermano;
    const oidAlumno = req.query.oidAlumno;

    const response = await asociarHermano(dniHermano, oidAlumno);

    res.send({ ok: true, response });
}))

/**
 * ruta que crea la persona y le asocia el rol de hermano
 */
router.post('/completar-familia/hermano', vHermano, asyncHandler(async (req, res) => {
    const datosHermano = req.body.hermano;
    const oidAlumno = req.body.oidAlumno;

    const response = await createHermanoNuevo(datosHermano, oidAlumno);

    res.send({ ok: true, response });
}))

/** * 
 * ruta que asocia el rol de hermano si la persona ya existe en el sistema
 */
router.put('/completar-familia/hermano/persona/:oidPersona', vHermanoRol, asyncHandler(async (req, res) => {
    const oidPersona = req.params.oidPersona;
    const datosHermano = req.body.hermano;
    const oidAlumno = req.body.oidAlumno;

    const response = await createHermanoRol(datosHermano, oidPersona, oidAlumno);

    res.send({ ok: true, response });
}))

module.exports = router;