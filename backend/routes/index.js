'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
const personaHandler =require('./persona');
const mesaExamenHandler = require('./mesa-examen');
const cicloLectivoHandler = require('./ciclo-lectivo');
const inscribirAlumnoHandler = require('./inscribir-alumno');
const inscribirMesaHandler = require('./inscribir-mesa');
const responsableHandler = require('./responsable');
const cerrarMesaHandler = require('./cerrar-mesa');
const agregarDatosMesaHandler = require('./agregarDatosMesa');
const dictadoHandler =require('./dictado');
const consultarInfoAlumnHandler = require('./consultarInfoAlumno');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

//recursos independientes
app.use(dictadoHandler);
app.use(alumnosHandler);
app.use(mesaExamenHandler);
app.use(cicloLectivoHandler);
app.use(responsableHandler);
app.use(personaHandler);

//movimientos
app.use(inscribirAlumnoHandler);
app.use(inscribirMesaHandler);
app.use(cerrarMesaHandler);
app.use(agregarDatosMesaHandler);
app.use(consultarInfoAlumnHandler);


module.exports = app;