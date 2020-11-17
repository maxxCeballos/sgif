'use strict'
//Controladores
const {  getCursoAlumno } = require('../controllers/curso');
const {  getAlumnoById, } = require('../controllers/alumno');
const { getCicloLectivoActual } = require('../controllers/cicloLectivo');
const alumno = require('../controllers/alumno');
const cicloLectivo = require('../controllers/cicloLectivo');


function consultarInformacionAlumno(dni) {
    //agregar opcion buscar por materia o ciclo lectivo
    
    //Esta transaccion se encarga de devolver todos los datos del alumno con dni ingresado por parametro

    //Obtener Alumno con su responsable
    const alumno = obtenerAlumnoConResponsable(dni);


    //Obtener Ciclo Lectivo Actual
    const cicloLectivoActual = obtenerCicloLectivoActual();


    //Obtener Curso de Alumno del Ciclo lectivo Actual 
    const oidAlumno = alumno['_id'];
    const curso = obtenerCursoAlumno(cicloLectivoActual[cicloLectivo],oidAlumno);


    //Obtener Calificaciones del ciclo lectivo actual
    const calificacionesActuales = obtenerCalificacionesActuales(cicloLectivoActual['cicloLectivo'], alumno['calificaciones']); 

    //Obtener Materias de los Dictados de las Calificaciones #TODO

    const materias= obtenerMaterias(calificacionesActuales);

    //Obtener Inasistencias del Alumno de los Dictados del Ciclo lectivo actual #TODO



    //Obtener Observaciones del Alumno

    //Obtener Sanciones del Alumno

    //Obtener Padres del Alumno

    //Obtener Hermanos del Alumno

    //Devolver toda la info obtenida


}


function obtenerAlumnoConResponsable(dni) {
    //Obtiene toda la información del alumno, dice con responsable porque antes responsable era un esquema separado
    var alumno = await getAlumnoById(dni);
    return alumno;
}

function obtenerCicloLectivoActual() {
    //const obteneranioActual y enviarlo como parametro #TODO
    var ciclosLectivos = getCicloLectivoActual();
    return ciclosLectivos;
}

function obtenerCalificacionesActuales(ciclo,calificaciones) {
    //Busca todos las calificaciones del ciclo lectivo actual
    let califActuales=calificaciones.filter(calificacion => calificacion.cicloActual=ciclo);
    return calificaciones;
}

function obtenerCursoAlumno(cicloActual, oidAlumno) {
    const curso = getCursoAlumno(cicloActual, oidAlumno);
    return curso;
}

function obtenerMaterias(calificaciones){
//Busca todas las materias de las calificaciones y las devuelve




return materias;
}
