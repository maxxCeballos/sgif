'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (datosPersona, nombreRol, datosRol) => {
    const { nombre, apellido, dni, genero } = datosPersona;

    //TODO: que la persona no exista antes, unique lo deberia controlar

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

    const personaDB = await newPersona.save(/*function (err, doc) { 
        //TODO: revisar
        if(err){
            throw "Ocurrió un error al insertar una Persona" + err;
        }
    }*/);

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

    //TODO: verificar que la persona no tenga el rol antes

    /*if (poseeRol(dni, nombreRol)) {
        
        //TODO: verificar que el rol sea valido y sus datos también, los controllers ya lo hacen        
        throw "La persona ya posee el rol " + nombreRol
    }*/

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
//FIXME: ver que se use el oid
const asociarRol = async (nombreRol, datosRol, dniPersona) => {
    let response = false;

    var $set = { $set: { [nombreRol]: datosRol } };

    const resUpdate = await Persona.updateOne({ dni: dniPersona }, $set);

    if (resUpdate.n === 1) {
        response = await getPersonaById(dniPersona);
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

function poseeRol(dni, nombreRol) {
    return JSON.parse(JSON.stringify(getPersonaById(dni))).hasOwnProperty(nombreRol);
}

module.exports = {
    createPersona,
    getPersonaById,
    getPersonaByOID,
    getAllPersonas,
    updatePersona,
    deletePersonaOID,
    asociarRol    
}