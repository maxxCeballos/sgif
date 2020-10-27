'use strict'

let Dictado = require('../models/dictado.model');

const getDictadoByOid = async (oidDictado) => {
    const dictadoDB = await Dictado.findById(oidDictado).exec();

    return dictadoDB;
}

/**
 * Busca un dictado segun valores de sus campos
 * 
 * @param {*} valoresDictado incluye los valores de {nombreMateria, anioMateria, cicloLectivo}
 */
const getDictadoByParams = async (valoresDictado) => {
    const materia = {
        nombre: valoresDictado.nombreMateria,
        anio: valoresDictado.anioMateria
    };
    const dictadoDB = await Dictado.findOne({
        cicloLectivo: valoresDictado.cicloLectivo,
        materia
    }).exec();

    return dictadoDB;
}

module.exports = {
    getDictadoByOid,
    getDictadoByParams,
}