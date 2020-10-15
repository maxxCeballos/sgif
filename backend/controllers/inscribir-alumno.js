'use strict'

let Alumno = require('../models/alumno.model'); //TODO: esta bien aca

const { createAlumno, getAlumnoById, updateAlumno, getUltimoLegajo } = require('./alumno');
const { createResponsable } = require('./responsable');
const { getCicloLectivo } = require('./ciclo-lectivo');

/**
 * modulo que verifica si se encuentra dentro del período de inscripción o no
 * @return retorna un mensaje que indica si la fecha es valida o no
 */
const validarFechaInscripcion = async () => {

    const cicloLectivoDB= await getCicloLectivo();

    console.log (cicloLectivoDB);
    
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

    if (alumnoDB.length === 1) { //si existe el alumno (no existe más de uno, este lo controla)

        //FIXME: hacer que retorne siempre algo, si hay mas de uno el error sino el alumno
        estadoInscripcion = alumnoDB[0].estadoInscripcion;
        
        /*
        if(estadoInscripcion == "No Inscripto") {
            response = {message: "El alumno no esta inscripto, puede reinscribir"}
        }
        */

        if (estadoInscripcion == "Reinscripto") {            
            response = { message: "El alumno ya está Reinscripto" }
        } else if (estadoInscripcion == "Inscripto") {            
            response = { message: "El alumno ya está Inscripto, no puede reinscribir" }
        }

    } else {
        response = { message: "El alumno no existe, puede inscribir" }
    }

    return response
}

/**
 * metodo que registra al nuevo alumno y le asigna su legajo a partir del ultimo registrado
 * @param {*} alumno 
 */

const registrarAlumno = async (alumno) => {

    const alumnoDB = await createAlumno(alumno);

    //const ultimoLegajo = await Alumno.find().sort({ legajo: -1 }).legajo;  
    //TODO: esta bien en el controller
    const ultimoLegajo = await getUltimoLegajo();

    const response = await updateAlumno("legajo", ultimoLegajo + 1, alumnoDB.dni);

    return response;
}

/**
 * modulo que agrupa las últimas dos responsabilidades de la transacción
 * registra los datos del responsable y actualiza el estado de inscripción del alumno a Inscripto
 * @param {*} responsable 
 * @returns response 
 */
const regRespYActAlumno = async (responsable, dniAlumno) => {

    //TODO:ver la response
    const responsableDB = await createResponsable(responsable);

    const response = await updateAlumno("estadoInscripcion", "Inscripto", dniAlumno);

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
    regRespYActAlumno,
    reinscribirAlumno
}