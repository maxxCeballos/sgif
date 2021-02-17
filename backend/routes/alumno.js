'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');

const router = express.Router();

const { createAlumno, updateAlumnoOID, getAllAlumnos, getAlumnoById, deleteAlumnoOID, setPadre, getPadres } = require('../controllers/alumno');
const { response } = require('express');

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

router.put('/alumno/:oidAlumno', asyncHandler(async (req, res) => {
    const oidAlumno = req.params.oidAlumno;
    const { atributo, valor } = req.query;

    const response = await updateAlumnoOID(atributo, valor, oidAlumno);

    res.send({ ok: true, response });
}));

router.delete('/alumno/:oid', asyncHandler(async (req, res) => {

    const oid = req.params.oid

    const response = await deleteAlumnoOID(oid)

    res.send({ ok: true, response })
}));

router.put('/alumno/setPadre/:oid', asyncHandler(async (req, res,) => {
    const oidAlumno = req.params.oid;
    const oidPadre = req.query.oidPadre;

    const response = await setPadre(oidPadre, oidAlumno);

    res.send({ ok: true, response })
}));

router.get('/alumno/getPadres/:oid', asyncHandler(async (req, res,) => {
    const oidAlumno = req.params.oid;    

    const response = await getPadres(oidAlumno);
    
    res.send({ ok: true, response })
}));

module.exports = router;