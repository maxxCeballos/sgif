'use strict'

const Persona = require('../models/persona.model');
const persona = require('./persona');
const { getPersonaById, createPersona, asociarRol, getAllPersonas } = require('./persona');

const createResponsable = async (datosResponsable) => {

    //FIXME: !!!se puede crear un responsable vacio

    const { nombre, apellido, dni, sexo, cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia } = datosResponsable;

    const persona = { nombre, apellido, dni, sexo };

    const responsable = {
        legajo: await generarLegajo(),
        cuitCuil, telefono, email, calle, altura,
        barrio, piso, depto, tira, modulo, localidad, codigoPostal, provincia
    }

    //verifico si la persona existe    
    let personaDB = await getPersonaById(dni);

    if (personaDB === false) {
        personaDB = await createPersona(persona);
    }

    //si la persona existe o se creó, se realiza esto
    let actualizoRol = false;
    if (!esResponsable(personaDB)) {
        actualizoRol = await asociarRol("responsable", responsable, dni);
    }else{
        throw "La persona ya esta registrada como responsable"
    }

    let response;
    if (actualizoRol !== false) {
        //lo busco para devolverlo despues de crearlo
        response = await getResponsableById(dni);
    } else {
        throw "Ocurrió un error al asignar el rol, reintente nuevamente";
    }

    return response;
}

const getResponsableById = async (dni) => {   

    const personaDB = await getPersonaById(dni);

    if (personaDB !== false && esResponsable(personaDB)) {
        return personaDB;
    }
    return false;

}

const getAllResponsables = async () => {
    let responsablesDB = [];
    let j = 0;
    const personasDB = await getAllPersonas();

    for (let i = 0; i < personasDB.length; i++) {
        if (esResponsable(personasDB[i])) {
            responsablesDB[j] = personasDB[i];
            j++;
        }
    }
    return responsablesDB;
}

const updateResponsable = async (responsable) => {

    const { dni, nombre, apellido } = responsable

    const response = await Responsable.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteResponsable = async (dni) => {
    //PARA ELIMINAR UN RESPONSABLE, SE DEBE ELIMINAR A LOS ALUMNOS QUE LO TENGAN PRIMERO

    await Responsable.deleteOne({ dni: dni }).exec();

    return true;
}

const generarLegajo = async () => {
    const responsablesBD = await Persona.find().select('responsable.legajo -_id').sort({ 'responsable.legajo': "desc" }).exec();    
    let nuevoLegajo = parseInt(responsablesBD[0].responsable.legajo) + 1;
    if (Number.isNaN(nuevoLegajo)) {
        nuevoLegajo = 1;
    }
    return nuevoLegajo;
}

const esResponsable = (personaObj) => {
    return JSON.parse(JSON.stringify(personaObj)).hasOwnProperty('responsable');;
}

module.exports = {
    createResponsable,
    updateResponsable,
    deleteResponsable,
    getAllResponsables,
    getResponsableById,
}