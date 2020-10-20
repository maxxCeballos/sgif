'use strict'

const { createAlumno, getAlumnoById, updateAlumno, generarLegajo } = require('./alumno');
const { getCicloLectivo } = require('./ciclo-lectivo');

/**
 * modulo que verifica si se encuentra dentro del período de inscripción o no
 * @return retorna un mensaje que indica si la fecha es valida o no
 */
const validarFechaInscripcion = async () => {

    const cicloLectivoDB = await getCicloLectivo();

    //console.log(cicloLectivoDB);

    let response;

    if (new Date().toISOString() <= cicloLectivoDB.fechaFinInscripcion.toISOString()) {
        response = { message: "Incripciones Abiertas" }
    }
    else {
        response = { message: "Incripciones Cerradas" }
    }

    return response
}

/**
 * metodo que valida si un alumno esta registrado o no.
 * si es asi determinar si se debe reinscribir y en caso de no estarlo se debe inscribir.
 *  
 * @param {*} dni dni para buscar al alumno en el sistema
 * @return {*} response json con los datos del alumno (en el caso de existir), sino mensaje con el error correspondiente
 */
const validarAlumno = async (dni) => {

    const alumnoDB = await getAlumnoById(dni);
    let response = { alumnoDB };
    let estadoInscripcion;

    //console.log(alumnoDB.length);

    if (alumnoDB.length === 1) {

        estadoInscripcion = alumnoDB.estadoInscripcion;

        if(estadoInscripcion == "No Inscripto") {
            response = {message: "El alumno no esta inscripto, puede reinscribir"}
        }
        
        /*//FIXME: arreglar
        if (estadoInscripcion == "Reinscripto") {
            response = { message: "El alumno ya está Reinscripto" }
        } else if (estadoInscripcion == "Inscripto") {
            response = { message: "El alumno ya está Inscripto, no puede reinscribir" }
        }*/

    } else if (alumnoDB.length === 0) {
        response = { message: "El alumno no existe, puede inscribir" }
    } else {
        response = { message: "Error, más de un alumno con el mismo dni" }
    }

    return response
}

/**
 * metodo que captura las responsabilidades de generar el legajo y registrar el alumno
 * asociando su responsable y su nuevo estado de inscripción.
 * @param {*} alumno 
 */

const registrarAlumno = async (alumno, oidResponsable) => {

    const legajo = await generarLegajo();

    //TODO: ver response para devolver el alumno despues del update
    const alumnoDB = await createAlumno(alumno, legajo, oidResponsable);
    
    //FIXME: ver dni, que lo saque del alumno que viene por parametro
    const response = await updateAlumno("estadoInscripcion", "Inscripto", alumno.dni);

    return response;
}

/**
 * modulo que se encarga de hacer la reinscripción del alumno
 * actualiza el año al que se va a reinscribir y el estado de inscripcion
 * @param {*} anioReinscripcion 
 * @param {*} dniAlumno 
 */
const reinscribirAlumno = async (anioReinscripcion, dniAlumno) => {

    const response1 = await updateAlumno("anioCorrespondiente", anioReinscripcion, dniAlumno);

    const response2 = await updateAlumno("estadoInscripcion", "Reinscripto", dniAlumno);

    return response1 && response2;
}

module.exports = {
    validarFechaInscripcion,
    validarAlumno,
    registrarAlumno,    
    reinscribirAlumno
}