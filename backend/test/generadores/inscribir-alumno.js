'use strict'

const Alumno = require('../../models/alumno.model');
const CicloLectivo = require('../../models/cicloLectivo.model');
const Persona = require('../../models/persona.model');

let oidCiclo;
let oidAlumno;

const crearCicloLectivo = async (datosCicloLectivo) => {
    const { cicloLectivo, fechaIniClases, fechaCiere1T,
        fechaCiere2T, fechaCiere3T, fechaFinInscripcion } = datosCicloLectivo

    const cicloNuevo = new CicloLectivo({
        cicloLectivo,
        fechaIniClases,
        fechaCiere1T,
        fechaCiere2T,
        fechaCiere3T,
        fechaFinInscripcion
    });

    const cicloLCreado = await cicloNuevo.save();
    oidCiclo = cicloLCreado._id;
    console.log("Ciclo Lectivo Testing Creado")
    return cicloLectivo;
}

const eliminarCicloLectivo = async () => {
    const response = await CicloLectivo.deleteOne({ _id: oidCiclo }).exec();
    console.log("Ciclo Lectivo Testing Eliminado")
    return response;
}

const crearAlumno = async (datosAlumno, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        lugarNacimiento, legajo, estadoInscripcion, anioCorrespondiente } = datosAlumno;

    const newAlumno = new Alumno({
        dni,
        tipoDni,
        nombre,
        apellido,
        genero,
        fechaNacimiento,
        lugarNacimiento,
        legajo,
        fechaIngreso: new Date().toISOString(),
        estadoInscripcion,
        anioCorrespondiente,
        responsable: oidResponsable
    });

    const alumno = await newAlumno.save();
    console.log("Alumno Testing Creado")
    oidAlumno = alumno._id;

    return alumno;
}

const eliminarAlumno = async () => {
    const response = await Alumno.deleteOne({ _id: oidAlumno }).exec();
    console.log("Alumno Testing Eliminado")
    return response;
}

const crearPersona = async (datosPersona) => {
    const { dni, nombre, apellido, genero } = datosPersona;
    const personaNueva = new Persona({
        dni, nombre, apellido, genero
    })
    const personaDB = await personaNueva.save();
    console.log("Persona Testing Creada");    
    return personaDB;
}

/*const eliminarPersona = async () => {
    const response = await Persona.deleteOne({ _id: oidPersona }).exec();
    console.log("Persona Testing Eliminada");
    return response
}*/

const crearPersonaRol = async (datosPersona, nombreRol, datosRol) => {
    const { dni, nombre, apellido, genero } = datosPersona;
    const personaNueva = new Persona({
        dni, nombre, apellido, genero, [nombreRol]: datosRol
    })
    const personaDB = await personaNueva.save();
    console.log("Persona Rol Testing Creada");
    return personaDB;
}

const eliminarPersonaOID = async (oid) => {
    const response = await Persona.deleteOne({ _id: oid }).exec();
    console.log("Persona Creada Eliminada");
    return response
}

module.exports = {
    crearCicloLectivo,
    eliminarCicloLectivo,
    crearAlumno,
    eliminarAlumno,
    crearPersona,    
    crearPersonaRol,
    eliminarPersonaOID
}