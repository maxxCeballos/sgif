'use strict'

const vDni = (req, res, next) => {
    //TODO: solucionar ""
    const dni = req.params.dni
    console.log("implementar vDni");
    next();
}

const vResponsableNuevo = (req, res, next) => {
    const datosResponsable = req.body.responsable;

    const { dni, nombre, apellido, genero } = datosResponsable;
    const datosPersona = { dni, nombre, apellido, genero };

    if (datosResponsable === "" || datosResponsable === undefined || datosResponsable === null) {
        throw "Faltó enviar los datos del Responsable.";
    }

    if (!vPersona(datosPersona) || !tieneDatosBasicosR(datosResponsable)) {
        throw "Datos básicos Responsable incompletos, verifíquelos nuevamente.";
    }

    next();
}

const vResponsableRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosResponsable = req.body.responsable;

    //TODO: resolver params
    if (datosResponsable === "" || datosResponsable === undefined || datosResponsable === null) {
        throw "Faltó enviar los datos del Responsable.";
    }

    if (!tieneDatosBasicosR(datosResponsable)) {
        throw "Datos básicos Responsable incompletos, verifíquelos nuevamente.";
    }

    next();
}

const vRegistrarAlumnoNuevo = (req, res, next) => {
    const datosAlumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    if (datosAlumno === "" || datosAlumno === undefined || datosAlumno === null) {
        throw "Faltó enviar los datos del Alumno.";
    } else if (oidResponsable === "" || oidResponsable === undefined || oidResponsable === null) {
        throw "Faltó enviar OID Responsable.";
    }

    if (!vPersona(datosAlumno) || !tieneDatosBasicosA(datosAlumno)) {
        throw "Datos básicos Alumno incompletos, verifiquelos nuevamente."
    }

    next();
}

const vRegistrarAlumnoRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    //TODO: resolver params

    const datosAlumno = req.body.alumno;
    const oidResponsable = req.body.oidResponsable;

    if (datosAlumno === "" || datosAlumno === undefined || datosAlumno === null) {
        throw "Faltó enviar los datos del Alumno.";
    } else if (oidResponsable === "" || oidResponsable === undefined || oidResponsable === null) {
        throw "Faltó enviar OID Responsable.";
    }

    if (!tieneDatosBasicosA(datosAlumno)) {
        throw "Datos básicos Alumno incompletos, verifiquelos nuevamente."
    }

    next();
}

const vReinscribirAlumno = (req, res, next) => {
    //TODO: resolver params y query
    const oidAlumno = req.params.oidAlumno;
    const valorAnio = req.query.anio;
    console.log("Validar reinscripción, falta ver los query y params")
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
            //console.log(atributo + " No existe")
            return false;
        } else if (datosPersona[atributo] === "") {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true;
    });

    return valido;
}
module.exports = {
    vDni,
    vResponsableNuevo,
    vResponsableRol,
    vRegistrarAlumnoNuevo,
    vRegistrarAlumnoRol,
    vReinscribirAlumno
}