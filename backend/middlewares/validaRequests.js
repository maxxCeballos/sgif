'use strict'

const { BadRequest } = require("./errores");
var mongoose = require('mongoose');

const vDni = (req, res, next) => {
    //Al no haber formato se verifica que al menos sea un nro.

    let dni = req.params.dni;
    if (isNaN(parseInt(dni)) || dni === undefined) {
        throw new BadRequest("DNI inválido");
    }
    next();
}

const vOID = (req, res, next) => {

    let oidAlumno = req.params.oid;
    if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Inválido");
    }
    next();
}

module.exports = { vDni, vOID }