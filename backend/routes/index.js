'use strict';


const express = require('express');

// controllers
const alumnosHandler = require('./alumno');

const app = express();

app.get('/', (req, res) => {
    res.send('Bienvenidos a Fatima');
});

app.use(alumnosHandler);




module.exports = app;