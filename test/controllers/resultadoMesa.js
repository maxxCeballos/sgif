'use strict'

let ResultadoMesa = require('../../backend/models/resultadoMesa.model');

const createResultadoMesa = async (resultadoMesa) => {
    const {
        alumno,
        mesaDeExamen,
        nota,
        condicion
    } = resultadoMesa;

    const newResultadoMesa = new ResultadoMesa({
        alumno,
        mesaDeExamen,
        nota,
        condicion
    });

    const resultadoMesaDB = await newResultadoMesa.save()

    return resultadoMesaDB;
}

const getResultadoMesa = async (oidResultado) => {
    return await ResultadoMesa.findOne({ _id: oidResultado }).exec();
}

const updateResultadoMesa = async (oidResultado, newResultado) => {
    let response = await ResultadoMesa.updateOne(
        { _id: oidResultado },
        newResultado
    ).exec();

    return response;
}

const deleteResultadoMesa = async (oidResultado) => {
    return await ResultadoMesa.deleteOne({ _id: oidResultado }).exec();
}

module.exports = {
    createResultadoMesa,
    getResultadoMesa,
    updateResultadoMesa,
    deleteResultadoMesa,
}