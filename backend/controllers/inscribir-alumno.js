'use strict'

const { createAlumno, getAlumnoById, updateAlumno, generarLegajo } = require('./alumno');
const { getCicloLectivo } = require('./ciclo-lectivo');
const { getResponsableByOID } = require('./responsable');

/**
 * modulo que verifica si se encuentra dentro del período de inscripción o no
 * @return retorna un mensaje que indica si la fecha es valida o no
 */
const validarFechaInscripcion = async () => {

    const cicloLectivoDB = await getCicloLectivo();

    console.log(cicloLectivoDB);

    let response;

    if (new Date().toISOString() <= cicloLectivoDB.fechaFinInscripcion.toISOString()) {
        response = {
            valido: true,
            message: "Inscripciones Abiertas"
        }
    } else {
        response = {
            valido: false,
            message: "Inscripciones Cerradas"
        }
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
    let estadoInscripcion;
    let response        

    if (alumnoDB !== false) {

        estadoInscripcion = alumnoDB.estadoInscripcion;
        if (estadoInscripcion !== "No Inscripto") {
            response = {
                valido: false,
                operacion: "Inválido",
                message: "El alumno está " + estadoInscripcion
            }
        } else {
            //TODO: verificar que no se haya egresado
            response = {
                valido: true,
                operacion: "Inscribir",
                alumnoDB
            };
        }

    } else {
        response = {
            valido: true,
            operacion: "Inscribir",
            message: "El alumno no existe, puede inscribir"
        }
    }

    return response
}

/**
 * metodo que captura las responsabilidades de generar el legajo y registrar el alumno
 * asociando su responsable y su nuevo estado de inscripción.
 * @param {*} alumno 
 */

const registrarAlumno = async (alumno, oidResponsable) => {
    //TODO: separar en varios endpoint como la creación de los padres y hermanos
    //para cuando ya existe la persona

    //FIXME: refactor a middleware, poner required en bd    
    if (!tieneDatosBasicos(alumno)) {
        return {
            exito: false,
            message: "Datos básicos incompletos, verifiquelos nuevamente."
        }
    } else if (oidResponsable === null || oidResponsable === "") {
        return {
            exito: false,
            message: "Faltó enviar OID Responsable."
        }
    }

    if(!getResponsableByOID(oidResponsable)){
        throw "OID responsable inválido"
    }

    const legajo = await generarLegajo();
    const alumnoDB = await createAlumno(alumno, legajo, oidResponsable);

    let response;    
    if (alumnoDB.exito === true) {
        response = await updateAlumno("estadoInscripcion", "Inscripto", alumnoDB._id);
    } else {
        //TODO: refactor, para cuando se ponga throw en createAlumno
        response = alumnoDB;
    }

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