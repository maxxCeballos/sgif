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
 * Carga los resultados de los alumnos que rindieron en la mesa o mesas (asociadas) con las notas y la asistencia.
 */
router.put('/cerrar-mesa/cargar-notas-mesa/', asyncHandler(async (req, res) => {
    const notas = req.body;

    const response = await cargarNotasMesas(notas);

    res.send({ ok: true, response });
}));

module.exports = router;