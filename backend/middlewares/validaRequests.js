'use strict'

const vDniAlumno = (req, res, next) => {
    const dni = req.params.dni;
    //TODO: revisar
    //console.log("dni: "+dni+ " / "+dni === '');
    //test con dni = ""
    if (dni === "" || dni === undefined || dni === null) {
        throw "DNI inválido";
    } else {
        next();
    }
}

const vAsociarPadre = (req, res, next) => {
    //TODO:solucionar dni con lo de arriba, o agrupar los dnis en uno
    //FIXME: null y "" no lo toma en query y params
    const dniPadre = req.params.dniPadre;
    const oidAlumno = req.query.oidAlumno;

    if (oidAlumno === "" || oidAlumno === undefined || oidAlumno === null) {
        throw "Error de formato, envíe el OID del alumno.";
    } else {
        next();
    }
}

const vGetPersona = (req, res, next) => {
    //TODO: se soluciona con lo anterior    
}

const vPadreNuevo = (req, res, next) => {
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    if (datosPadre === "" || datosPadre === undefined || datosPadre === null) {
        throw "Faltó enviar los datos del Padre.";
    } else if (oidAlumno === null || oidAlumno === "" || oidAlumno === undefined) {
        throw "Faltó enviar OID Alumno.";
        //FIXME: se podria sacar este dni create lo verifica
    } else if (datosPadre.dni === null || datosPadre.dni === "" || datosPadre.dni === undefined) {
        throw "Faltó enviar DNI del padre";
    }

    if (!tieneDatosBasicosP(datosPadre)) {
        throw "Datos básicos Padre incompletos, verifíquelos nuevamente.";
    }

    next();
}

const vPadreRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosPadre = req.body.padre;
    const oidAlumno = req.body.oidAlumno;

    //TODO: resolver params
    if (datosPadre === "" || datosPadre === undefined || datosPadre === null) {
        throw "Faltó enviar los datos del Padre.";
    } else if (oidAlumno === null || oidAlumno === "" || oidAlumno === undefined) {
        throw "Faltó enviar OID Alumno.";
    }

    if (!tieneDatosBasicosP(datosPadre)) {
        throw "Datos básicos Padre incompletos, verifíquelos nuevamente.";
    }

    next();
}

const vAsociarHermano = (req, res, next) => {
    //TODO:solucionar a partir de arriba  
    //FIXME: null y "" no lo toma en query y params
    const dniHermano = req.params.dniHermano;
    const oidAlumno = req.query.oidAlumno;

    if (oidAlumno === "" || oidAlumno === undefined || oidAlumno === null) {
        throw "OID Alumno inválido";
    }

    next();
}

const vHermano = (req, res, next) => {
    const datosHermano = req.body.hermano;
    const oidAlumno = req.body.oidAlumno;

    if (datosHermano === "" || datosHermano === undefined || datosHermano === null) {
        throw "Faltó enviar los datos del Hermano.";
    } else if (oidAlumno === null || oidAlumno === "" || oidAlumno === undefined) {
        throw "Faltó enviar OID Alumno.";        
    }

    if (!tieneDatosBasicosH(datosHermano)) {
        throw "Datos básicos Hermano incompletos, verifíquelos nuevamente.";
    }

    next();
}

const vHermanoRol = (req, res, next) => {
    const oidPersona = req.params.oidPersona;
    const datosHermano = req.body.hermano;
    const oidAlumno = req.body.oidAlumno;

    //TODO: resolver params oidPersona, depende de los anteriores

    vHermano(req,res,next);
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
    vDniAlumno,
    vAsociarPadre,
    vGetPersona,
    vPadreNuevo,
    vPadreRol,
    vAsociarHermano,
    vHermano,
    vHermanoRol
};