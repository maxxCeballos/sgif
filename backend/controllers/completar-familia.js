'use strict'

const { getPadreByID, getPadreByOID } = require("./padre");
const { updateAlumnoOID, getAlumnoByOID, getPadres } = require("./alumno");
const { createPersona, deletePersonaOID, asociarRolOID, getPersonaByOID } = require("./persona");
const { getHermanoById } = require("./hermano");

const asociarPadre = async (dniPadre, oidAlumno) => {
    let actualizoAlumno = false;
    let response = {
        valido: false,
        message: "No existe el padre, no se pudo asociar con el alumno"
    };

    if (oidAlumno === undefined) {
        throw "Error de formato, envíe el OID del alumno."
    }
    //TODO: evaluar oidAlumno antes

    const padre = await getPadreByID(dniPadre);
    if (padre !== false) {
        //FIXME: llevar a setPadre
        actualizoAlumno = await updateAlumnoOID('padres', padre._id, oidAlumno);

        //TODO: Ver con ifaz si devuelve el padre o no (que solo devuelva el ok)
        if (actualizoAlumno !== false) { //si se pudo actualizar el alumno, devuelvo el padre
            response = {
                valido: true,
                padre
                //message: "El padre fue asociado con exito"
            };
        } else {
            response = {
                valido: false,
                message: "No se pudo actualizar el alumno, verifique si existe"
            };
        }
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

    //TODO: refactor, para error handler
    const res = await validarParametros(datosPadre, oidAlumno)
    if (!res.exito) {
        return res;
    }

    if (!datosBasicos(padre)) {
        return {
            exito: false,
            message: "Datos básicos Padre incompletos, verifíquelos nuevamente."
        }
    }

    if (dni === undefined) {
        return {
            exito: false,
            message: "Dni de padre inválido."
        }
    } /*else if (!await padreValido(dni, oidAlumno)) {
        console.log("invalido")
        return {
            exito: false,
            message: "El alumno, ya posee un padre con el dni recibido"
        }
    }*/

    const personaDB = await createPersona(persona, 'padre', padre);
    //TODO: controlar cuando no puede crear la persona

    //FIXME: llevar a setPadre en padre o alumno? para que se revisen las restricciones ahi
    let response = await updateAlumnoOID('padres', personaDB._id, oidAlumno);
    if (response !== false) {
        response = {
            valido: true,
            message: "Se pudo crear el nuevo padre y se asoció con su alumno.",
            padre: personaDB
        }
    } else {
        const resDelete = await deletePersonaOID(personaDB._id);
        if (resDelete) {
            throw "No se pudo asociar al padre con el Alumno, inténtelo nuevamente"
        } else {
            throw "No se pudo deshacer la creación del padre. ¡Inconsistencia!"
        }
    }

    return response;
}

const createPadreRol = async (datosPadre, oidPersona, oidAlumno) => {
    let response = false;
    //TODO: refactor respuestas con throw  

    //TODO: validar parametros nulos y estructura, etc

    const personaDB = await getPersonaByOID(oidPersona);
    if (!personaDB) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a una persona, envíelo nuevamente."
        }
    }

    const alumnoDB = await getAlumnoByOID(oidAlumno);
    if (!alumnoDB) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a un alumno, envíelo nuevamente."
        }
    }

    //TODO:verificar que la persona no tenga el rol antes
    const padre = await asociarRolOID('padre', datosPadre, oidPersona);
    if (padre !== false) {
        //TODO: set padres
        const alumnoHijo = await updateAlumnoOID('padres', padre._id, oidAlumno);
        if (alumnoHijo !== false) {
            response = {
                valido: true,
                message: "Se pudo crear el nuevo padre y se asoció con su alumno.",
                padre: padre
            }
        } else {
            throw "No se pudo asociar el padre con el alumno.";
            //TODO: eliminar el rol de padre de la persona
        }
    } else {
        throw "No se pudo asociar el rol de padre a la persona";
    }

    return response;
}


const asociarHermano = async (dniHermano, oidAlumno) => {
    //TODO: buscar al hermano, si existe lo une y lo retorna despues, si no existe devuelve mensaje
    let actualizoAlumno = false;
    let response = {
        valido: false,
        message: "No existe el hermano, no se pudo asociar con el alumno"
    }

    if (!getAlumnoByOID(oidAlumno)) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a un alumno, envíelo nuevamente."
        }
    }

    const hermano = await getHermanoById(dniHermano);
    if (hermano !== false) {
        //FIXME: llevar a setHermano
        actualizoAlumno = await updateAlumnoOID('hermanos', hermano._id, oidAlumno);

        //TODO: Ver con ifaz si devuelve el hermano o no (que solo devuelva el ok)
        if (actualizoAlumno !== false) { //si se pudo actualizar el alumno, devuelvo el hermano
            response = {
                valido: true,
                hermano
                //message: "El hermano fue asociado con exito"
            };
        } else {
            response = {
                valido: false,
                message: "No se pudo actualizar el alumno, verifique si existe"
            };
        }
    }
    return response;
}

