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

const updateMesaExamenDatos = async (oidMesa, newMesa) => {
    let response = await MesaExamen.updateOne(
        { _id: oidMesa },
        newMesa
    ).exec();

    return response.n === 1;
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

//Yaupe controllers

const createMesa = async (mesa) => {
    const { acta, fechaHora, aula, estado, dictado,
        preceptores,
        profesores,
        asociadas,
        resultados } = mesa;
    const esPadre = false;
    const esCompartida = false;
  
    const newMesa = new MesaExamen({
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
    const mesas = await MesaExamen.find({ "estado": "Solicitada" });
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
  
    const mesas = await MesaExamen.find({ "estado": "Completada", "esPadre": false, "esCompartida": false });
    console.log(mesas);
    if (mesas.length == 0) {
        response = {
            message: "No se encontraron mesas en estado Completada",
            mesas: []
        }; //#TODO ver si puede hacer de otra manera
    }
    else {
        response = {
            message: "Se encontraron mesas completadas que no son compartidas",
            mesas: mesas
        };

    }
    return response
}
const getMesasCompletadasCompartidas = async () => {
    //Devuelve las mesas en estado completada y que son padre

    let response;
    const mesas = await MesaExamen.find({ "estado": "Completada", "esPadre": true });
    if (mesas.length == 0) {
        response = {
            message: "No se encontraron mesas en estado Completada",
            mesas: []
        }; //#TODO ver si puede hacer de otra manera
        return response;
    } else {
        response = {
            message: "Se encontraron mesas completadas compartidas",
            mesas: mesas
        };

    }
    return response
}

const updateMesa = async (oid, update) => {

    let mesaUpdated = MesaExamen.findOneAndUpdate({ '_id': oid }, update, { new: true });

    return mesaUpdated;
}
const getUltimaActa = async () => {
    //Devuelve las mesas completadas en orden decreciente segun el numero de acta
    let mesas, response;

    mesas = await MesaExamen.find({ "estado": "Completada" }).sort({ "acta": -1 }).limit(1);
    if (mesas.length == 0) {
        //Hay que buscar las que estan cerradas
        mesas = await MesaExamen.find({ "estado": "Cerrada" }).sort({ "acta": -1 }).limit(1);
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
    createMesaExamen,
    updateMesaExamen,
    updateMesaExamenDatos,
    deleteMesaExamen,
    getMesaExamenByOid,
    getMesaExamenByActa,
    getMesaExamenByDictado,
    addResultadoMesa,
    getAllMesasExamen,
    getMesasSolicitadas,
    getAllMesasExamen,
    getMesasCompletadas,
    getMesasCompletadasCompartidas,
    updateMesa,
    getUltimaActa,
    createMesa
}