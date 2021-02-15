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

const updatePersona = async (oid, update) => {

    let personaU = Persona.findOneAndUpdate({ '_id': oid }, update, { new: true });

    return personaU;
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
    const personas=  await Persona.find({ "profesor.cuil": { $exists: true }}).exec()
    
    for (i in personas) {
        //Para cada persona encontrada en la base de datos
        personaActual = personas[i];
            materias = personaActual.profesor.materias;
            for (mat in materias) {
                console.log(materias[mat]);
                //Itero en sus materias para saber si puede dar la materia del año ingresado por parametro
                if (materias[mat].nombre == materia && materias[mat].anio == anio) {
                    profesores.push(personaActual);
                }

            }
     


    }
    if(profesores.length==0){
        throw {
            status:204,
            message:"No se encontraron profesores que puedan dar esa materia"
        }

    }

    return profesores;

}

const getProfesores = async () => {
    //Obtengo los profesores
  
    const profesores=  await Persona.find({ "profesor.cuil": { $exists: true }}).exec();
    
    if(profesores.length==0){
        throw {
            status:204,
            message:"No se encontraron profesores"
        }

    }

    return profesores;

}

const getPreceptores = async () => {
    //Obtengo los profesores

    const preceptores =  await Persona.find({ "preceptor.legajo": { $exists: true }}).exec();
    
    if(preceptores.length==0){
        throw {
            status:204,
            message:"No se encontraron preceptores"
        }

    }

    return preceptores;

}
const getPersona = async (oid) => {

    const personaDB = await Persona.findById(oid);

    return personaDB
}

const getPreceptorSancion= async (oid) => {
    //Este es usado por la transacción Consultar Información Alumno
    const preceptor = await Persona.findById(oid);
    return preceptor
}
module.exports = {
    createPersona,
    updatePersona,
    getPersona,
    getPersonaById,
    getAllPersonas,
    updatePersona,
    asociarRol,
    getProfesores,
    getProfesorMateria,
    getPreceptores,
    getPreceptorSancion,
    
}