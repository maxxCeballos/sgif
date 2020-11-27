'use strict';

let Alumno = require('../../../backend/models/alumno.model');

const createAlumno = async (alumno) => {
    const {
        dni,
        tipoDni,
        nombre,
        apellido,
        legajo,
    } = alumno;


    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        legajo,
    });

    try {
        const alumnoDB = await newAlumno.save();

        return alumnoDB;
    } catch (error) {
        console.log("error")
        return error;
    }
}

const getAlumno = async (oidAlumno) => {
    return await Alumno.findById(oidAlumno).exec();
}

const deleteAlumno = async (oidAlumno) => {
    return await Alumno.deleteOne({ _id: oidAlumno }).exec();
}

module.exports = {
    createAlumno,
    getAlumno,
    deleteAlumno
}