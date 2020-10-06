'use strict'

let Alumno=require('../models/alumno.model');


const createAlumno = async (alumno) => {

    // const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento, legajo, fechaIngreso, fechaEgreso, nombreEscuelaAnt, foto,
    //     sacramento,
    //     estadoInscripcion,
    //     anioCorrespondiente,
    //     observaciones,
    //     sanciones,
    //     presentismos,
    //     calificaciones,
    //     idHermanos,
    //     idPadres} = alumno;

    const newAlumno = new Alumno({
        dni: "35109970",
        tipoDni: "dni",
        nombre: "Maximiliano",
        apellido: "Ceballos",
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

const updateAlumno = () => {


}


const deleteAlumno = () => {


}

const getAlumno = () => {

}






module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAlumno,
}