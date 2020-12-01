'use strict'

const { getPadreByID, getPadreByOID } = require("./padre");
const { updateAlumnoOID, getAlumnoByOID, setPadre, setHermano } = require("./alumno");
const { createPersona, deletePersonaOID, asociarRolOID, getPersonaByOID, deleteRolOID } = require("./persona");
const { getHermanoByOID } = require("./hermano");
const { NotFound, BadRequest } = require("../middlewares/errores");

const asociarPadre = async (oidPadre, oidAlumno) => {
    let response;

    if (!await getAlumnoByOID(oidAlumno)) {
        throw new NotFound("El OID recibido no corresponde a un alumno, envíelo nuevamente.")
    }

    const padre = await getPadreByOID(oidPadre);
    if (padre !== false) {
        let res = await setPadre(padre._id, oidAlumno);
        if (res.exito) { // si pudo actualizar solo devuelve ok
            response = {
                valido: true,
                message: "El padre fue asociado con exito"
            };
        } else {
            response = {
                valido: false,
                message: "No se pudo actualizar el alumno, verifique si existe"
            };
        }
    } else {
        throw new NotFound("El OID recibido no corresponde a un padre, envíelo nuevamente.")
    }

    return response;
}

/**
 * metodo que registra un padre nuevo, cuando la persona no existe, crea la persona con rol padre y asocia el alumno con el padre.
 * retorna el nuevo padre registrado * 
 * @param {*} datosPadre 
 * @param {*} oidAlumno 
 */
const createPadreNuevo = async (datosPadre, oidAlumno) => {
    const { dni, nombre, apellido, genero, fechaNacimiento, partidaNacimiento, nacionalidad,
        telefono, ocupacion, lugarTrabajo, telefonoLaboral, bautismo, comunion,
        confirmación, egresoPrimario, egresoSecundario, relacionParentesco } = datosPadre;

    const persona = { dni, nombre, apellido, genero };

    const padre = {
        fechaNacimiento, partidaNacimiento, nacionalidad,
        telefono, ocupacion, lugarTrabajo, telefonoLaboral, bautismo, comunion,
        confirmación, egresoPrimario, egresoSecundario, relacionParentesco
    }

    if (!await getAlumnoByOID(oidAlumno)) {
        throw new NotFound("No existe un Alumno con el OID recibido.");
    }

    const personaDB = await createPersona(persona, 'padre', padre);

    let response = await setPadre(personaDB._id, oidAlumno);
    if (response.exito) {
        response = {
            valido: true,
            message: "Se pudo crear el nuevo padre y se asoció con su alumno.",
            padre: personaDB
        }
    } else {
        const resDelete = await deletePersonaOID(personaDB._id);
        if (resDelete) {
            throw new BadRequest("No se pudo asociar al padre con el Alumno. " + response.message);
        } else {
            throw "No se pudo deshacer la creación del padre. ¡Inconsistencia!"
        }
    }
    return response;
}

const createPadreRol = async (datosPadre, oidPersona, oidAlumno) => {
    let response = false;

    const personaDB = await getPersonaByOID(oidPersona);
    if (!personaDB) {
        throw new NotFound("El OID recibido no corresponde a una persona, envíelo nuevamente.")
    }

    const alumnoDB = await getAlumnoByOID(oidAlumno);
    if (!alumnoDB) {
        throw new NotFound("El OID recibido no corresponde a un alumno, envíelo nuevamente.")
    }

    const padre = await asociarRolOID('padre', datosPadre, oidPersona);
    if (padre !== false) {
        const res = await setPadre(padre._id, oidAlumno);
        if (res.exito) {
            response = {
                valido: true,
                message: "Se pudo crear el nuevo padre y se asoció con su alumno.",
                padre: padre
            }
        } else {
            const resDel = await deleteRolOID(oidPersona, 'padre');
            if (resDel) {
                throw new BadRequest("No se pudo asociar el padre con el alumno. " + res.message);
            } else {
                throw "Error al borrar rol padre de la persona. ¡Inconsistencia!"
            }
        }
    } else {
        throw "No se pudo asociar el rol de padre a la persona";
    }

    return response;
}

const asociarHermano = async (oidHermano, oidAlumno) => {
    let response;

    if (!await getAlumnoByOID(oidAlumno)) {
        throw new NotFound("El OID recibido no corresponde a un alumno, envíelo nuevamente.")
    }

    const hermano = await getHermanoByOID(oidHermano);
    if (hermano !== false) {
        let res = await setHermano(hermano._id, oidAlumno);
        if (res.exito) { //si se pudo actualizar el alumno, devuelvo ok
            response = {
                valido: true,
                message: "El hermano fue asociado con exito"
            };
        } else {
            response = {
                valido: false,
                message: "No se pudo actualizar el alumno, verifique si existe"
            };
        }
    } else {
        throw new NotFound("El OID recibido no corresponde a un hermano, envíelo nuevamente.")
    }

    return response;
}

const createHermanoNuevo = async (datosHermano, oidAlumno) => {
    const { dni, nombre, apellido, genero,
        fechaNacimiento, escuelaActual, grado } = datosHermano;

    const persona = { dni, nombre, apellido, genero };

    const hermano = { fechaNacimiento, escuelaActual, grado }
    if (!await getAlumnoByOID(oidAlumno)) {
        throw new NotFound("No existe un Alumno con el OID recibido.");
    }

    const personaDB = await createPersona(persona, 'hermano', hermano);

    let response = await setHermano(personaDB._id, oidAlumno);
    if (response.exito) {
        response = {
            valido: true,
            message: "Se pudo crear el nuevo hermano y se asoció con su alumno.",
            hermano: personaDB
        }
    } else {
        const resDelete = await deletePersonaOID(personaDB._id);
        if (resDelete) {
            throw new BadRequest("No se pudo asociar al hermano con el Alumno. " + response.message);
        } else {
            throw "No se pudo deshacer la creación del hermano. ¡Inconsistencia!"
        }
    }
    return response
}

const createHermanoRol = async (datosHermano, oidPersona, oidAlumno) => {
    let response = false;

    const personaDB = await getPersonaByOID(oidPersona);
    if (!personaDB) {
        throw new NotFound("El OID recibido no corresponde a una persona, envíelo nuevamente.")
    }

    const alumnoDB = await getAlumnoByOID(oidAlumno);
    if (!alumnoDB) {
        throw new NotFound("El OID recibido no corresponde a un alumno, envíelo nuevamente.")
    }

    const hermano = await asociarRolOID('hermano', datosHermano, oidPersona);
    if (hermano !== false) {
        const res = await setHermano(hermano._id, oidAlumno);
        if (res.exito) {
            response = {
                valido: true,
                message: "Se pudo crear el nuevo hermano y se asoció con su alumno.",
                hermano: hermano
            }
        } else {
            const resDel = await deleteRolOID(oidPersona, 'hermano');
            if (resDel) {
                throw new BadRequest("No se pudo asociar al hermano con el Alumno. " + res.message);
            } else {
                throw "Error al borrar rol padre de la persona. ¡Inconsistencia!"
            }
        }
    } else {
        throw "No se pudo asociar el rol de hermano a la persona";
    }

    return response;
}

module.exports = {
    asociarPadre,
    createPadreNuevo,
    createPadreRol,
    asociarHermano,
    createHermanoNuevo,
    createHermanoRol,
}