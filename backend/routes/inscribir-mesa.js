'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { obtenerDictados, registrarMesa } = require('../transacciones/inscribir-mesa.transaccion');
const asynchandler = require('../middlewares/asynchandler');

/**
 * Obtiene los dictados en estado "desaprobado" 
 * del alumno recibido.
 * 
 * req = { legajoAlumno }
 */
router.get('/inscribir-mesa/obtener-dictados', asyncHandler(async (req, res) => {

    //FIXME: cambiar por req.params
    const legajoAlumno = req.body.legajoAlumno

    const response = await obtenerDictados(legajoAlumno);

    res.send({ ok: true, response });
}));

/**
 * Registra una nueva mesa o en una ya existente al 
 * alumno para el dictado recibido.
 * 
 * req = { legajoAlumno, dictado: { cicloLectivoDictado, nombreDictado, anioDictado } }
 */
router.post('/inscribir-mesa/registrar-mesa', asyncHandler(async (req, res) => {

    const legajoAlumno = req.body.legajoAlumno;
    const dictado = req.body.dictado;

    const response = await registrarMesa(legajoAlumno, dictado);

    res.send({ ok: true, response });
}));

module.exports = router;