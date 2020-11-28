'use strict'

const { createAlumno, getAlumnoById, getAlumnoByOID, generarLegajoAl, updateAlumnoOID } = require('./alumno');
const { getCicloLectivo } = require('./ciclo-lectivo');
const { createPersona, getPersonaByOID, asociarRolOID } = require('./persona');
const { getResponsableByOID, generarLegajoResp } = require('./responsable');

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
                operacion: "Reinscribir",
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

const createResponsableNuevo = async (datosResponsable) => {

    const { nombre, apellido, dni, genero, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia } = datosResponsable;

    const persona = { nombre, apellido, dni, genero };

    const responsable = {
        legajo: await generarLegajoResp(),
        cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia
    }

    const responsableDB = await createPersona(persona, 'responsable', responsable);
    //TODO: controlar cuando no puede crear la persona

    return responsableDB;
}

const createResponsableRol = async (datosResponsable, oidPersona) => {
    let response;

    let personaDB = await getPersonaByOID(oidPersona);
    if (!personaDB) {
        throw "El OID recibido no corresponde a una persona, envíelo nuevamente."
    }

    datosResponsable.legajo = await generarLegajoResp();
    const responsable = await asociarRolOID('responsable', datosResponsable, oidPersona);
    if (responsable !== false) {
        response = responsable;
    } else {
        throw "No se pudo asociar el rol de responsable a la persona";
    }

    return response;
}

/**
 * metodo que captura las responsabilidades de generar el legajo y registrar el alumno
 * asociando su responsable y su nuevo estado de inscripción.
 * @param {*} alumno 
 */
const registrarAlumnoNuevo = async (datosAlumno, oidResponsable) => {
    const { nombre, apellido, dni, genero } = datosAlumno;
    const datosPersona = { nombre, apellido, dni, genero }

    if (!await getResponsableByOID(oidResponsable)) {
        throw "OID responsable inválido"
    }

    datosAlumno.legajo = await generarLegajoAl();
    const alumnoNuevo = await createAlumno(datosAlumno, oidResponsable);

    let response = { exito: false, alumno: false };
    if (alumnoNuevo.exito) {
        const alumnoPersona = await createPersona(datosPersona, 'alumno', alumnoNuevo.alumno._id)
        //TODO: controlar cuando no puede crear la persona

        response.exito = true;
        response.alumno = await updateAlumnoOID("estadoInscripcion", "Inscripto", alumnoNuevo.alumno._id);
    } else {
        //TODO: refactor, para cuando se ponga throw en createAlumno
        //TODO: eliminar responsable si lo creo
        response.exito = false;
        response.alumno = alumnoDB;
    }
    return response;
}

//busca la persona con oid, crea el alumno (con los datos de la persona), asocia
const registrarAlumnoRol = async (datosAlumno, oidPersona, oidResponsable) => {
    let datosPersona;

    const persona = await getPersonaByOID(oidPersona);
    if (!persona) {
        throw "OID persona inválido"
    } else {
        datosPersona = {
            dni: persona.dni,
            nombre: persona.nombre,
            apellido: persona.apellido,
            genero: persona.genero
        }
    }

    if (!await getResponsableByOID(oidResponsable)) {
        throw "OID responsable inválido"
    }

    datosAlumno.legajo = await generarLegajoAl();
    Object.assign(datosAlumno, datosPersona); //agrego los datos de la persona al alumno    
    const alumnoNuevo = await createAlumno(datosAlumno, oidResponsable);

    let response = { exito: false, alumno: false };
    if (alumnoNuevo.exito) {
        const alumnoPersona = await asociarRolOID('alumno', alumnoNuevo.alumno._id, oidPersona)
        if (alumnoPersona !== false) {
            response.exito = true;
            response.alumno = await updateAlumnoOID("estadoInscripcion", "Inscripto", alumnoNuevo.alumno._id);
        } else {
            //TODO: eliminar alumno creado            
        }
    } else {
        //TODO: refactor, para cuando se ponga throw en createAlumno
        //TODO: eliminar responsable si lo creo
        response = alumnoDB;
    }
    return response;
}

/**
 * modulo que se encarga de hacer la reinscripción del alumno
 * actualiza el año al que se va a reinscribir y el estado de inscripcion
 * @param {*} anioReinscripcion 
 * @param {*} oidAlumno 
 */
const reinscribirAlumno = async (anioReinscripcion, oidAlumno) => {

    if (!await getAlumnoByOID(oidAlumno)) {
        throw "El OID recibido no corresponde a un alumno, envíelo nuevamente."
    }

    const response1 = await updateAlumnoOID("anioCorrespondiente", anioReinscripcion, oidAlumno);

    //TODO: verificar que este "no inscripto" con validar alumno

    const response2 = await updateAlumnoOID("estadoInscripcion", "Reinscripto", oidAlumno);

    return response1 && response2;
}

module.exports = {
    validarFechaInscripcion,
    validarAlumno,
    registrarAlumnoNuevo,
    registrarAlumnoRol,
    createResponsableNuevo,
    createResponsableRol,
    reinscribirAlumno
}