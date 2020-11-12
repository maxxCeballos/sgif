'use strict'

let Mesa = require('../models/mesaExamen.model');

const createMesa = async (mesa) => {
    const { acta, fechaHora, aula, estado, esCompartida, esPadre, dictado,
        preceptores,
        profesores,
        asociadas,
        resultados } = mesa;

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
        const response = { message: "No se encontraron mesas en estado Solicitada" }; //#TODO ver si puede hacer de otra manera
        return response;
    }
    return mesas
}


const updateMesaIndividual = async (oid, update) => {

    let mesaUpdated = Mesa.findOneAndUpdate({'_id':oid},update,{new:true});
    
    return mesaUpdated;
}
module.exports = {
    createMesa,
    getMesasSolicitadas,
    updateMesaIndividual

}