'use strict'

let Persona = require('../models/persona.model');

const createPersona = async (persona) => {
    const { nombre, apellido, dni, sexo, responsable, hermano, padre, preceptor, profesor, alumno } = persona;

    const newPersona = new Persona({
        nombre,
        apellido,
        dni,
        sexo,
        responsable,
        hermano,
        padre,
        preceptor,
        profesor,
        alumno
    });


    const personaDB = await newPersona.save()

    return personaDB;
}

const getPersona = async (oid) => {

    const personaDB = await Persona.findById(oid);

    return personaDB
}


const getResponsableAlumno = async (oid) => {
    //Este es usado por la transacción Consultar Información Alumno
    const personaDB = await Persona.findById(oid);

    return personaDB
}

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

const getPreceptorSancion= async (oid) => {
    //Este es usado por la transacción Consultar Información Alumno
    const preceptor = await Persona.findById(oid);
    return preceptor
}

module.exports = {
    createPersona,
    getPersona,
    getProfesores,
    getProfesorMateria,
    getPreceptores,
    getPreceptorSancion,
    getResponsableAlumno
}