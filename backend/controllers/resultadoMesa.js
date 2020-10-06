'use strict'

let ResultadoMesa = require('../models/resultadoMesa.model');

const createResultadoMesa = async (resultadoMesa) => {

    const {
        alumno,
        mesaDeExamen,
        legajo,
        nombre,
        apellido,
        nota,
        condicion
    } = resultadoMesa;

    const newResultadoMesa = new ResultadoMesa({
        alumno,
        mesaDeExamen,
        legajo,
        nombre,
        apellido,
        nota,
        condicion
    });

    const resultadoMesaDB = await newResultadoMesa.save()

    return resultadoMesaDB;
}


const getResultadoMesaById = async (dni) => {

    const resultadoMesaDB = await ResultadoMesa.find({ dni: dni }).exec();

    return resultadoMesaDB
}

const getAllResultadoMesas = async () => {

    const resultadoMesasDB = await ResultadoMesa.find().exec();

    return resultadoMesasDB;
}

const updateResultadoMesa = async (resultadoMesa) => {

    const { dni, nombre, apellido } = resultadoMesa

    const response = await ResultadoMesa.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteResultadoMesa = async (dni) => {

    await ResultadoMesa.deleteOne({ dni: dni }).exec();

    return true;
}

module.exports = {
    createResultadoMesa,
    updateResultadoMesa,
    deleteResultadoMesa,
    getAllResultadoMesas,
    getResultadoMesaById,
}