const createHermanoNuevo = async (datosHermano, oidAlumno) => {
    //TODO: buscar la persona, si existe agregar nuevo rol y asocia con al; sino crea, asigna y asocia con alumno

    const { dni, nombre, apellido, genero,
        fechaNacimiento, escuelaActual, grado } = datosHermano;

    const persona = { dni, nombre, apellido, genero };

    const hermano = { fechaNacimiento, escuelaActual, grado }
    if (!await getAlumnoByOID(oidAlumno)) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a un alumno, envíelo nuevamente."
        }
    }

    const personaDB = await createPersona(persona, 'hermano', hermano);
    //TODO: controlar cuando no puede crear la persona

    //FIXME: llevar a setHermano en herman o alumno? para que se revisen las restricciones ahi
    let response = await updateAlumnoOID('hermanos', personaDB._id, oidAlumno);
    if (response !== false) {
        response = {
            valido: true,
            message: "Se pudo crear el nuevo hermano y se asoció con su alumno.",
            hermano: personaDB
        }
    } else {
        const resDelete = await deletePersonaOID(personaDB._id);
        if (resDelete) {
            throw "No se pudo asociar al hermano con el Alumno, inténtelo nuevamente"
        } else {
            throw "No se pudo deshacer la creación del hermano. ¡Inconsistencia!"
        }
    }
    return response
}

const createHermanoRol = async (datosHermano, oidPersona, oidAlumno) => {
    let response = false;
    //TODO: refactor respuestas con throw  

    //TODO: validar parametros nulos y estructura, etc

    const personaDB = await getPersonaByOID(oidPersona);
    if (!personaDB) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a una persona, envíelo nuevamente."
        }
    }

    const alumnoDB = await getAlumnoByOID(oidAlumno);
    if (!alumnoDB) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a un alumno, envíelo nuevamente."
        }
    }

    //TODO:verificar que la persona no tenga el rol antes
    const hermano = await asociarRolOID('hermano', datosHermano, oidPersona);
    if (hermano !== false) {
        //TODO: set hermanos
        const alumnoHermano = await updateAlumnoOID('hermanos', hermano._id, oidAlumno);
        if (alumnoHermano !== false) {
            response = {
                valido: true,
                message: "Se pudo crear el nuevo hermano y se asoció con su alumno.",
                hermano: hermano
            }
        } else {
            throw "No se pudo asociar el hermano con el alumno.";
            //TODO: eliminar el rol de hermano de la persona
        }
    } else {
        throw "No se pudo asociar el rol de hermano a la persona";
    }

    return response;
}

function datosBasicos(padre) {
    const datosBasicos = ['fechaNacimiento', 'nacionalidad',
        'telefono', 'ocupacion', 'relacionParentesco'];

    const valido = datosBasicos.every(atributo => {
        if (padre[atributo] === undefined) {
            //console.log(atributo + " No existe")
            return false;
        } else if (padre[atributo] === "") {
            //console.log(atributo + " Está Vacío")
            return false;
        } else return true
    });

    return valido;
}

/*async function padreValido(dni, oidAlumno) {
    //TODO: verificar que no tenga al mismo padre ya registrado el alumno
    //TODO: verificar que no tenga mas de 2 padres
    //FIXME: llevar todo a set padre en controller alumno
    let valido = true;

    const padres = await getPadres(oidAlumno);
    console.log("padres " + padres)

    /*if (padres !== false) {
         valido = await padres.every(async (padre) => {
            //let aux = ;
            if ((await getPadreByOID(padre)).dni !== dni) {
                console.log("no coincide")
                return true;
            } else {
                console.log("coincide")
                return false;
            }
        })
        console.log ("hola ");
    }*-/

    return false;
}*/

async function validarParametros(datosPadre, oidAlumno) {
    if (datosPadre === undefined) {
        return {
            exito: false,
            message: "Faltó enviar los datos del Padre."
        }
    } else if (oidAlumno === null || oidAlumno === "" || oidAlumno === undefined) {
        return {
            exito: false,
            message: "Faltó enviar OID Alumno."
        }
    } else if (!await getAlumnoByOID(oidAlumno)) {
        return {
            exito: false,
            message: "El OID recibido no corresponde a un alumno, envíelo nuevamente."
        }
    }
}

module.exports = {
    asociarPadre,
    createPadreNuevo,
    createPadreRol,
    asociarHermano,
    createHermanoNuevo,
    createHermanoRol,
}