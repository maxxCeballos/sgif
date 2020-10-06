'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();

const { createAlumno, updateAlumno, getAlumno, deleteAlumno } = require('../controllers/alumno');


router.post('/alumno', asyncHandler( async (req, res) => {

    const alumno = req.body.alumno;

    const response = await createAlumno(alumno);

    res.status(200).send({ messageR: "response desde routes", messageC: response });
}));




router.get('/alumno', (req, res) => {

    console.log(req)

});


router.put('/alumno', (req, res) => {

});


router.delete('/alumno', (req, res) => {

})



module.exports = router;