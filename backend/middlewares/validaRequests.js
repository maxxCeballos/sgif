'use strict'

const BadRequest = require("./errores");

const vDni = (req, res, next) => {
    //Al no haber formato se verifica que al menos sea un nro.

    let dni = req.params.dni;    
    if (isNaN(parseInt(dni)) || dni === undefined) {
        throw new BadRequest("DNI inválido");
    }
    next();
}

module.exports = { vDni }