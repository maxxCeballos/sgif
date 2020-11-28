'use strict'
var mongoose = require('mongoose');

const { vDni } = require('./validaRequests');

const vAsociarPadre = (req, res, next) => {
    const dniPadre = req.params.dniPadre;
    const oidAlumno = req.query.oidAlumno;

    if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Alumno Inválido");
    }

    //valida dni padre
    vDni(req, res, next);
}

const vPadreNuevo = (req, res, next) => {
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    if (datosPadre === "" || datosPadre === undefined || datosPadre === null) {
        throw new BadRequest("Faltó enviar los datos del Padre.");
    } else if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Alumno Inválido");
    } else if (datosPadre.dni === null || datosPadre.dni === "" || datosPadre.dni === undefined) {
        throw new BadRequest("Faltó enviar DNI del padre");
    }

    if (!tieneDatosBasicosP(datosPadre)) {
        throw new BadRequest("Datos básicos Padre incompletos, verifíquelos nuevamente.");
    }
    next();
}

const vPadreRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    if (datosPadre === "" || datosPadre === undefined || datosPadre === null) {
        throw new BadRequest("Faltó enviar los datos del Padre.");
    } else if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Alumno Inválido");
    } else if (oidPersona === undefined || !mongoose.Types.ObjectId.isValid(oidPersona)) {
        throw new BadRequest("OID Persona Inválido");
    }

    if (!tieneDatosBasicosP(datosPadre)) {
        throw new BadRequest("Datos básicos Padre incompletos, verifíquelos nuevamente.");
    }

    next();
}

const vAsociarHermano = (req, res, next) => {
    const oidAlumno = req.query.oidAlumno;

    if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Alumno inválido");
    }

    vDni(req, res, next)
}

const vHermano = (req, res, next) => {
    const datosHermano = req.body.hermano;
    const oidAlumno = req.body.oidAlumno;

    if (datosHermano === "" || datosHermano === undefined || datosHermano === null) {
        throw new BadRequest("Faltó enviar los datos del Hermano.");
    } else if (oidAlumno === undefined || !mongoose.Types.ObjectId.isValid(oidAlumno)) {
        throw new BadRequest("OID Alumno Inválido");
    }

    if (!tieneDatosBasicosH(datosHermano)) {
        throw new BadRequest("Datos básicos Hermano incompletos, verifíquelos nuevamente.");
    }

    next();
}

const vHermanoRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;

    if (oidPersona === undefined || !mongoose.Types.ObjectId.isValid(oidPersona)) {
        throw new BadRequest("OID Persona Inválido");
    }

    vHermano(req, res, next);
}

function tieneDatosBasicosH(datosHermano) {
    const datosBasicos = ['fechaNacimiento'];

    const valido = datosBasicos.every(atributo => {
        if (datosHermano[atributo] === undefined) {
            //console.log(atributo + " No existe")
            return false;
        } else if (datosHermano[atributo] === "") {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });

    return valido;
}

function tieneDatosBasicosP(datosPadre) {
    const datosBasicos = ['fechaNacimiento', 'nacionalidad',
        'telefono', 'ocupacion', 'relacionParentesco'];

    const valido = datosBasicos.every(atributo => {
        if (datosPadre[atributo] === undefined) {
            //console.log(atributo + " No existe")
            return false;
        } else if (datosPadre[atributo] === "") {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });

    return valido;
}

module.exports = {
    vAsociarPadre,    
    vPadreNuevo,
    vPadreRol,
    vAsociarHermano,
    vHermano,
    vHermanoRol
};