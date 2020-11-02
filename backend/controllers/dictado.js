'use strict'

let Dictado = require('../models/dictado.model');

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

const getDictado = async (oid) => {
    
    const dictadoDB = await Dictado.findById(oid);
    
    return dictadoDB
}
module.exports = {
    createDictado,
    getDictado
    
}