'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (persona) => {
    const { nombre, apellido, dni, sexo } = persona;

    let newPersona = new Persona({
        nombre,
        apellido,
        dni,
        sexo
    });

    const personaDB = await newPersona.save();

    return personaDB;
}

const getPersonaById = async (dni) => {
    const personaDB = await Persona.find({ dni: dni }).exec();

    return personaDB;
}

const getAllPersonas = async () => {
    const personasDB = await Persona.find().exec();

    return personasDB;
}

const updatePersona = async (persona) => {
    const { dni, nombre, apellido, } = persona;

    const response = await Persona.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false
}

//TODO: pongo un update generico aca y que se asocie el nuevo rol. asociarRol (nombre,datosRol)
const asociarRol = async (nombreRol, datosRol, dniPersona) => {

    var $set = { $set: {} };
    $set.$set[nombreRol] = datosRol;
    const response = await Persona.updateOne({ dni: dniPersona }, $set);

    if (response.n === 1) return true

    return false
}

module.exports = {
    createPersona,
    getPersonaById,
    getAllPersonas,
    updatePersona,
    asociarRol
}