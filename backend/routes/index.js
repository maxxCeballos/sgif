'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');
const mesaExamenHandler = require('./mesa-examen');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

app.use(alumnosHandler);
app.use(mesaExamenHandler);




module.exports = app;