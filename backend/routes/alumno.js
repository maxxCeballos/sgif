'use strict';

const express = require('express');


const router = express.Router();

const { createAlumno } = require('../controllers/alumno');


router.post('/alumno', (req, res) => {

    const alumno = req.body.alumno;

    const response = createAlumno(alumno);

    res.status(200).send({ status: true, data: alumno });
});



module.exports = router;