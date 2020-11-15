'use strict'

const { getPadreByID, getPadreByOID } = require("./padre");
const { updateAlumnoOID, getAlumnoByOID, getPadres } = require("./alumno");
const { createPersona, deletePersonaOID } = require("./persona");

const asociarPadre = async (dniPadre, oidAlumno) => {
    //TODO: buscar al padre, si existe lo une y lo retorna despues, si no existe devuelve mensaje
    let actualizoAlumno = false;
    let response = {
        valido: false,
        message: "No existe el padre, no se pudo asociar con el alumno"
    };

    if (oidAlumno === undefined) {
        throw "Error de formato, envíe el OID del alumno."
    }

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

//TODO: ver nombres
/**
 * metodo que registra un padre nuevo, cuando la persona no existe, crea la persona con rol padre y asocia el alumno con el padre.
 * retorna el nuevo padre registrado * 
 * @param {*} datosPadre 
 * @param {*} oidAlumno 
 */
const createPadreNuevo = async (datosPadre, oidAlumno) => {

    //TODO: refactor, para error handler
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

    const { dni, nombre, apellido, genero, fechaNacimiento, partidaNacimiento, nacionalidad,
        telefono, ocupacion, lugarTrabajo, telefonoLaboral, bautismo, comunion,
        confirmación, egresoPrimario, egresoSecundario, relacionParentesco } = datosPadre;

    const persona = { dni, nombre, apellido, genero };

    const padre = {
        fechaNacimiento, partidaNacimiento, nacionalidad,
        telefono, ocupacion, lugarTrabajo, telefonoLaboral, bautismo, comunion,
        confirmación, egresoPrimario, egresoSecundario, relacionParentesco
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
    } else if (!await padreValido(dni, oidAlumno)) {
        console.log("invalido")
        return {
            exito: false,
            message: "El alumno, ya posee un padre con el dni recibido"
        }
    }

    const personaDB = await createPersona(persona, 'padre', padre);
    //TODO: controlar cuando no puede crear la persona

    //FIXME: llevar a setPadre
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

const createPadreRol = async (datosPadre, datosPersona, oidAlumno) => {
    //TODO: validar los datos de la persona, agregar los datos del pad
}


const asociarHermano = async (dniHermano, dniAlumno) => {
    //TODO: buscar al hermano, si existe lo une y lo retorna despues, si no existe devuelve mensaje
}

const createHermano = async (hermano, dniAlumno) => {
    //TODO: buscar la persona, si existe agregar nuevo rol y asocia con al; sino crea, asigna y asocia con alumno

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

module.exports = {
    asociarPadre,
    createPadreNuevo,
    createPadreRol,
    asociarHermano,
    createHermano
}