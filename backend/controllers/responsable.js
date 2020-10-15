'use strict'

let Persona = require('../models/persona.model');
const { getPersonaById, createPersona, asociarRol } = require('./persona');

const createResponsable = async (datosResponsable) => {

    const { nombre, apellido, dni, sexo, legajo, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia } = datosRsponsable;

    const persona = { nombre, apellido, dni, sexo };
    const responsable = {
        legajo, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia
    }

    //verifico si la persona existe
    //TODO: es var, let, o sin nada?
    personaDB = await getPersonaById(dni);

    //TODO: mejorar, ver consultas en drive
    if (personaDB.n > 1) {
        //si hay mas de 1 error
        return //TODO poner mensaje? o que va?

    } else if (personaDB.n === 0) {
        personaDB = createPersona(persona);
    }

    //si existe o no
    response = await asociarRol("responsable", responsable, dni);

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