'use strict'

let Alumno = require('../models/alumno.model');
const { trace } = require('../routes/alumno');


const createAlumno = async (alumno) => {

    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        fechaIngreso, fechaEgreso, nombreEscuelaAnt, foto, sacramento,
        estadoInscripcion, anioCorrespondiente, observaciones, sanciones, presentismos,
        calificaciones, idHermanos, idPadres } = alumno;

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        fechaNacimiento,
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
        idHermanos,
        idPadres
    });

    const alumnoDB = await newAlumno.save()

    return alumnoDB;
}


const getAlumnoById = async (dni) => {

    const alumnoDB = await Alumno.find({ dni: dni }).exec();    

    return alumnoDB
}

const getAllAlumnos = async () => {

    const alumnosDB = await Alumno.find().exec();

    return alumnosDB;
}

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

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

const getUltimoLegajo = async () =>{
    const response = await Alumno.find().sort({ legajo: -1 }).legajo;

    return response;
}



module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    getUltimoLegajo
}