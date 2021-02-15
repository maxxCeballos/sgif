'use strict'

let Materia = require('../models/materia.model');


const createMateria = async (materia) => {
    const { nombre,anio} =materia;

    const newMateria = new Materia({
       nombre,
       anio
    });


    const materiaDB = await newMateria.save()

    return materiaDB;
}
const getMateria = async (id) => {
    
    const materiaDB = await Materia.findById(id);
    
    return materiaDB
}

module.exports = {
    createMateria,
    getMateria
}