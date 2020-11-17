'use strict'

const { getPersonaById, getPersonaByOID } = require("./persona");

const createPadre = async () => {
    //FIXME: resolver si la construccion queda aca o es parte de la transaccion, problema con createResponsable
}

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
    createPadre,
    getPadreByID,
    getPadreByOID
}