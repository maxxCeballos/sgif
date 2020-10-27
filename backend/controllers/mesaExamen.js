'use strict'

let MesaExamen = require('../models/mesaExamen.model');

const createMesaExamen = () => {


}

const updateMesaExamen = () => {

}


const deleteMesaExamen = () => {


}


const getMesaExamenByOid = async (oidMesa) => {
    const mesaDB = await MesaExamen.findById(oidMesa).exec();

    return mesaDB
}

const getMesaExamenByDictado = async (oidDictado) => {
    const mesaDB = await MesaExamen.find({ dictado: oidDictado }).exec();

    return mesaDB
}

const addResultadoMesa = async (oidMesa, oidResultadoMesa) => {
    const mesaDB = (await getMesaExamenByOid(dni))[0];

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
    getMesaExamenByDictado,
    addResultadoMesa,
}