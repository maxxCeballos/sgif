'use strict'

let ResultadoMesa = require('../models/resultadoMesa.model');

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

const createResultadoMesaBasico = async (oidAlumno) => {
    const newResultadoMesa = new ResultadoMesa({
        alumno: oidAlumno,
    });

    const resultadoMesaDB = await newResultadoMesa.save()

    return resultadoMesaDB;
}

/**
 * TODO: no anda
 */
const getResultadoMesaById = async (dni) => {
    //FIXME: ver si cambiar nombre a ...ByDni porq id puede ser OID
    const resultadoMesaDB = await ResultadoMesa.find({ dni: dni }).exec();

    return resultadoMesaDB
}

const getResultadoMesaByOid = async (oidResultado) => {
    //FIXME: ver como se buscaria por oid    
    const resultadoMesaDB = await ResultadoMesa.findById(oidResultado).exec();

    return resultadoMesaDB
}

const getAllResultadoMesas = async () => {

    const resultadoMesasDB = await ResultadoMesa.find().exec();

    return resultadoMesasDB;
}

// const updateResultadoMesa = async (resultadoMesa) => {
//     const { dni, nombre, apellido } = resultadoMesa

//     const response = await ResultadoMesa.updateOne({ dni: dni }, {
//         nombre: nombre,
//         apellido: apellido,
//     })

//     if (response.n === 1) return true

//     return false;
// }

const updateResultadoMesa = async (oidResultado, newResultado) => {
    let response = await ResultadoMesa.updateOne(
        { _id: oidResultado },
        newResultado
    ).exec();

    return response.n === 1;
}

// const updateResultadoMesa = async (oidResultado, atributo, valor) => {
//     var $set = { $set: {} };
//     $set.$set[atributo] = valor;

//     const response = await Alumno.updateOne({ _id: oidResultado }, $set);

//     if (response.n === 1) return true

//     return false
// }

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
    getResultadoMesaByOid,
    createResultadoMesaBasico,
}