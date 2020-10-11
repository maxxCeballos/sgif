'use strict'

let Dictado = require('../models/dictado.model');

const getDictadoByOid = (oidDictado) => {
    //FIXME: ver como se buscaria por oid

    const dictadoDB = await Dictado.find({ dni: dni }).exec();

    return dictadoDB
}



module.exports = {
    getDictadoByOid,
}