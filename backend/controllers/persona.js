'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (datosPersona, nombreRol, datosRol) => {
    const { nombre, apellido, dni, genero } = datosPersona;

    //TODO: que la persona no exista antes, unique lo deberia controlar
    //TODO: verificar que no tenga el rol antes

    if (!datosBasicos(datosPersona)) {
        throw "Datos básicos Persona incompletos, verifíquelos nuevamente."
    }

    let newPersona = new Persona({
        nombre,
        apellido,
        dni,
        genero,
        [nombreRol]: datosRol,
    });

    const personaDB = await newPersona.save();

    return personaDB;
}

const getPersonaById = async (dni) => {
    const personaDB = await Persona.find({ dni: dni }).exec();
    let persona = false;

    if (personaDB.length === 1) {
        persona = personaDB[0];
    } else if (personaDB.length > 1) {
        throw "Hay mas de una persona con el mismo dni";
    }

    return persona;
}

const getPersonaByOID = async (oid) => {
    let persona;

    persona = await Persona.findById(oid).exec();

    if (persona === null) {
        persona = false;
    }

    return persona;
}

const getAllPersonas = async () => {
    const personasDB = await Persona.find().exec();

    return personasDB;
}

const updatePersona = async (persona) => {
    const { dni, nombre, apellido, } = persona;

    const response = await Persona.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false
}

/*
 * Metodo que asocia el nuevo rol de la persona, segun el nombre del mismo y datos que se reciben por parámetro
 * Retorna la persona luego de modificarse.
 */
const asociarRolOID = async (nombreRol, datosRol, oidPersona) => {
    let response = false;

    let personaRol = await Persona.find({ _id: oidPersona, [nombreRol]: { $exists: true } })
    
    if (personaRol.length != 0) {
        //Solo pasa con hermano porque el esquema tiene un arreglo
        if (personaRol[0].hermano.fechaNacimiento !== undefined) {
            throw "La persona ya posee el rol " + nombreRol + "."
        }
    }

    var $set = { $set: { [nombreRol]: datosRol } };
    const responsable = await Persona.updateOne({ _id: oidPersona }, $set);

    if (responsable.n === 1) {
        response = await getPersonaByOID(oidPersona);
    };

    return response;
}

const deletePersonaOID = async (oid) => {
    await Persona.deleteOne({ _id: oid }).exec();

    return true;
}

function datosBasicos(persona) {
    const datosBasicos = ['nombre', 'apellido', 'dni', 'genero'];

    const valido = datosBasicos.every(atributo => {
        if (!persona.hasOwnProperty(atributo) || persona[atributo] === undefined) {
            //console.log(atributo + " No Existe");
            return false;
        } else if (persona[atributo] === "") {
            //console.log(atributo + " Está Vacío");
        } else { return true }
    })
    return valido;
}

module.exports = {
    createPersona,
    getPersonaById,
    getPersonaByOID,
    getAllPersonas,
    updatePersona,
    deletePersonaOID,
    asociarRolOID
}