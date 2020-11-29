'use strict'
var mongoose = require('mongoose');
const {BadRequest} = require('./errores');

const vResponsableNuevo = (req, res, next) => {
    const datosResponsable = req.body.responsable;

    if (datosResponsable === "" || datosResponsable === undefined || datosResponsable === null) {
        throw new BadRequest("Faltó enviar los datos del Responsable.");
    }

    const { dni, nombre, apellido, genero } = datosResponsable;
    const datosPersona = { dni, nombre, apellido, genero };    

    if (!vPersona(datosPersona) || !tieneDatosBasicosR(datosResponsable)) {
        throw new BadRequest("Datos básicos Responsable incompletos, verifíquelos nuevamente.");        
    }

    next();
}

const vResponsableRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosResponsable = req.body.responsable;

    if (oidPersona === undefined || !mongoose.Types.ObjectId.isValid(oidPersona)) {
        throw new BadRequest("OID Persona Inválido");
    } else if (datosResponsable === "" || datosResponsable === undefined || datosResponsable === null) {
        throw new BadRequest ("Faltó enviar los datos del Responsable.");
    }

    if (!tieneDatosBasicosR(datosResponsable)) {
        throw new BadRequest ("Datos básicos Responsable incompletos, verifíquelos nuevamente.");
    }

    next();
}

const vRegistrarAlumnoNuevo = (req, res, next) => {
    const datosAlumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    if (datosAlumno === "" || datosAlumno === undefined || datosAlumno === null) {
        throw new BadRequest ("Faltó enviar los datos del Alumno.");
    } else if (oidResponsable === "" || oidResponsable === undefined || oidResponsable === null) {
        throw new BadRequest ("Faltó enviar OID Responsable.");
    }

    if (!vPersona(datosAlumno) || !tieneDatosBasicosA(datosAlumno)) {
        throw new BadRequest ("Datos básicos Alumno incompletos, verifiquelos nuevamente.");
    }

    next();
}

const vRegistrarAlumnoRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosAlumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    if (oidPersona === undefined || !mongoose.Types.ObjectId.isValid(oidPersona)) {
        throw new BadRequest ("OID Persona Inválido");
    } else if (datosAlumno === "" || datosAlumno === undefined || datosAlumno === null) {
        throw new BadRequest ("Faltó enviar los datos del Alumno.");
    } else if (oidResponsable === "" || oidResponsable === undefined || oidResponsable === null) {
        throw new BadRequest ("Faltó enviar OID Responsable.");
    }

    if (!tieneDatosBasicosA(datosAlumno)) {
        throw new BadRequest ("Datos básicos Alumno incompletos, verifiquelos nuevamente.");
    }

    next();
}

const vReinscribirAlumno = (req, res, next) => {
    const oidAlumno = req.params.oidAlumno;
    const valorAnio = req.query.anio;

    if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest ("OID Alumno Inválido");
    } else if (valorAnio === null || valorAnio === undefined ||
        isNaN(parseInt(valorAnio)) || parseInt(valorAnio) < 1 || parseInt(valorAnio) > 5) {
        throw new BadRequest("Año Reinscripción Inválido");
    }
    next();
}

function tieneDatosBasicosA(datosAlumno) {
    const datosBasicos = ['tipoDni', 'fechaNacimiento', 'lugarNacimiento',
        'nombreEscuelaAnt', 'anioCorrespondiente'];

    const valido = datosBasicos.every(atributo => {
        if (!datosAlumno.hasOwnProperty(atributo)) {
            //console.log(atributo + " No existe")
            return false;
        } else if (datosAlumno[atributo] === "" || datosAlumno[atributo] === null) {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });
    console.log("validador datos basicos ", valido);

    return valido;
}

function tieneDatosBasicosR(datosResponsable) {
    const datosBasicos = ['cuitCuil', 'telefono', 'email', 'calle',
        'altura', 'localidad', 'codigoPostal', 'provincia'];

    const valido = datosBasicos.every(atributo => {
        if (datosResponsable[atributo] === undefined) {
            //console.log(atributo + " No existe")
            return false;
        } else if (datosResponsable[atributo] === "") {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true;
    });
    return valido;
}

function vPersona(datosPersona) {
    const datosBasicos = ['nombre', 'apellido', 'dni', 'genero'];

    const valido = datosBasicos.every(atributo => {
        if (datosPersona[atributo] === undefined) {
            console.log(atributo + " No existe")
            return false;
        } else if (datosPersona[atributo] === "") {
            console.log(atributo + " Está Vacío")
            return false;
        } else return true;
    });
    console.log("validador datos persona ",valido)

    return valido;
}
module.exports = {
    vResponsableNuevo,
    vResponsableRol,
    vRegistrarAlumnoNuevo,
    vRegistrarAlumnoRol,
    vReinscribirAlumno
}