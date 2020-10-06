'use strict';

let Persona = require('../models/persona.model');

const createProfesor = async (profesor) => {

    const { dni, tipoDni, nombre, apellido, genero } = profesor;

    if (no existe) {
        createPersona(datosDePersona);
        {nombre,
            apellido,
            dni,
            sexo,
            alumno,}
    }else{
        //Update de persona agregando profe
    }
    
    const newProfesor = new Persona({
        

        // Atributos de Profesor
        profesor: {
            cuil,
            lugarNacimiento,
            fechaNacimiento,
            nacionalidad,
            domicilioLegal,
            localidad,
            telefono,
            email,
            fechaIngreso,
            nivel,
            condicion,
            datosTrabajo,
            escuelaPrevia,
            fechaSalidaEscuelaPrevia,
            antiguedadTotal,
            materias: {
                nombre,
                anio,
            }
        }
    });

    const personaDB = await newProfesor.save()

    return personaDB;

}


const getProfesorById = async (dni) => {

    const profesorDB = await Persona.find({ dni: dni }).exec();

    return profesorDB
}

const getAllProfesors = async () => {

    const profesoresDB = await Persona.find().exec();

    return profesoresDB;
}

const updateProfesor = async (profesor) => {

    const { dni, nombre, apellido } = profesor

    const response = await Persona.updateOne({ dni: dni }, {
        nombre: nombre,
        apellido: apellido,
    })

    if (response.n === 1) return true

    return false

}

const deleteProfesor = async (dni) => {

    //TODO: ver si eliminar todo o solo la parte profesor
    await Persona.deleteOne({ dni: dni }).exec();

    return true;
}

module.exports = {
    createProfesor,
    updateProfesor,
    deleteProfesor,
    getAllProfesors,
    getProfesorById,
}