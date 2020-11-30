'use strict'

const Persona = require("../models/persona.model");

const getPadreByID = async (dni) => {
    let padre = await Persona.find({ dni: dni, padre: { $exists: true } }).exec()

    if (padre.length < 1) {
        return false;
    } else if (padre.length > 1) {
        throw "Hay mas de un padre con el mismo DNI."
    }

    return padre[0];
}

const getPadreByOID = async (oid) => {
    let padre = await Persona.find({ _id: oid, padre: { $exists: true } }).exec();

    if (padre.length < 1) {
        padre = false;
    }

    return padre[0];
}

module.exports = {
    getPadreByID,
    getPadreByOID,    
}