'use strict'

let CicloLectivo = require("../models/cicloLectivo.model");
const { trace } = require('../routes/ciclo-lectivo');

const getCicloLectivo = async () => {
    const cicloLectivoDB = await CicloLectivo.find().sort({ cicloLectivo: -1 }).exec();
    return cicloLectivoDB;
}

const getCicloLectivoById = async (cicloLectivo) =>{
    const cicloLectivoDB = await CicloLectivo.find({ cicloLectivo: cicloLectivo }).exec();
    return cicloLectivoDB;
}

const createCicloLectivo = async (cicloLectivoObj) => {
    const { cicloLectivo, fechaIniClases, fechaCiere1T,
        fechaCiere2T, fechaCiere3T, fechaFinInscripcion } = cicloLectivoObj

    const newCicloLectivo = new CicloLectivo({
        cicloLectivo, fechaIniClases, fechaCiere1T,
        fechaCiere2T, fechaCiere3T, fechaFinInscripcion
    });

    const cicloLectivoDB = await newCicloLectivo.save();

    return cicloLectivoDB;
}

module.exports = { getCicloLectivo, createCicloLectivo, getCicloLectivoById}