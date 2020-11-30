'use strict'

let MesaExamen = require('../../backend/models/mesaExamen.model');

const createMesaExamen = async (mesaExamen) => {
    const {
        acta,
        fechaHora,
        aula,
        estado,
        dictado,
        resultados,
        esCompartida,
        esPadre,
        asociadas,
    } = mesaExamen;

    const newMesaExamen = new MesaExamen({
        acta,
        fechaHora,
        aula,
        estado,
        dictado,
        resultados,
        esCompartida,
        esPadre,
        asociadas,
    });

    const mesaExamenDB = await newMesaExamen.save();

    return mesaExamenDB;
}

const getMesaExamen = async (acta) => {
    return await MesaExamen.findOne({ acta }).exec();
}

const deleteMesaExamen = async (acta) => {
    return await MesaExamen.deleteOne({ acta }).exec();
}

module.exports = {
    createMesaExamen,
    getMesaExamen,
    deleteMesaExamen,
}