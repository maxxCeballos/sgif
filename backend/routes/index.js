'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
const mesaExamenHandler = require('./mesa-examen');
const cicloLectivoHandler = require('./ciclo-lectivo');
const inscribirAlumnoHandler = require('./inscribir-alumno');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

//recursos independientes
app.use(alumnosHandler);
app.use(mesaExamenHandler);
app.use(cicloLectivoHandler);

//movimientos
app.use(inscribirAlumnoHandler);

module.exports = app;