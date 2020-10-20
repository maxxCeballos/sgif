'use strict'

let CicloLectivo = require("../models/cicloLectivo.model");
const { trace } = require('../routes/ciclo-lectivo');

const getCicloLectivo = async () => {
    const cicloLectivoDB = await CicloLectivo.find().exec();

    //TODO: terminar
    /*if (cicloLectoDB.n === 1) {
        retornar el unico
    }else{error, no deberia ocurrir nunca}
    */

    //TODO: arreglar para que quede una sola en la BD
    //return cicloLectivoDB[2];
    return cicloLectivoDB;
}

const createCicloLectivo = async (cicloLectivo) => {
    const { anioCicloLectivo, fechaIniClases, fechaCiere1T,
        fechaCiere2T, fechaCiere3T, fechaFinInscripcion } = cicloLectivo

    const newCicloLectivo = new CicloLectivo({
        anioCicloLectivo, fechaIniClases, fechaCiere1T,
        fechaCiere2T, fechaCiere3T, fechaFinInscripcion
    });

    const cicloLectivoDB = await newCicloLectivo.save();

    return cicloLectivoDB;
}

module.exports = { getCicloLectivo, createCicloLectivo }