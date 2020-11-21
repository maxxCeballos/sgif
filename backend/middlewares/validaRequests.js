'use strict'

const vDni = (req, res, next) => {
    //Al no haber formato se verifica que al menos sea un nro.

    let dni = req.params.dni;
    console.log(dni)
    if (isNaN(parseInt(dni)) || dni === undefined) {
        throw "DNI inválido";
    }
    next();
}

module.exports = { vDni }