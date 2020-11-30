'use strict'

let MesaExamen = require('../models/mesaExamen.model');

const createMesaExamen = async (mesaExamen) => {
    const {
        acta,
        estado,
        dictado,
        resultados,
        esCompartida,
    } = mesaExamen;

    const newMesaExamen = new MesaExamen({
        acta,
        estado,
        dictado,
        resultados,
        esCompartida,
    });

    const mesaExamenDB = await newMesaExamen.save();

    return mesaExamenDB;
}

const updateMesaExamen = async (oidMesa, atributo, valor) => {
    var $set = { $set: {} };
    $set.$set[atributo] = valor;

    const response = await MesaExamen.updateOne({ _id: oidMesa }, $set);

    if (response.n === 1) return true

    return false
}


const deleteMesaExamen = () => {


}

const getMesaExamenByOid = async (oidMesa) => {
    const mesaDB = await MesaExamen.findById(oidMesa).exec();

    return mesaDB
}

const getMesaExamenByActa = async (acta) => {
    const mesaDB = await MesaExamen.find({ acta }).exec();

    return mesaDB
}

/**
 * Busca una mesa de examen para el dictado que no este cerrada
 */
const getMesaExamenByDictado = async (oidDictado) => {
    const mesasEncontradas = await MesaExamen.find({ dictado: oidDictado }).exec();

    const mesaDB = mesasEncontradas.find(mesa => mesa.estado !== "Cerrada");

    return mesaDB
}

const getAllMesasExamen = async () => {
    const mesasDB = await MesaExamen.find().exec();

    return mesasDB;
}

const addResultadoMesa = async (oidMesa, oidResultadoMesa) => {
    const mesaDB = await getMesaExamenByOid(oidMesa);

    let resultados = [];
    if (mesaDB.resultados) {
        resultados = [
            ...mesaDB.resultados,
        ];
    }
    resultados.push(oidResultadoMesa);

    const response = await MesaExamen.updateOne({ _id: oidMesa }, { resultados });

    if (response.n === 1) return true

    return false
}


module.exports = {
    createMesaExamen,
    updateMesaExamen,
    deleteMesaExamen,
    getMesaExamenByOid,
    getMesaExamenByActa,
    getMesaExamenByDictado,
    addResultadoMesa,
    getAllMesasExamen,
}