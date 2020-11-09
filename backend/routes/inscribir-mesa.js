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
router.post('/inscribir-mesa/registrar-mesa/:legajo', asyncHandler(async (req, res) => {
    // TODO: CAMBIAR ID
    const legajoAlumno = req.params.legajo;
    const dictado = req.body;

    if(Object.entries(dictado).length === 0){
        throw "Por Favor, Ingrese un Dictado";
    }

    const response = await registrarMesa(legajoAlumno, dictado);

    res.send({ ok: true, response });
}));

/**
 * Para controlar si no se envia legajo
 */
router.post('/inscribir-mesa/registrar-mesa', asyncHandler(async (req, res) => {
    throw "Por Favor, Ingrese un Legajo";
}));

module.exports = router;