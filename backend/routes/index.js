'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
//const mesaExamenHandler = require('./mesa-examen');
const cicloLectivoHandler = require('./ciclo-lectivo');
const inscribirAlumnoHandler = require('./inscribir-alumno');
const responsableHandler = require('./responsable');
const altaCurso = require('./alta-curso');
const notasTrimestrales = require('./registrar-notas-tri');
const completarFamiliaHandler = require('./completar-familia');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

//recursos independientes
app.use(alumnosHandler);
//app.use(mesaExamenHandler);
app.use(cicloLectivoHandler);
app.use(responsableHandler);

//movimientos
app.use(inscribirAlumnoHandler);
app.use(altaCurso);

app.use(notasTrimestrales);
app.use(completarFamiliaHandler);

module.exports = app;