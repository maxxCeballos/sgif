'use strict'

const Persona = require('../models/persona.model');

const getPreceptores = async () => {

    let response = {};
    response.ok = true;

    const preceptoresDB = await Persona.find({ "preceptor": { $exists: true, $ne: null } })

    
    if ( preceptoresDB.length === 0 ) {
        response.ok = false;
        response.message = "No hay preceptores disponibles";
        return response;
    }
    
    response.preceptores = preceptoresDB;

    return response;

}

module.exports = {
    getPreceptores,
}
