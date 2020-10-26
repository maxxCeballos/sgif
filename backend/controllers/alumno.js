'use strict'

let Alumno = require('../models/alumno.model');
const { getPersonaById, createPersona, asociarRol } = require('./persona');

const createAlumno = async (alumno, legajo, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        fechaEgreso, nombreEscuelaAnt, foto, sacramento,
        estadoInscripcion, anioCorrespondiente, observaciones, sanciones, presentismos,
        calificaciones, hermanos, padres } = alumno;

    //TODO: evitar alumno vacio y alumno replicado    

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        fechaNacimiento,
        legajo,
        fechaIngreso: new Date().toISOString(),
        fechaEgreso,
        nombreEscuelaAnt,
        foto,
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
    });

    const alumnoDB = await newAlumno.save()

    //creacion/asociacion de rol alumno a persona
    let personaDB = await getPersonaById(dni);
    if (personaDB.length === 0) {
        personaDB = createPersona({
            nombre, apellido, dni, sexo: genero
        });
    }

    //TODO: ver response para devolver el alumno despues del update
    const response = await asociarRol("alumno", alumnoDB._id, dni);

    return response;
}


const getAlumnoById = async (dni) => {
    //FIXME: ver si cambiar nombre a ...ByDni porq id puede ser OID

    const alumnoDB = await Alumno.find({ dni: dni }).exec();

    return alumnoDB
}

const getAlumnoByLegajo = async (legajo) => {

    const alumnoDB = await Alumno.find({ legajo: legajo }).exec();

    return alumnoDB
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

    //const { dni, nombre, apellido } = alumno    

    //TODO: refactorizar
    var $set = { $set: {} };
    $set.$set[atributo] = valor;

    const response = await Alumno.updateOne({ dni: dni }, $set);

    if (response.n === 1) return true

    return false
}

const deleteAlumno = async (dni) => {
    //TODO: tiene que borrarlo de la persona tambien

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

const generarLegajo = async () => {
    const response = await Alumno.find().select('legajo -_id').sort({ legajo: -1 }).exec();

    return parseInt(response[0].legajo) + 1;
}

const addCalificacion = async (calificacion, dni) => {
    const alumnoDB = (await getAlumnoById(dni))[0];

    let calificaciones = [];
    if (alumnoDB.calificaciones) {
        calificaciones = [
            ...alumnoDB.calificaciones,
        ];
    }
    calificaciones.push(calificacion);

    const response = await Alumno.updateOne({ dni: dni }, { calificaciones });

    if (response.n === 1) return true

    return false
}


module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    getAlumnoByLegajo,
    generarLegajo,
    addCalificacion,
}