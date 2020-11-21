'use strict'

const { getPersonaById, getPersonaByOID } = require("./persona");

const getPadreByID = async (dni) => {    
    const personaDB = await getPersonaById(dni);    

    if (personaDB !== false && esPadre(personaDB)) {
        return personaDB;
    }
    return false;
}

const getPadreByOID = async (oid) => {    
    const personaDB = await getPersonaByOID(oid);    

    if (personaDB !== false && esPadre(personaDB)) {
        return personaDB;
    }
    return false;
}

const esPadre = (personaObj) => {
    return JSON.parse(JSON.stringify(personaObj)).hasOwnProperty('padre');
}

module.exports = {    
    getPadreByID,
    getPadreByOID
}