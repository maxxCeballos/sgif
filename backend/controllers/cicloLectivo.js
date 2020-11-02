'use strict'

const { findByIdAndUpdate, findOneAndUpdate } = require('../models/cicloLectivo.model');
let CicloLectivo = require('../models/cicloLectivo.model');


const createCicloLectivo = async (ciclo) => {
    const { cicloLectivo, fechaIniClases, fechaCierre1T, fechaCierre2T, fechaCierre3T } = ciclo;

    const newCicloLectivo = new CicloLectivo({
        cicloLectivo,
        fechaIniClases,
        fechaCierre1T,
        fechaCierre2T,
        fechaCierre3T,
    });


    const cicloLectivoDB = await newCicloLectivo.save()

    return cicloLectivoDB;
}
const getCicloLectivo = async (ciclo) => {

    const cicloDB = await CicloLectivo.find({"cicloLectivo":ciclo});

    return cicloDB
}
const getCicloLectivoActual = async () => {

    const ciclosDB = await CicloLectivo.find().sort({ "cicloLectivo": -1 }).limit(1);

    return ciclosDB
}


const updateCicloLectivo = async (oid, update) => {

    const cicloUpdated = CicloLectivo.findByIdAndUpdate(oid, update);

    return cicloUpdated;
}
module.exports = {
    createCicloLectivo,
    getCicloLectivo,
    getCicloLectivoActual,
    updateCicloLectivo
}