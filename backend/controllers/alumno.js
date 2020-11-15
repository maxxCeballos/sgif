'use strict'

const { response } = require('express');
let Alumno = require('../models/alumno.model');
<<<<<<< HEAD
const { getPersonaById, createPersona, asociarRol} = require('./persona');

const createAlumno = async (alumno, legajo, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        fechaEgreso, nombreEscuelaAnt, foto, sacramento,
        estadoInscripcion, anioCorrespondiente, observaciones, sanciones, presentismos,
        calificaciones, hermanos, padres } = alumno;

    //TODO: evitar alumno vacio y alumno replicado    
=======
const { getPersonaById, createPersona, asociarRol } = require('./persona');
const { getResponsableByOID } = require('./responsable');

const createAlumno = async (alumno, legajo, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        lugarNacimiento, fechaEgreso, nombreEscuelaAnt, foto,
        sacramentos, anioCorrespondiente } = alumno;

    let response;

    //FIXME: refactor, poner required en bd    
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

    //verifico que el oid recibido sea válido.
    if(!getResponsableByOID(oidResponsable)){
        return {
            exito: false,
            message: "OID responsable inválido."
        }
    }

    //TODO: verificar que la persona no sea un alumno ya
>>>>>>> transacciones-gaston

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        fechaNacimiento,
<<<<<<< HEAD
=======
        lugarNacimiento,
>>>>>>> transacciones-gaston
        legajo,
        fechaIngreso: new Date().toISOString(),
        fechaEgreso,
        nombreEscuelaAnt,
        foto,
<<<<<<< HEAD
        sacramento,
        estadoInscripcion, //FIXME: para pruebas zafa, pero hay que sacarlo        
        anioCorrespondiente,
        observaciones,
        sanciones,
        presentismos,
        calificaciones,
        responsable: oidResponsable,
        hermanos,
        padres
=======
        sacramentos, //TODO: revisar que este bien armado
        //estadoInscripcion, se completa mas adelante
        anioCorrespondiente,
        responsable: oidResponsable
>>>>>>> transacciones-gaston
    });

    const alumnoDB = await newAlumno.save()

    //creacion/asociacion de rol alumno a persona
    let personaDB = await getPersonaById(dni);
<<<<<<< HEAD
    if (personaDB.length === 0) {
=======
    if (personaDB === false) {
>>>>>>> transacciones-gaston
        personaDB = createPersona({
            nombre, apellido, dni, sexo: genero
        });
    }
<<<<<<< HEAD
    
    //TODO: ver response para devolver el alumno despues del update
    const response = await asociarRol("alumno", alumnoDB._id, dni);

    return response;
=======
    response = await asociarRol("alumno", alumnoDB._id, dni);

    if (response !== false) {
        return {
            exito: true,
            alumno: alumnoDB,
        };
    } else {
        return {
            exito: false,
            message: "No se pudo asignar el rol de alumno a la persona, intentelo nuevamente."
        }
    }
>>>>>>> transacciones-gaston
}

const getAlumnoById = async (dni) => {
<<<<<<< HEAD

    const alumnoDB = await Alumno.find({ dni: dni }).exec();

    return alumnoDB
=======
    const alumnoDB = await Alumno.find({ dni: dni }).exec();
    let alumno = false;

    if (alumnoDB.length === 1) {
        alumno = alumnoDB[0];
    } else if (alumnoDB.length > 1) {
        throw "Existe mas de un alumno con el mismo DNI";
    }

    return alumno;
>>>>>>> transacciones-gaston
}

const getAllAlumnos = async () => {

    const alumnosDB = await Alumno.find().exec();

    return alumnosDB;
}

/**
 * actualiza un atributo genérico del primer alumno con el dni ingresado
 * @param {*} atributo 
 * @param {*} valor 
 * @param {*} dni 
 */
const updateAlumno = async (atributo, valor, dni) => {
<<<<<<< HEAD

    //const { dni, nombre, apellido } = alumno    

    //TODO: refactorizar
    var $set = { $set: {} };
    $set.$set[atributo] = valor;

    const response = await Alumno.updateOne({ dni: dni }, $set);

    if (response.n === 1) return true

    return false
=======
    let alumno;

    var $set = { $set: { [atributo]: valor } };

    const response = await Alumno.updateOne({ dni: dni }, $set);
    if (response.n === 1) {
        alumno = await getAlumnoById(dni);
    }

    return alumno;
>>>>>>> transacciones-gaston
}

const deleteAlumno = async (dni) => {
    //TODO: tiene que borrarlo de la persona tambien

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

<<<<<<< HEAD
const generarLegajo = async () => {
    const response = await Alumno.find().select('legajo -_id').sort({ legajo: -1 }).exec();

    return parseInt(response[0].legajo) + 1;
=======
const generarLegajo = async () => {    
    //El legajo es un string, por eso el orden desc lo hace de forma alfabetica y no de integer

    const alumnosBD = await Alumno.find().select('legajo -_id').sort({ legajo: "desc" }).exec();    
    let nuevoLegajo = parseInt(alumnosBD[0].legajo) + 1;
    if (Number.isNaN(nuevoLegajo)) {
        nuevoLegajo = 1;
    }
    return nuevoLegajo
}

/**
 * Metodo que verifica que el alumno recibido, tenga sus atributos básicos y no estén vacíos
 * @param {*} alumno recibe un alumno a inscribir, con todos los datos que se hayan recibido
 */
function tieneDatosBasicos(alumno) {
    const datosBasicos = ['dni', 'tipoDni', 'nombre', 'apellido', 'genero',
        'fechaNacimiento', 'lugarNacimiento', 'fechaEgreso', 'nombreEscuelaAnt'];

    const valido = datosBasicos.every(atributo => {
        if (!alumno.hasOwnProperty(atributo)) {
            //console.log(atributo + " No existe")
            return false;
        } else if (alumno[atributo] === "" || alumno[atributo] === null) {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });

    return valido;
>>>>>>> transacciones-gaston
}

module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    generarLegajo
}