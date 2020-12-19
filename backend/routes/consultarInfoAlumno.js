'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();


const { obtenerCalificacionesCiclo, obtenerDictadosCalificaciones, obtenerInasistenciaCiclo, obtenerCalificacionesMateria } = require('../transacciones/consultarInformacion.js');
const { getCursoAlumno } = require('../controllers/curso');
const { getAlumnoByDni, } = require('../controllers/alumno');
const { getCicloLectivoActual } = require('../controllers/cicloLectivo');
const { getResponsableAlumno } = require('../controllers/responsable');
const { getPreceptorSancion } = require('../controllers/persona');

router.get('/consultarInfoCicloActual/:dni', asyncHandler(async (req, res) => {
  //Esta ruta corresponde  a la transacción consultar Información Alumno del ciclo lectivo actual
  let dictados, cursoActual, calificacionesActuales, dniAlumno, response = {}, cicloActual, inasistencias;
  var alumno, responsable;
  dniAlumno = req.params.dni;
  //Se obtiene el alumno
  alumno = await getAlumnoByDni(dniAlumno);

  //Obtenemos el cicloLectivoAactual
  cicloActual = await getCicloLectivoActual();

  //Obtener Curso de Alumno del Ciclo lectivo Actual

  cursoActual = await getCursoAlumno(cicloActual.cicloLectivo, alumno._id);
  //console.log(cursoActual);

  //Obtener Calificaciones del ciclo lectivo actual
  calificacionesActuales = obtenerCalificacionesCiclo(cicloActual.cicloLectivo, alumno.calificaciones);

  //console.log(calificacionesActuales);

  //Obtener Dictados de las calificaciones, las cuales tienen la materia
  dictados = await obtenerDictadosCalificaciones(calificacionesActuales).then(function (result) {
    //console.log(result); 
    return result;
  });
  console.log(dictados);

  response = { ciclo: cicloActual, curso: cursoActual, calificaciones: dictados };

  res.send({ ok: true, response });
}));


router.get('/consultarInfo/:dni', asyncHandler(async (req, res) => {
  //Esta ruta se consulta cuando se necesita saber información del alumno que no es referida a las notas
  let alumno, response, sancion, sanciones = [], cicloActual, inasistencias;
  alumno = await getAlumnoByDni(dniAlumno);
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
  inasistencias = obtenerInasistenciaCiclo(alumno.presentismos, cicloActual)
  response = {
    observaciones: alumno.observaciones,
    sanciones: sanciones,
    presentismos: obtenerInasistenciaCiclo()

  }
  res.send({ ok: true, response });
}));

router.get('/consultarCalificacionesMateria/:dni', asyncHandler(async (req, res) => {
  //Esta ruta se consulta cuando se necesita saber las calificaciones del alumno para 1 materia en su historia academaica
  let alumno, calificaciones, response ;
  alumno = await getAlumnoByDni(dniAlumno);
  calificaciones = obtenerCalificacionesMateria(req.query.materia, alumno.calificaciones);
  reponse = calificaciones;
  res.send({ ok: true, response });
}));

module.exports = router;