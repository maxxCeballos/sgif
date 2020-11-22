'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (persona) => {
    const { nombre, apellido, dni, sexo } = persona;

    let newPersona = new Persona({
        nombre,
        apellido,
        dni,
        sexo
    });

    const personaDB = await newPersona.save();

    return personaDB;
}

const getPersonaById = async (dni) => {
    const personaDB = await Persona.find({ dni: dni }).exec();

    return personaDB;
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

const asociarRol = async (nombreRol, datosRol, dniPersona) => {
    //metodo que asocia el nuevo rol de la persona, segun el nombre y datos que se reciben por parámetro

    var $set = { $set: {} };
    $set.$set[nombreRol] = datosRol;
    const response = await Persona.updateOne({ dni: dniPersona }, $set);

    if (response.n === 1) return true

    return false
}


//Controllers yaupe
const getProfesorMateria = async (materia, anio) => {
    //Obtengo los profesores que puedan impartir la materia que llego como parametro
    let i, mat, materias,personaActual,profesores = [];
    const personas = await Persona.find();

    for (i in personas) {
        //Para cada persona encontrada en la base de datos
        personaActual = personas[i];
        if (JSON.parse(JSON.stringify(personaActual)).hasOwnProperty('profesor')) {
            //Verifico si tiene la propiedad profesor
            
            materias = personaActual.profesor.materias;
            for (mat in materias) {
                console.log(materias[mat]);
                //Itero en sus materias para saber si puede dar la materia del año ingresado por parametro
                if (materias[mat].nombre == materia && materias[mat].anio == anio) {
                    profesores.push(personaActual);
                }

            }
        }


    }


    return profesores;

}
const getProfesores = async () => {
    //Obtengo los profesores
    let i,personaActual,profesores = [];
    const personas = await Persona.find();
    for (i in personas) {
        //Para cada persona encontrada en la base de datos
        personaActual = personas[i];
        if (JSON.parse(JSON.stringify(personaActual)).hasOwnProperty('profesor')) {
            //Verifico si tiene la propiedad profesor
            profesores.push(personaActual); 
        }
    }


    return profesores;

}

const getPreceptores = async () => {
    //Obtengo los profesores
    let i,personaActual,preceptores = [];
    const personas = await Persona.find();
    for (i in personas) {
        //Para cada persona encontrada en la base de datos
        personaActual = personas[i];
        if (JSON.parse(JSON.stringify(personaActual)).hasOwnProperty('preceptor')) {
            //Verifico si tiene la propiedad profesor
            preceptores.push(personaActual); 
        }
    }


    return preceptores;

}
module.exports = {
    createPersona,
    getPersonaById,
    getAllPersonas,
    updatePersona,
    asociarRol,
    getProfesores,
    getProfesorMateria,
    getPreceptores
    

}