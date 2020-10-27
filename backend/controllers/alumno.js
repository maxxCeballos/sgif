'use strict'

let Alumno = require('../models/alumno.model');


const createAlumno = async (alumno) => {

    const { dni, tipoDni, nombre, apellido, genero,
        fechaNacimiento, legajo, fechaIngreso, nombreEscuelaAnt,
        sacramento,
        estadoInscripcion,
        anioCorrespondiente,
        observaciones,
        calificaciones,
        presentismos,
        responsable,
        padres,
    } = alumno;

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
         fechaNacimiento,
         legajo,
         fechaIngreso,
         nombreEscuelaAnt,
         sacramento,
        estadoInscripcion,
        anioCorrespondiente,
        observaciones,
        calificaciones,
        presentismos,
        responsable,
        padres
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

const updateAlumno = async (alumno) => {

    //const { dni, nombre, apellido } = alumno

    const response = await Alumno.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}
const updateAlumno2 = async (oid, update) => {

    const alumnoUpdated = Alumno.findByIdAndUpdate(oid, update);

    return alumnoUpdated;
}

const deleteAlumno = async (dni) => {

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

const getAlumnoConsultarInfo = async (dni) => {

    const alumnoDB = await Alumno.find({ dni: dni }).exec();

    return alumnoDB
}


module.exports = {
    createAlumno,
    updateAlumno,
    updateAlumno2,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    getAlumnoConsultarInfo,

}