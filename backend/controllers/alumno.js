'use strict'
let Alumno = require('../models/alumno.model');
const { getPadreByOID } = require('./padre');
const { getPersonaById, createPersona, asociarRol } = require('./persona');
const { getResponsableByOID } = require('./responsable');

const createAlumno = async (alumno, legajo, oidResponsable) => {
    const { dni, tipoDni, nombre, apellido, genero, fechaNacimiento,
        lugarNacimiento, fechaEgreso, nombreEscuelaAnt, foto,
        sacramentos, anioCorrespondiente } = alumno;

    let response;

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

    const alumnoDB = await newAlumno.save()

    //creacion/asociacion de rol alumno a persona
    //TODO: separar en varios endpoint como la creación de los padres y hermano
    let personaDB = await getPersonaById(dni);
    if (personaDB === false) {
        personaDB = createPersona({
            nombre, apellido, dni, genero
        });
    }
    //TODO: virificar que no sea alumno
    response = await asociarRol("alumno", alumnoDB._id, dni);

    if (response !== false) {
        return {
            exito: true,
            alumno: alumnoDB,
        };
    } else {
        return {
            exito: false,
            message: "No se pudo asignar el rol de alumno a la persona, intentelo nuevamente."
        }
    }
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

//FIXME: usar solo un update, verificar si se puede llevar todo a oid
/**
 * actualiza un atributo genérico del primer alumno con el dni ingresado
 * @param {*} atributo 
 * @param {*} valor 
 * @param {*} dni 
 */
const updateAlumnoOID = async (atributo, valor, oid) => {
    let alumno = false;
    let response;
    //TODO: ver si armar error personalizado
    //FIXME: refactor para separar o no.

    if (atributo === "padres" || atributo === "hermanos") {
        var $push = { $push: { [atributo]: valor } };
        response = await Alumno.updateOne({ _id: oid }, $push);
    } else {
        var $set = { $set: { [atributo]: valor } };
        response = await Alumno.updateOne({ _id: oid }, $set);
    }

    if (response.n === 1) {
        alumno = await getAlumnoByOID(oid);
    }

    return alumno;
}

/**
 * actualiza un atributo genérico del primer alumno con el dni ingresado
 * @param {*} atributo 
 * @param {*} valor 
 * @param {*} dni 
 */
const updateAlumno = async (atributo, valor, dni) => {
    let alumno = false;
    //TODO: ver si armar error personalizado
    //FIXME: revisar si todos los updates se hacen por oid asi queda solo el de arriba

    var $set = { $set: { [atributo]: valor } };

    const response = await Alumno.updateOne({ dni: dni }, $set);
    if (response.n === 1) {
        alumno = await getAlumnoById(dni);
    }

    return alumno;
}

const deleteAlumno = async (dni) => {
    //TODO: tiene que borrarlo de la persona tambien

    await Alumno.deleteOne({ dni: dni }).exec();

    return true;
}

const generarLegajo = async () => {
    //El legajo es un string, por eso el orden desc lo hace de forma alfabetica y no de integer

    const alumnosDB = await Alumno.find().select('legajo -_id').sort({ legajo: "desc" }).exec();
    let nuevoLegajo = parseInt(alumnosDB[0].legajo) + 1;
    if (Number.isNaN(nuevoLegajo)) {
        nuevoLegajo = 1;
    }
    return nuevoLegajo
}

const getPadres = async (oidAlumno) => {
    let response = false;
    let responseAux = [];

    const alumnoDB = JSON.parse(JSON.stringify(await getAlumnoByOID(oidAlumno)));

    console.log(alumnoDB.padres)

    if (alumnoDB !== false && alumnoDB.padres.length > 0) {

        console.log("hola")
        alumnoDB.padres.forEach(async (oidPadre)=>{
            await getPadreByOID(oidPadre).then(data => {
                responseAux.push(data);
                console.log(responseAux.length)
            });
        });

        response = responseAux

        //response = Promise.all(responseAux).then(data => {console.log(data)});
        console.log("res" + response);
    }

    return response;
}

/**
 * Metodo que verifica que el alumno recibido, tenga sus atributos básicos y no estén vacíos
 * @param {*} alumno recibe un alumno a inscribir, con todos los datos que se hayan recibido
 */
function tieneDatosBasicos(alumno) {
    const datosBasicos = ['dni', 'tipoDni', 'nombre', 'apellido', 'genero',
        'fechaNacimiento', 'lugarNacimiento', 'fechaEgreso', 'nombreEscuelaAnt'];

    const valido = datosBasicos.every(atributo => {
        if (!alumno.hasOwnProperty(atributo)) {
            //console.log(atributo + " No existe")
            return false;
        } else if (alumno[atributo] === "" || alumno[atributo] === null) {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });

    return valido;
}

module.exports = {
    createAlumno,
    updateAlumno,
    deleteAlumno,
    getAllAlumnos,
    getAlumnoById,
    generarLegajo,
    updateAlumnoOID,
    getAlumnoByOID,
    getPadres
}