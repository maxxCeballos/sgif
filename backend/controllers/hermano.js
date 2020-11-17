'use strict'

const Persona = require('../models/persona.model')

const getHermanoById = async (dni) => {
    const hermanoBD = await Persona.find({ dni: dni }).exec();
    let hermano = false;

    if (hermanoBD.length === 1){
        hermano = hermanoBD[0];
    }else if (hermanoBD.length>0){
        throw "Existe mas de un hermano con el mismo DNI";
    }

    return hermano;
}

const getHermanoByOID = async (oid) => {
    let hermano;

    hermano = await Persona.findById(oid).exec();

    if (hermano === null) {
        hermano = false;
    }

    return hermano;
}



module.exports = { getHermanoById, getHermanoByOID }