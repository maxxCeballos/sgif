'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const obtenerDictados = require('../transacciones/cerrar-mesa/');

//TODO: ver si muestro mesas o solo pido acta

/**
 * Obtiene las mesas completadas para ser seleccionadas y cerrarlas.
 */
router.get('/cerrar-mesa/obtener-mesas-completadas/', asyncHandler(async (req, res) => {
    const response = await obtenerMesasCompletadas();

    res.send({ ok: true, response });
}));

/**
 * Carga los resultados de los alumnos que rindieron en la mesa con las notas y la asistencia.
 */
router.get('/cerrar-mesa/cargar-notas-mesa/:oidMesa', asyncHandler(async (req, res) => {
    const oidMesa = req.params.oidMesa;
    //FIXME: ver si las notas capaz conviene q vengan dentro del body como arreglo
    const notas = req.params.body;

    const response = await cargarNotasMesa(oidMesa, notas);

    res.send({ ok: true, response });
}));

module.exports = router;