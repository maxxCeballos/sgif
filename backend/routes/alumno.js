'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { createAlumno,
    updateAlumno,
    getAllAlumnos,
    getAlumnoById,
    deleteAlumno,
    addCalificacion } = require('../controllers/alumno');

router.post('/alumno', asyncHandler(async (req, res) => {

    const alumno = req.body

    const response = await createAlumno(alumno);

    res.send({ ok: true, response });
}));


router.get('/alumno/:dni', asyncHandler(async (req, res) => {

    const dni = req.params.dni

    const response = await getAlumnoById(dni)

    res.send({ ok: true, response })

}));


router.get('/alumno', asyncHandler(async (req, res) => {

    const response = await getAllAlumnos();

    res.send({ ok: true, response });

}));

router.put('/alumno/:dni', asyncHandler(async (req, res) => {
    // //TODO:revisar no me anduvo req.query usando postman, dio undefined por consola
    // const dniAlumno = req.params.dni;
    // const { atributo, valor } = req.query;

    const dniAlumno = req.params.dni;
    const atributo = req.query.atributo;
    const valor = req.query.valor;

    console.log(atributo + " " + valor + " " + dniAlumno);

    const response = await updateAlumno(atributo, valor, dniAlumno);

    res.send({ ok: true, response });

}));

/**
 * Agregar calificacion a Alumno
 */
router.put('/calificacion/:dni', asyncHandler(async (req, res) => {
    const dniAlumno = req.params.dni;
    const calificacion = req.body

    const response = await addCalificacion(calificacion, dniAlumno);

    res.send({ ok: true, response });

}));

router.delete('/alumno/:dni', asyncHandler(async (req, res) => {

    const dni = req.params.dni

    const response = await deleteAlumno(dni)

    res.send({ ok: true, response })
}));

module.exports = router;