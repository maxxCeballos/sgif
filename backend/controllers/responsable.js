'use strict'

let Responsable = require('../models/responsable.model');


const createResponsable = async (responsable) => {

    const { nombre, apellido, dni, sexo, cuit, telefono, email, calle, altura,
        barrio, piso, depto, tira, modelo, localidad, cp, provincia, dniAlumno } = responsable;

    const newResponsable = new Responsable({
        nombre, apellido, dni, sexo, cuit, telefono, email, calle, altura,
        barrio, piso, depto, tira, modelo, localidad, cp, provincia
    });

    const responsableDB = await newResponsable.save()

    //se actualiza el estado del alumno
    await Alumno.updateOne({ dni: dni }, {
        estadoInscripcion: "Inscripto"
    })

    return responsableDB;

}

const getResponsableById = async (dni) => {

    const responsableDB = await Responsable.find({ dni: dni }).exec();

    return responsableDB
}

const getAllResponsables = async () => {

    const responsablesDB = await Responsable.find().exec();

    return responsablesDB;
}

const updateResponsable = async (responsable) => {

    const { dni, nombre, apellido } = responsable

    const response = await Responsable.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteResponsable = async (dni) => {

    await Responsable.deleteOne({ dni: dni }).exec();

    return true;
}



module.exports = {
    createResponsable,
    updateResponsable,
    deleteResponsable,
    getAllResponsables,
    getResponsableById,
}