'use strict'
//Controladores
const { createCurso, getCursoAlumno } = require('../controllers/curso');
const { createAlumno, getAlumnoById, } = require('../controllers/alumno');
const { getCicloLectivo } = require('../controllers/cicloLectivo');
const alumno = require('../controllers/alumno');
const { getDictado } = require('../controllers/dictado');


function consultarInformacionAlumno(dni) {
    //Esta transaccion se encarga de devolver todos los datos del alumno con dni ingresado por parametro

    //Obtener Alumno con su responsable
    const alumno = obtenerAlumnoConResponsable(dni);


    //Obtener Ciclo Lectivo Actual
    const cicloLectivo = obtenerCicloLectivo();


    //Obtener Curso de Alumno del Ciclo lectivo Actual 
    const oidAlumno = alumno._id;
    const curso = obtenerCursoAlumno(cicloLectivoActual[cicloLectivo], oidAlumno);


    //Obtener Calificaciones del ciclo lectivo actual
    const calificacionesActuales = obtenerCalificacionesCiclo(cicloLectivoActual.cicloLectivo, alumno.calificaciones);


    //Obtener Materias de los Dictados de las Calificaciones 

    const

    //Obtener Inasistencias del Alumno de los Dictados del Ciclo lectivo actual #TODO

    //Obtener Observaciones del Alumno#TODO

    //Obtener Sanciones del Alumno#TODO

    //Obtener Padres del Alumno#TODO

    //Obtener Hermanos del Alumno#TODO

    //Devolver toda la info obtenida#TODO


}


function obtenerAlumnoConResponsable(dni) {
    //Obtiene toda la información del alumno, dice con responsable porque antes responsable era un esquema separado
    var alumno = await getAlumnoById(dni);
    return alumno;
}

function obtenerCicloLectivo() {
    //const obteneranioActual y enviarlo como parametro #TODO
    var ciclosLectivos = getCicloLectivo();
    return ciclosLectivos;
}

function obtenerCalificacionesCiclo(ciclo, calificaciones) {
    //Busca todos las calificaciones del ciclo lectivo ingresado como parametro
    const calificaciones = calificaciones.filter(calificacion => calificacion.cicloLectivo == ciclo);
    return calificaciones;
}
function obtenerCalificacionesMateria(materia, calificaciones) {
    //Busca todos las calificaciones de la materia  ingresada por parametro
    var i, dictadoABuscar, califActual, dictado;
    var califMateria = [];
    //calificaciones de la materia elegida
    for (i in calificaciones) {
        califActual = (response[0].calificaciones[i]);
        dictadoABuscar = califActual.dictado;
        dictado = await getDictado(dictadoABuscar);
        if (dictado.materia.nombre == materia) {
            //Si es la materia buscada
            califMateria.push(califActual);
        }

    }
    return califMateria;
}

function obtenerCursoAlumno(cicloActual, oidAlumno) {
    const curso = getCursoAlumno(cicloActual, oidAlumno);
    return curso;
}
