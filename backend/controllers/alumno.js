'use strict'
let Alumno = require('../models/alumno.model');
const { getPadreByOID } = require('./padre');

const createAlumno = async (alumno, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, legajo, fechaNacimiento,
        lugarNacimiento, fechaEgreso, nombreEscuelaAnt, foto,
        sacramentos, anioCorrespondiente } = alumno;

    let response = {
        exito: false,
        alumno
    };

    //TODO: verificar que la persona no sea un alumno ya

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
        fechaEgreso,
        nombreEscuelaAnt,
        foto,
        sacramentos, //TODO: revisar que este bien armado
        //estadoInscripcion, se completa mas adelante
        anioCorrespondiente,
        responsable: oidResponsable
    });

    response.alumno = await newAlumno.save().exec()
    response.exito = true;

    return response;
}

const getAlumnoById = async (dni) => {
    const alumnoDB = await Alumno.find({ dni: dni }).exec();
    let alumno = false;

    if (alumnoDB.length === 1) {
        alumno = alumnoDB[0];
    } else if (alumnoDB.length > 1) {
        throw "Existe mas de un alumno con el mismo DNI";
    }

    return alumno;
}

const getAlumnoByOID = async (oid) => {
    let alumno;

    alumno = await Alumno.findById(oid).exec();

    if (alumno === null) {
        alumno = false;
    }

    return alumno;
}

const getAllAlumnos = async () => {

    const alumnosDB = await Alumno.find().exec();

    return alumnosDB;
}

/**
 * actualiza un atributo genérico del primer alumno con el oid ingresado
 * @param {*} atributo 
 * @param {*} valor 
 * @param {*} dni 
 */
const updateAlumnoOID = async (atributo, valor, oid) => {
    let alumno = false;
    let response;
    //TODO: ver si armar error personalizado
    //TODO: ver para el del final para que use set padre, sin throw

    if (atributo === "hermanos") {
        var $push = { $push: { [atributo]: valor } };
        response = await Alumno.updateOne({ _id: oid }, $push).exec();
    } else if (atributo !== "padres") {
        var $set = { $set: { [atributo]: valor } };
        response = await Alumno.updateOne({ _id: oid }, $set).exec();
    } else {
        return false;
    }

    if (response.n === 1) {
        alumno = await getAlumnoByOID(oid);
    }

    return alumno;
}

const deleteAlumno = async (dni) => {
    //TODO: tiene que borrarlo de la persona tambien

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

const generarLegajoAl = async () => {
    //El legajo es un string, por eso el orden desc lo hace de forma alfabetica y no de integer

    const alumnosDB = await Alumno.find().select('legajo -_id').sort({ legajo: "desc" }).exec();
    let nuevoLegajo = parseInt(alumnosDB[0].legajo) + 1;
    if (Number.isNaN(nuevoLegajo)) {
        nuevoLegajo = 1;
    }
    return nuevoLegajo
}

const getPadres = async (oidAlumno) => {
    let padresDB = await Alumno.
        findById(oidAlumno).
        select('padres').
        populate({ path: 'padres', select: 'dni nombre apellido genero padre' });

    return padresDB.padres;
}

const setPadre = async (oidPadre, oidAlumno) => {
    let response = {
        exito: false
    };
    let res;
    let padreAux = await getPadreByOID(oidPadre);
    let padres = await getPadres(oidAlumno);    

    //si el arreglo es menor a 2 y mayor a 0, entonces tiene 1 padre y tienen que tener dnis diferentes al que ya tiene
    if (padres.length < 2) {
        if (padres.length === 0 || padres[0].dni !== padreAux.dni) {
            let $push = { $push: { 'padres': oidPadre } }
            res = await Alumno.updateOne({ _id: oidAlumno }, $push).exec();

            if (res.n === 1) {
                response.exito = true;
                response.message = "Padre Asociado Exitosamente."
            } else {
                response.message = "No se pudo asociar padre con alumno."
            }
        }else{
            response.message = "El alumno ya tiene un padre con ese DNI."
        }
    } else {
        response.message = "El alumno ya posee 2 padres.";
    }

    return response;
}

module.exports = {
    createAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    generarLegajoAl,
    updateAlumnoOID,
    getAlumnoByOID,
    getPadres,
    setPadre
}