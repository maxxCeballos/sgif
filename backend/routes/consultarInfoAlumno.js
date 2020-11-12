'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const {obtenerCalificacionesCiclo,obtenerDictadosCalificaciones,obtenerInasistenciaCiclo} =require('../transacciones/consultarInformacion.js');

const router = express.Router();
const { getCursoAlumno } = require('../controllers/curso');
const { getAlumnoByDni, } = require('../controllers/alumno');
const { getCicloLectivoActual } = require('../controllers/cicloLectivo');

const alumno = require('../controllers/alumno');

const { getResponsableAlumno } = require('../controllers/responsable');

router.get('/consultarInfoCicloActual/:dni', asyncHandler(async (req, res) => {
    //Esta ruta corresponde  a la transacción consultar Información Alumno del ciclo lectivo actual
    let dictados, cursoActual, calificacionesActuales, dniAlumno, response = {},cicloActual,inasistencias;
    var alumno, responsable;
    dniAlumno = req.params.dni;
    //Se obtiene el alumno
    alumno = await getAlumnoByDni(dniAlumno);

    //Se obtiene el resonsable del alumno
    responsable = await getResponsableAlumno(alumno.responsable);

    //Obtenemos el cicloLectivoAactual
    cicloActual = await getCicloLectivoActual();
  
    //Obtener Curso de Alumno del Ciclo lectivo Actual
  
    cursoActual = await getCursoAlumno(cicloActual.cicloLectivo, alumno._id);
    //console.log(cursoActual);

    //Obtener Calificaciones del ciclo lectivo actual
    calificacionesActuales = obtenerCalificacionesCiclo(cicloActual.cicloLectivo, alumno.calificaciones);

    //console.log(calificacionesActuales);

    //Obtener Dictados de las calificaciones, las cuales tienen la materia
    dictados=obtenerDictadosCalificaciones(calificacionesActuales).then(function(result) {
        //console.log(result); 
        return result;
      });
    console.log(dictados);
    
    response ={ ciclo: cicloActual, curso: cursoActual, calificaciones: dictados, presentismos: inasistencias };
    
    res.send({ ok: true, response });
}));

//Rutas relacionada con alumno
module.exports = router;