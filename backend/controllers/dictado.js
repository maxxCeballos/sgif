'use strict'

let Dictado = require('../models/dictado.model');

const getDictadoByOid = async (oidDictado) => {
    const dictadoDB = await Dictado.findById(oidDictado).exec();

    return dictadoDB
}

module.exports = {
    getDictadoByOid,
}