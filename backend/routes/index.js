'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
const cursoHandler = require('./curso');
const mesaExamenHandler = require('./mesa-examen');
const cicloLectivoHandler = require('./cicloLectivo');
const materiaHandler = require('./materia');
const dictadoHandler =require('./dictado');
const personaHandler =require('./persona');
const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

app.use(alumnosHandler);
app.use(mesaExamenHandler);
app.use(cursoHandler);
app.use(cicloLectivoHandler);
app.use(materiaHandler);
app.use(dictadoHandler);
app.use(personaHandler)


module.exports = app;