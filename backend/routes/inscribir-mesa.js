'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const obtenerDictados = require('../transacciones/inscribir-mesa/obtenerDictados');
const registrarMesa = require('../transacciones/inscribir-mesa/registrarMesa');

/**
 * Obtiene los dictados en estado "desaprobado" del alumno recibido.
 */
router.get('/inscribir-mesa/obtener-dictados/:legajo', asyncHandler(async (req, res) => {
    const legajoAlumno = req.params.legajo

    const response = await obtenerDictados(legajoAlumno);

    res.send({ ok: true, response });
}));

/**
 * Para controlar si no se envia legajo
 */
router.get('/inscribir-mesa/obtener-dictados', asyncHandler(async (req, res) => {
    throw "Por Favor, Ingrese un Legajo";
}));

/**
 * Registra una nueva mesa o en una ya existente al 
 * alumno para el dictado recibido.
 * 
 * req = { id, cicloLectivo, nombreMateria, anioMateria }
 */
router.post('/inscribir-mesa/registrar-mesa/:oidAlumno', asyncHandler(async (req, res) => {
    const oidAlumno = req.params.oidAlumno;
    const dictado = req.body;

    if (Object.entries(dictado).length === 0) {
        throw "Por Favor, Ingrese un Dictado";
    }
    const response = await registrarMesa(oidAlumno, dictado);

    res.send({ ok: true, response });
}));

/**
 * Para controlar si no se envia legajo
 */
router.post('/inscribir-mesa/registrar-mesa', asyncHandler(async (req, res) => {
    throw "Por Favor, Ingrese un Identificador de Alumno";
}));

// router.post('/inscribir-mesa/set-test', asyncHandler(async (req, res) => {
//     const response = await setTestInscribirMesa();

//     res.send({ ok: true, response });
// }));

module.exports = router;