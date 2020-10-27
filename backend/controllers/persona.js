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

/*
 * Metodo que asocia el nuevo rol de la persona, segun el nombre del mismo y datos que se reciben por parámetro
 * Retorna la persona luego de modificarse.
 */
const asociarRol = async (nombreRol, datosRol, dniPersona) => {
    let response = false;

    var $set = { $set: {} };
    $set.$set[nombreRol] = datosRol;

    const resUpdate = await Persona.updateOne({ dni: dniPersona }, $set);

    if (resUpdate.n === 1) {
        response = await getPersonaById(dni);
    };

    return response;
}

module.exports = {
    createPersona,
    getPersonaById,
    getAllPersonas,
    updatePersona,
    asociarRol
}