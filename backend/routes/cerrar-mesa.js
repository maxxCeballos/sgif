'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const obtenerMesasCompletadas = require('../transacciones/cerrar-mesa/obtenerMesasCompletadas');
const obtenerAlumnosMesas = require('../transacciones/cerrar-mesa/obtenerAlumnosMesa');
const cargarNotasMesas = require('../transacciones/cerrar-mesa/cargarNotasMesa');

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

    const response = await obtenerAlumnosMesas(acta);

    res.send({ ok: true, response });
}));

/**
 * Carga los resultados de los alumnos que rindieron en la mesa o mesas (asociadas) con las notas y la asistencia.
 */

//FIXME: ver si va acta u oidMesa

router.put('/cerrar-mesa/cargar-notas-mesa/', asyncHandler(async (req, res) => {
    const notas = req.body;

    const response = await cargarNotasMesas(mesasConNotas);

    res.send({ ok: true, response });
}));

//TODO: DELETE
router.put('/test-guido-array', asyncHandler(async (req, res) => {
    const notas = req.body;

    console.log(notas)

    const response = "Hola";

    res.send({ ok: true, response });
}));

module.exports = router;