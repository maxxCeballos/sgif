'use strict'

let Localidad = require('../models/localidad.model');

const createLocalidad = async (localidad) => {

    const { nombre, provincia } = localidad;

    const newLocalidad = new Localidad({
        nombre,
        provincia
    });

    const localidadDB = await newLocalidad.save()

    return localidadDB;

}

const getLocalidadByProvincia = async (provincia) => {

    const localidadDB = await Localidad.find({ provincia }).exec();

    return localidadDB
}

const getLocalidad = async (nombre, provoncia) => {

    const localidadDB = await Localidad.find({ nombre, provincia }).exec();

    return localidadDB
}

const getAllLocalidades = async () => {
    const localidadsDB = await Localidad.find().exec();

    return localidadsDB;
}

const updateLocalidad = async (localidad) => {
    //FIXME: ver por que cosa filtrar

    const { nombre, provincia } = localidad

    const newLocalidad = new Localidad({
        nombre,
        provincia
    });

    const response = await Localidad.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteLocalidad = async (dni) => {
    await Localidad.deleteOne({ dni: dni }).exec();

    return true;
}

module.exports = {
    createLocalidad,
    updateLocalidad,
    deleteLocalidad,
    getAllLocalidads,
    getLocalidadById,
}