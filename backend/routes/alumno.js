'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');



const router = express.Router();

const { createAlumno, updateAlumno,updateAlumno2, getAllAlumnos, getAlumnoById, deleteAlumno,getCalificacionesAlumno } = require('../controllers/alumno');
const asynchandler = require('../middlewares/asynchandler');
const {getDictado}=require('../controllers/dictado');


router.post('/alumno', asyncHandler( async (req, res) => {

    const alumno = req.body

    const response = await createAlumno(alumno);

    res.send({ ok: true, response  });
}));


router.get('/alumno/:dni', asynchandler( async (req, res) => {

    const dni = req.params.dni

    const response = await getAlumnoById(dni)
    //const calificaciones=response[0].calificaciones.filter(calificacion=>calificacion.cicloLectivo==2011); #TODO SACA
    //console.log(calificaciones); #TODO SACAR

    var i,dictadoABuscar,califActual,dictado;
    var califMateria = [];
    //calificaciones de la materia elegida
    //for (i in response[0].calificaciones) {
    //    califActual=(response[0].calificaciones[i]);
    //    dictadoABuscar = califActual.dictado;
    //     dictado = await getDictado(dictadoABuscar);
    //    if (dictado.materia.nombre == "Biologia") {
    //        califMateria.push(califActual);
    //    }

   // }
   // console.log(califMateria);
    res.send({ ok: true, response })

}));


router.get('/alumno', asyncHandler( async (req, res) => {

    
    const response = await getAllAlumnos();

    res.send({ ok: true, response });

}));






router.put('/alumno/:oid', asyncHandler( async (req, res) => {

    const alumno = req.body
    const oidAlumno=req.params.oid;
    const response = await updateAlumno2(oidAlumno,alumno);

    res.send({ ok: true, response });

}));


router.delete('/alumno/:dni', asyncHandler( async (req, res) => {

    const dni = req.params.dni

    const response = await deleteAlumno(dni)

    res.send({ ok: true, response })    
}));

router.get('/alumno/dniConsultarInfo/:dni', asynchandler( async (req, res) => {

    const dni = req.params.dni

    const response = await getAlumnoConsultarInfo(dni)

    res.send({ ok: true, response })

}));


module.exports = router;