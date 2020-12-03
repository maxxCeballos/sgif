'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();


const { obtenerCalificacionesCiclo, obtenerDictadosCalificaciones, obtenerInasistenciaCiclo, obtenerCalificacionesMateria } = require('../transacciones/consultarInformacion.js');
const { getCursoAlumno } = require('../controllers/curso');
const { getAlumnoByDni, } = require('../controllers/alumno');
const { getCicloLectivoActual } = require('../controllers/cicloLectivo');
const { getResponsableAlumno } = require('../controllers/responsable');
const { getPreceptorSancion, getPersona } = require('../controllers/persona');

router.get('/consultarCalificacionesCicloActual/:dni', asyncHandler(async (req, res) => {
  //Esta ruta corresponde  a la transacción consultar Información Alumno del ciclo lectivo actual
  let dictados, cursoActual, calificacionesActuales, dniAlumno, response = {}, cicloActual, inasistencias;
  var alumno, responsable;
  dniAlumno = req.params.dni;
  //Se obtiene el alumno
  alumno = await getAlumnoByDni(dniAlumno);

  //Obtenemos el cicloLectivoAactual
  cicloActual = await getCicloLectivoActual();




  //Obtener Calificaciones del ciclo lectivo actual
  calificacionesActuales = obtenerCalificacionesCiclo(cicloActual.cicloLectivo, alumno.calificaciones);

  //console.log(calificacionesActuales);

  //Obtener Dictados de las calificaciones, las cuales tienen la materia
  dictados = await obtenerDictadosCalificaciones(calificacionesActuales).then(function (result) {
    //console.log(result); 
    return result;
  });
  console.log(dictados);

  response = { ciclo: cicloActual, calificaciones: dictados };

  res.send({ ok: true, response });
}));


router.get('/consultarInfo/:dni', asyncHandler(async (req, res) => {
  //Esta ruta se consulta cuando se necesita saber información del alumno que no es referida a las notas
  let inasistencias = [], alumno, informacion, sancion, sanciones = [], cicloActual;
  alumno = await getAlumnoByDni(req.params.dni);
  for (san in alumno.sanciones) {
    sancion = {
      id: san.id,
      fecha: san.fecha,
      cantidad: san.cantidad,
      justificacion: san.justificacion,
      preceptor: await getPreceptorSancion(san.preceptorSancion)
    }
    sanciones.push(sancion);
  }
  cicloActual = await getCicloLectivoActual();
  inasistencias = await obtenerInasistenciaCiclo(alumno.presentismos, cicloActual)
  console.log(inasistencias);
  informacion = {
    observaciones: alumno.observaciones,
    sanciones: sanciones,
    presentismos: inasistencias

  }
  res.send({ ok: true, informacion });
}));

router.get('/consultarCalificacionesMateria/:dni', asyncHandler(async (req, res) => {
  //Esta ruta se consulta cuando se necesita saber las calificaciones del alumno para 1 materia en su historia academaica
  let alumno, calificaciones, calificacionesMateria = [];
  alumno = await getAlumnoByDni(req.params.dni);
  calificaciones = await obtenerCalificacionesMateria(req.query.materia, alumno.calificaciones);
  console.log(calificaciones);
  calificacionesMateria = {
    calificaciones: calificaciones
  };
  res.send({ ok: true, calificacionesMateria });
}));

router.get('/consultarInfoFamiliar/:dni', asyncHandler(async (req, res) => {
  //Esta ruta corresponde  a la transacción consultar Información Alumno, se obtiene la información familiar del alumno
  let dniAlumno, familia, alumno, responsable, padre = 0, padres = [], padreActual,hermanos=[],hermano=0,hermanoActual;
  dniAlumno = req.params.dni;
  //Se obtiene el alumno
  alumno = await getAlumnoByDni(dniAlumno);
  responsable = await getPersona(alumno.responsable);

  for (padre in alumno.padres) {
    padreActual = await getPersona(alumno.padres[padre]);
    padres.push(padreActual);
  }
  for (hermano in alumno.hermanos) {
    hermanoActual = await getPersona(alumno.hermanos[hermano]);
    hermanos.push(hermanoActual);
  }
  familia={
    responsable:responsable,
    padres:padres,
    hermanos:hermanos

  }
  res.send({ ok: true, familia });
}));


module.exports = router;