'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (persona) => {
    const { nombre, apellido, dni, sexo, responsable, hermano, padre, preceptor, profesor, alumno } = persona;

    const newPersona = new Persona({
        nombre,
        apellido,
        dni,
        sexo,
        responsable,
        hermano,
        padre,
        preceptor,
        profesor,
        alumno
    });


    const personaDB = await newPersona.save()

    return personaDB;
}

const getPersona = async (oid) => {

    const personaDB = await Persona.findById(oid);

    return personaDB
}


const getResponsableAlumno = async (oid) => {
//Este es usado por la transacción Consultar Información Alumno
    const personaDB = await Persona.findById(oid);

    return personaDB
}
module.exports = {
    createPersona,
    getPersona,
    getResponsableAlumno

}