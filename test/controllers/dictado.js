'use strict'

let Dictado = require('../../backend/models/dictado.model');

const createDictado = async (dictado) => {
    const {
        cicloLectivo,
        materia
    } = dictado;

    const newDictado = new Dictado({
        cicloLectivo,
        materia
    });

    const dictadoDB = await newDictado.save();

    return dictadoDB;
}

const deleteDictado = async (oidDictado) => {
    return await Dictado.deleteOne({ _id: oidDictado }).exec();
}

module.exports = {
    createDictado,
    deleteDictado
}