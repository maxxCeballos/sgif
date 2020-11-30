'use strict'

const Persona = require('../models/persona.model');
const persona = require('./persona');

const getResponsableById = async (dni) => {
    let responsable = await Persona.find({ dni: dni, responsable: { $exists: true } }).exec()    

    if (responsable.length < 1) {
        return false;
    } else if (responsable.length > 1) {
        throw "Hay mas de un responsable con el mismo DNI."
    }

    return responsable[0]
}

const getResponsableByOID = async (oid) => {
    let responsable = await Persona.find({ _id: oid, responsable: { $exists: true } }).exec()

    if (responsable.length < 1) {
        return false;
    }

    return responsable[0];
}

const getAllResponsables = async () => {
    let responsables = await Persona.find({ responsable: { $exists: true } }).exec();

    if (responsables.length < 1) {
        responsables = false;
    }

    return responsables;
}

const updateResponsable = async (responsable) => {

    const { dni, nombre, apellido } = responsable

    const response = await Persona.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteResponsable = async (dni) => {
    //PARA ELIMINAR UN RESPONSABLE, SE DEBE ELIMINAR A LOS ALUMNOS QUE LO TENGAN PRIMERO

    await Persona.deleteOne({ dni: dni }).exec();

    return true;
}

const generarLegajoResp = async () => {
    const responsablesBD = await Persona.find({ responsable: { $exists: true } }).select('responsable.legajo -_id').sort({ 'responsable.legajo': "desc" }).exec();
    let nuevoLegajo = parseInt(responsablesBD[0].responsable.legajo) + 1;
    if (Number.isNaN(nuevoLegajo)) {
        nuevoLegajo = 1;
    }
    return nuevoLegajo;
}

module.exports = {
    updateResponsable,
    deleteResponsable,
    getAllResponsables,
    getResponsableById,
    getResponsableByOID,
    generarLegajoResp
}