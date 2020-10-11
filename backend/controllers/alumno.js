'use strict'

let Alumno = require('../models/alumno.model');

const createAlumno = async (alumno) => {

    const { dni, tipoDni, nombre, apellido, genero } = alumno;
    // , fechaNacimiento, legajo, fechaIngreso, fechaEgreso, nombreEscuelaAnt, foto,
    //     sacramento,
    //     estadoInscripcion,
    //     anioCorrespondiente,
    //     observaciones,existeexiste
    //     sanciones,
    //     presentismos,
    //     calificaciones,
    //     idHermanos,
    //     idPadres} = alumno;

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        // fechaNacimiento,
        // legajo,
        // fechaIngreso,
        // fechaEgreso,
        // nombreEscuelaAnt,
        // foto,
        // sacramento,
        // estadoInscripcion,
        // anioCorrespondiente,
        // observaciones,
        // sanciones,
        // presentismos,
        // calificaciones,
        // idHermanos,
        // idPadres
    });

    const alumnoDB = await newAlumno.save()

    return alumnoDB;

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

const updateAlumno = async (alumno) => {

    const { dni, nombre, apellido } = alumno

    const response = await Alumno.updateOne({ dni: dni}, { 
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteAlumno = async (dni) => {

    await Alumno.deleteOne({ dni : dni }).exec();

    return true;
}

module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    getAlumnoByLegajo,
}