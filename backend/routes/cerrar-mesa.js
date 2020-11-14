'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const obtenerMesasCompletadas = require('../transacciones/cerrar-mesa/obtenerMesasCompletadas');
const obtenerAlumnosMesa = require('../transacciones/cerrar-mesa/obtenerAlumnosMesa');
const cargarNotasMesa = require('../transacciones/cerrar-mesa/cargarNotasMesa');

//TODO: ver si muestro mesas o solo pido acta

/**
 * Obtiene las mesas completadas para ser seleccionadas y cerrarlas.
 */
router.get('/cerrar-mesa/obtener-mesas-completadas/', asyncHandler(async (req, res) => {
    const response = await obtenerMesasCompletadas();

    res.send({ ok: true, response });
}));

/**
 * Devuelve la mesa (con sus asociadas), junto con los datos de cada alumno anotado a ellas
 */

//FIXME: ver si va acta u oidMesa

router.get('/cerrar-mesa/obtener-alumnos-mesa/:acta', asyncHandler(async (req, res) => {
    const acta = req.params.acta;

    const response = await obtenerAlumnosMesa(acta);

    res.send({ ok: true, response });
}));

/**
 * Carga los resultados de los alumnos que rindieron en la mesa con las notas y la asistencia.
 */

//FIXME: ver si va acta u oidMesa

router.get('/cerrar-mesa/cargar-notas-mesa/:acta', asyncHandler(async (req, res) => {
    const acta = req.params.acta;
    //FIXME: ver si las notas capaz conviene q vengan dentro del body como arreglo
    const notas = req.params.body;

    const response = await cargarNotasMesa(acta, notas);

    res.send({ ok: true, response });
}));

module.exports = router;