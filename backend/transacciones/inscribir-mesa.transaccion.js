'use strict';

const { } = require('../controllers/alumno');

const obtenerDictados = async (legajoAlumno) => {

    //TODO: verificar formatos
    if (!verificarFormato(legajoAlumno)) {
        //FIXME: expandir error
        throw err;
    }

    //TODO: buscar alumno

    //TODO: buscar sus calificaciones desaprobadas

    //TODO: verificar ausencia previa a mesa

    //TODO: obtener dictados

    //TODO: devolver dictados

}

const registrarMesa = async (legajoAlumno, dictado) => {

    //TODO: verificar formatos

    //TODO: buscar oid alumno y dictado 

    //TODO: buscar mesa si existe

    //TODO: crear mesa o asociarlo a una

    //TODO: crear resultado

    //TODO: return notificar mesa: 
    //solicitada - solo mensaje / completada - fecha, hora, aula, etc

}

module.exports = {
    obtenerDictados,
    registrarMesa,
}