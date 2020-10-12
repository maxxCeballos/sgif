'use strict'

let Alumno = require('../models/alumno.model');
const { trace } = require('../routes/alumno');


const createAlumno = async (alumno) => {

    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        fechaIngreso, fechaEgreso, nombreEscuelaAnt, foto, sacramento,
        estadoInscripcion, anioCorrespondiente, observaciones, sanciones, presentismos,
        calificaciones, idHermanos, idPadres } = alumno;

    const ultimoLegajo = db.find(); //TODO: Buscar legajo mas grande

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        fechaNacimiento,
        legajo: ultimoLegajo,
        fechaIngreso,
        fechaEgreso,
        nombreEscuelaAnt,
        foto,
        sacramento,
        estadoInscripcion,
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
    let response = { alumnoDB };

    if (alumnoDB.n === 1) {
        if (alumnoDB.estadoInscripcion == "Reinscripto") {
            response = { message: "El alumno ya esta Reinscripto" }
        }
    } else {
        response = { message: "El alumno no existe, puede inscribir" }
    }

    return response
}

const getAllAlumnos = async () => {

    const alumnosDB = await Alumno.find().exec();

    return alumnosDB;
}

const updateAlumno = async (atributo,valor) => {

    //const { dni, nombre, apellido } = alumno    

    const response = await Alumno.updateOne({ dni: dni }, {
        `${atributo}`: atributo, //FIXME: arreglar atributo
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteAlumno = async (dni) => {

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}



module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
}