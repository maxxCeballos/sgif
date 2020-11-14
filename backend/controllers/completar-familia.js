'use strict'

const { getPadreByID } = require("./padre")
const { updateAlumnoOID } = require("./alumno")

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
        //TODO: testear como si se agrega el nuevo padre al alumno        
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

const createPadre = async (datosPadre, dniAlumno) => {
    //TODO: buscar la persona, si existe agregar nuevo rol y asocia con al; sino crea asigna y asocia con alumno

    const { dni, nombre, apellido, genero, fechaNacimiento, partidaNacimiento, nacionalidad,
        telefono, ocupacion, lugarTrabajo, telefonoLaboral, bautismo, comunion,
        confirmación, egresoPrimario, egresoSecundario, relacionParentesco } = datosPadre;

    const persona = { dni, nombre, apellido, genero };

    const responsable = {}


}

const asociarHermano = async (dniHermano, dniAlumno) => {
    //TODO: buscar al hermano, si existe lo une y lo retorna despues, si no existe devuelve mensaje
}

const createHermano = async (hermano, dniAlumno) => {
    //TODO: buscar la persona, si existe agregar nuevo rol y asocia con al; sino crea, asigna y asocia con alumno

}


module.exports = {
    asociarPadre,
    createPadre,
    asociarHermano,
    createHermano
}