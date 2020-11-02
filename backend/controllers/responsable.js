'use strict'

let Responsable = require('../models/persona.model');






const getResponsableAlumno = async (oid) => {
//Este es usado por la transacción Consultar Información Alumno y devuelve el responsable del alumno
    const personaDB = await Responsable.findById(oid);

    return personaDB
}
module.exports = {
    getResponsableAlumno

}