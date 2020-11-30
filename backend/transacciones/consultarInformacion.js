'use strict'


//Controladores
const { getCursoAlumno } = require('../controllers/curso');
const { getAlumnoById, } = require('../controllers/alumno');
const { getCicloLectivo } = require('../controllers/cicloLectivo');
const alumno = require('../controllers/alumno');
const { getDictado } = require('../controllers/dictado');


function consultarInformacionAlumno(dni) {
    //Esta transaccion se encarga de devolver todos los datos del alumno con dni ingresado por parametro
    //Obtener Alumno con su responsable
    const alumno = obtenerAlumnoConResponsable(dni);
    //escribir decision de diseño que se separa la responsabilidad del alumno

    //Obtener Ciclo Lectivo Actual
    const cicloLectivoActual = obtenerCicloLectivo();

    //Obtener Curso de Alumno del Ciclo lectivo Actual
    const oidAlumno = alumno._id;
    const curso = obtenerCursoAlumno(cicloLectivoActual.cicloLectivo, oidAlumno);


    //Obtener Calificaciones del ciclo lectivo actual
    const calificacionesActuales = obtenerCalificacionesCiclo(cicloLectivoActual.cicloLectivo, alumno.calificaciones);

    //Obtener Materias de los Dictados de las Calificaciones


    //Obtener Inasistencias del Alumno de los Dictados del Ciclo lectivo actual #TODO
    obtenerInasistenciasAlumno(alumno.presentismos, cicloLectivoActual.cicloLectivo);


    //Obtener Observaciones del Alumno

    //Obtener Sanciones del Alumno

    //Obtener Padres del Alumno

    //Obtener Hermanos del Alumno

    //Devolver toda la info obtenida

}


// function obtenerAlumnoConResponsable(dni) {
//     //Obtiene toda la información del alumno, dice con responsable porque antes responsable era un esquema separado
//     var alumno = await getAlumnoById(dni);
//     return alumno;
// }

function obtenerCicloLectivo() {
    //const obteneranioActual y enviarlo como parametro #TODO
    var ciclosLectivos = getCicloLectivo();
    return ciclosLectivos;
}

function obtenerCalificacionesCiclo(ciclo, calificaciones) {
    //Busca todos las calificaciones del ciclo lectivo ingresado como parametro
    const calificacionesResponse = calificaciones.filter(calificacion => calificacion.cicloLectivo == ciclo);
    return calificacionesResponse;
}




async function obtenerCalificacionesMateria(materia, calificaciones) {
    //Busca todos las calificaciones de la materia  ingresada por parametro
    var i, dictadoABuscar, califActual, dictado;
    var califMateria = [];
    //calificaciones de la materia elegida
    for (i in calificaciones) {
        califActual = (calificaciones[i]);
        dictadoABuscar = califActual.dictado;
        dictado = await getDictado(dictadoABuscar);

        if (dictado.materia.nombre == materia) {

            //Si es la materia buscada, lo guardo en el arreglo
            califMateria.push(califActual);
        }

    }
    return califMateria;
}

function obtenerCursoAlumno(cicloActual, oidAlumno) {
    getCursoAlumno(cicloActual, oidAlumno);
    return curso;
}

async function obtenerInasistenciasAlumno(asistencias, cicloLectivo) {
    //Busco las inasistencias del ciclo lectivo recibido por parametro
    var i, dictadoABuscar, asistenciaActual, dictado;
    var inasistencias = [];
    //calificaciones de la materia elegida
    for (i in asistencias) {
        asistenciaActual = (asistencia[i]);
        dictadoABuscar = asistenciaActual.dictado;
        dictado = await getDictado(dictadoABuscar);
        if (dictado.cicloLectivo == cicloLectivo) {
            //Si es la materia buscada, lo guardo en el arreglo
            califMateria.push(califActual);
        }

    }
    return califMateria;



}

async function obtenerDictadosCalificaciones(calificaciones) {
    //Busca todos los dictados de las calificaciones
    var i, dictadoABuscar, dictadoActual, califActual;
    var tuplaDC = []; //Guarda un json de calificacion junto a su dictado
    for (i in calificaciones) {
        //console.log(i);
        califActual = calificaciones[i];
        dictadoABuscar = califActual.dictado;
        dictadoActual = await getDictado(dictadoABuscar);
        tuplaDC.push({ 'calificacion': califActual, 'dictado': dictadoActual });
        //console.log(tuplaDC);
    }
    return tuplaDC;
}

async function obtenerInasistenciaCiclo(presentismos, cicloLectivo) {
    //Esta función filtra las inasistencias del ciclo lectivo recibido como parametro
    var inasistencias = [], i;
    let presentismoActual;

    for (i in presentismos) {
        presentismoActual = presentismos[i];

        if (JSON.parse(JSON.stringify(presentismoActual)).hasOwnProperty('inasistencia') && presentismoActual.fecha.getFullYear() == cicloLectivo.cicloLectivo) {

            inasistencias.push(presentismoActual);
        }
    }
    return inasistencias;

}
module.exports = {
    obtenerCicloLectivo,
    obtenerCalificacionesMateria,
    obtenerCalificacionesCiclo,
    obtenerCursoAlumno,
    obtenerInasistenciasAlumno,
    obtenerInasistenciaCiclo,
    obtenerDictadosCalificaciones
};