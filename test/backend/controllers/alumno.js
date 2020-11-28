'use strict';

let Alumno = require('../../../backend/models/alumno.model');

const createAlumno = async (alumno) => {
    const {
        dni,
        tipoDni,
        nombre,
        apellido,
        legajo,
        calificaciones,
    } = alumno;

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        legajo,
        calificaciones,
    });
    
    try {
        const alumnoDB = await newAlumno.save();

        return alumnoDB;
    } catch (error) {
        return error;
    }
}

const getAlumno = async (dni) => {
    return await Alumno.findOne({ dni }).exec();
}

const deleteAlumno = async (dni) => {
    return await Alumno.deleteOne({ dni }).exec();
}

module.exports = {
    createAlumno,
    getAlumno,
    deleteAlumno
}