'use strict'

const asociarPadre = async (dniPadre, dniAlumno) => {
    //TODO: buscar al padre, si existe lo une y lo retorna despues, si no existe devuelve mensaje
}

const createPadre = async (padre, dniAlumno) => {
    //TODO: buscar la persona, si existe agregar nuevo rol y asocia con al; sino crea asigna y asocia con alumno

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