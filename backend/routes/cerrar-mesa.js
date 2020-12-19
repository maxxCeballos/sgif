'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const cargarNotasMesas = require('../transacciones/cerrar-mesa/cargarNotasMesa');
const obtenerMesa = require('../transacciones/cerrar-mesa/obtenerMesa');

/**
 * Obtiene la mesa y sus alumnos solo si esta completada y previa a la fecha de hoy.
 */
router.get('/cerrar-mesa/obtener-mesa/:acta', asyncHandler(async (req, res) => {
    const acta = req.params.acta;

    const response = await obtenerMesa(acta);

    res.send({ ok: true, response });
}));

/**
 * Para controlar si no se envia acta
 */
router.get('/cerrar-mesa/obtener-mesa', asyncHandler(async (req, res) => {
    throw "Por Favor, Ingrese un Acta";
}));

/**
 * Carga los resultados de los alumnos que rindieron en la mesa con las notas y la asistencia.
 */
router.put('/cerrar-mesa/cargar-notas-mesa/:oidMesa', asyncHandler(async (req, res) => {
    const oidMesa = req.params.oidMesa;
    const notas = req.body;

    // TODO: veriicar notas

    const response = await cargarNotasMesas(oidMesa, notas);

    res.send({ ok: true, response });
}));

/**
 * Carga los resultados de los alumnos que rindieron en la mesa con las notas y la asistencia.
 */
router.put('/cerrar-mesa/cargar-notas-mesa', asyncHandler(async (req, res) => {
    throw "Por Favor, Ingrese un Identificador de Mesa";
}));

module.exports = router;