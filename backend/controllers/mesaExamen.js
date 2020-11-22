'use strict'

let MesaExamen = require('../models/mesaExamen.model');

const createMesaExamen = () => {


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

const getMesaExamenByDictado = async (oidDictado) => {
    const mesaDB = await MesaExamen.find({ dictado: oidDictado }).exec();

    return mesaDB
}

const getAllMesasExamen = async () => {
    const mesasDB = await MesaExamen.find().exec();

    return mesasDB;
}

const addResultadoMesa = async (oidMesa, oidResultadoMesa) => {
    const mesaDB = (await getMesaExamenByOid(oidMesa))[0];

    let resultados = [];
    if (mesaDB.resultados) {
        resultados = [
            ...mesaDB.resultados,
        ];
    }
    resultados.push(oidResultadoMesa);

    const response = await Alumno.updateOne({ _id: oidMesa }, { resultados });

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