'use strict'

let Mesa = require('../models/mesaExamen.model');

const createMesa = async (mesa) => {
    const { acta, fechaHora, aula, estado, dictado,
        preceptores,
        profesores,
        asociadas,
        resultados } = mesa;
    const esPadre = false;
    const esCompartida = false;
    const newMesa = new Mesa({
        acta,
        fechaHora,
        aula,
        estado,
        esCompartida,
        esPadre,
        dictado,
        preceptores,
        profesores,
        asociadas,
        resultados

    });
    const mesaDB = await newMesa.save();

    return mesaDB;
}

const getMesasSolicitadas = async () => {
    //Devuelve las mesas en estado solicitada
    const mesas = await Mesa.find({ "estado": "Solicitada" });
    if (mesas.length == 0) {
        throw {
            status:204,
            message:"No se encontraron mesas en estado Solicitada"
        }
    }
    return mesas
}

const getMesasCompletadas = async () => {
    //Devuelve las mesas en estado completada que no son compartidas
    let response;
    const mesas = await Mesa.find({ "estado": "Completada", "esPadre": false, "esCompartida": false });
    console.log(mesas);
    if (mesas.length == 0) {
        response = {
            message: "No se encontraron mesas en estado Completada",
            mesas: []
        }; //#TODO ver si puede hacer de otra manera
    }
    else {
        response = {
            message: "Se encontraron mesas completadas",
            mesas: mesas
        };

    }
    return response
}
const getMesasCompletadasCompartidas = async () => {
    //Devuelve las mesas en estado completada y que son padre
    const mesas = await Mesa.find({ "estado": "Completada", "esPadre": true });
    let response;
    if (mesas.length == 0) {
         response = {
            message: "No se encontraron mesas en estado Completada",
            mesas: []
        }; //#TODO ver si puede hacer de otra manera
        return response;
    } else {
         response = {
            message: "Se encontraron mesas completadas",
            mesas: mesas
        };

    }
    return response
}
const updateMesa = async (oid, update) => {

    let mesaUpdated = Mesa.findOneAndUpdate({ '_id': oid }, update, { new: true });

    return mesaUpdated;
}

const getUltimaActa = async () => {
    //Devuelve las mesas completadas en orden decreciente segun el numero de acta
    let mesas, response;

    mesas = await Mesa.find({ "estado": "Completada" }).sort({ "acta": -1 }).limit(1);
    if (mesas.length == 0) {
        //Hay que buscar las que estan cerradas
        mesas = await Mesa.find({ "estado": "Cerrada" }).sort({ "acta": -1 }).limit(1);

    }
    if (mesas.length == 0) {
        response = 1;
        return response;
    } else {
        response = mesas[0].acta;
    }
    return response
}

module.exports = {
    createMesa,
    getMesasSolicitadas,
    getMesasCompletadas,
    getMesasCompletadasCompartidas,
    getUltimaActa,
    updateMesa

}