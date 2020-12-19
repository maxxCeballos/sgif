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

//Controllers yaupe


const getDictado = async (oid) => {
    
    const dictadoDB = await Dictado.findById(oid);
    
    return dictadoDB
}

const createDictado = async (dictado) => {
    const { cicloLectivo, programa, profesor, horarios, materia } = dictado;

    const newDictado = new Dictado({
        cicloLectivo,
        programa,
        profesor,
        horarios,
        materia
    });


    const dictadoDB = await newDictado.save()

    return dictadoDB;
}

module.exports = {
    createDictado,
    getDictadoByOid,
    getDictadoByParams,
    getDictado
}