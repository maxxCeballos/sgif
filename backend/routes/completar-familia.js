'use strict'

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const { vDni, vOID } = require('../middlewares/validaRequests');
const { vAsociarPadre, vPadreNuevo,
    vPadreRol, vAsociarHermano, vHermano, vHermanoRol } = require('../middlewares/validaCompletarFamilia');

const router = express.Router();

const { asociarPadre, createPadreNuevo, createPadreRol,
    asociarHermano, createHermanoNuevo, createHermanoRol } = require('../controllers/completar-familia');
const { getAlumnoById, getAlumnoByOID } = require('../controllers/alumno');
const { getPersonaById } = require('../controllers/persona');
const { NotFound } = require('../middlewares/errores');
const { getPadreByID } = require('../controllers/padre');
const { getHermanoByID } = require('../controllers/hermano');

router.get('/completar-familia/alumno/oid/:oidAlumno', vOID, asyncHandler(async (req, res) => {
    const oidAlumno = req.params.oid;

    const alumno = await getAlumnoByOID(oidAlumno);

    if (alumno === false) {
        throw new NotFound("No existe un Alumno con el OID recibido.");
    }

    res.send({ ok: true, alumno })

}))

router.get('/completar-familia/alumno/dni/:dni', vDni, asyncHandler(async (req, res) => {
    const dni = req.params.dni;

    const alumno = await getAlumnoById(dni);

    if (alumno === false) {
        throw new NotFound("No existe un Alumno con el DNI recibido.");
    }

    res.send({ ok: true, alumno })

}))

router.get('/completar-familia/padre/:dni', vDni, asyncHandler(async (req, res) => {
    const dniPadre = req.params.dni;

    const padre = await getPadreByID(dniPadre);

    if (padre === false) {
        throw new NotFound("No existe un Padre con el DNI recibido.");
    }

    res.send({ ok: true, padre })

}))

router.put('/completar-familia/asociar-padre/:oid', vAsociarPadre, asyncHandler(async (req, res) => {
    const oidPadre = req.params.oid;
    const oidAlumno = req.query.oidAlumno;

    const response = await asociarPadre(oidPadre, oidAlumno);

    res.send({ ok: true, response });
}))

/**
 * ruta para buscar si existe una persona. Si existe se la devuelve al usuario, para mostrarlo por pantalla
 * recibe por param el dni de la persona para buscarlo
 */
router.get('/completar-familia/persona/:dni', vDni, asyncHandler(async (req, res) => {
    const dniPersona = req.params.dni;

    const persona = await getPersonaById(dniPersona);

    if (persona === false) {
        throw new NotFound("No existe una Persona con el DNI recibido.");
    }

    res.send({ ok: true, persona });
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

router.get('/completar-familia/hermano/:dni', vDni, asyncHandler(async (req, res) => {
    const dniHermano = req.params.dni;

    const hermano = await getHermanoByID(dniHermano);

    if (hermano === false) {
        throw new NotFound("No existe un Hermano con el DNI recibido.");
    }

    res.send({ ok: true, hermano })

}))

router.put('/completar-familia/asociar-hermano/:oid', vAsociarHermano, asyncHandler(async (req, res) => {
    const oidHermano = req.params.oid;
    const oidAlumno = req.query.oidAlumno;

    const response = await asociarHermano(oidHermano, oidAlumno);

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