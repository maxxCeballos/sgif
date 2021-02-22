'use strict'

const Persona = require('../models/persona.model')

const getHermanoByID = async (dni) => {
    let hermano = await Persona.find({ dni: dni, hermano: { $exists: true } }).exec()

    if (hermano.length < 1) {
        return false;
    } else if (hermano.length > 1) {
        throw "Hay mas de un hermano con el mismo DNI."
    }else{        
        if(!hermano[0].hermano.hasOwnProperty("fechaNacimiento")){
            console.log("hermano no")
            return false;
        }
    }

    return hermano[0];
}

const getHermanoByOID = async (oid) => {    
    let hermano = await Persona.find({ _id: oid, hermano: { $exists: true } }).exec()    

    if (hermano.length < 1) {
        hermano = false;
    }

    return hermano[0];
}

module.exports = { getHermanoByID, getHermanoByOID }