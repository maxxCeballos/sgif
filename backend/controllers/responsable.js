'use strict'

let Persona = require('../models/persona.model');
const { getPersonaById, createPersona, asociarRol, getAllPersonas } = require('./persona');

const createResponsable = async (datosResponsable) => {

    const { nombre, apellido, dni, sexo, legajo, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia } = datosResponsable;

    const persona = { nombre, apellido, dni, sexo };

    //TODO: generarle legajo.
    const responsable = {
        legajo, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia
    }    

    let response;

    //console.log(responsable);
    //console.log(persona);

    //verifico si la persona existe    
    let personaDB = await getPersonaById(dni);

    //TODO: mejorar, ver consultas en drive
    if (personaDB.length > 1) {
        //si hay mas de 1 error
        response= {message: "Mas de una persona con el mismo dni"};

    } else if (personaDB.length === 0) {
        personaDB = await createPersona(persona);
    }

    //si existe o no la persona
    response = await asociarRol("responsable", responsable, dni);

    return response;
}

const getResponsableById = async (dni) => {

    //TODO: ver es middle man
    const responsableDB = await getPersonaById(dni);

    return responsableDB
}

const getAllResponsables = async () => {
    //TODO: para los otros ver si llevar a persona o que cada uno redefina

    let responsablesDB=[];
    let j=0;    
    const personasDB = await getAllPersonas();  

    for (let i = 0; i < personasDB.length; i++) {  
        //FIXME: no encontre como hacerlo sin el stringify                      
        if (JSON.parse(JSON.stringify(personasDB[i])).hasOwnProperty('responsable')) {            
            responsablesDB[j] = personasDB[i];
            j++;
        }
    }
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