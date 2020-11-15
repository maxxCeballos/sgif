'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
<<<<<<< HEAD
const mesaExamenHandler = require('./mesa-examen');
=======
//const mesaExamenHandler = require('./mesa-examen');
>>>>>>> transacciones-gaston
const cicloLectivoHandler = require('./ciclo-lectivo');
const inscribirAlumnoHandler = require('./inscribir-alumno');
const responsableHandler = require('./responsable');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

//recursos independientes
app.use(alumnosHandler);
<<<<<<< HEAD
app.use(mesaExamenHandler);
=======
//app.use(mesaExamenHandler);
>>>>>>> transacciones-gaston
app.use(cicloLectivoHandler);
app.use(responsableHandler);

//movimientos
app.use(inscribirAlumnoHandler);

module.exports = app;