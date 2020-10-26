'use strict';

const { getAlumnoByLegajo } = require('../../controllers/alumno');
const { createResultadoMesa } = require('../../controllers/resultadoMesa');
const { getMesaByDictado } = require('../../controllers/mesaExamen');
const { getDictadoByParams } = require('../../controllers/dictado');
const { verificarLegajo } = require('../../utils/legajo');

//TODO: Pensar implementacion de errores (codigo con global tipo Error.TIPO1, mensaje por defecto y expandido)

const registrarMesa = async (legajoAlumno, valoresDictado) => {
    //TODO: verificar formatos
    if (!verificarLegajo(legajoAlumno)) {
        throw "El Legajo no es Correcto";
    }

    if (!verificarDictado(valoresDictado)) {
        throw "El Dictado no es Correcto";
    }

    //TODO: buscar oid alumno y dictado 
    let alumno = (await getAlumnoByLegajo(legajoAlumno))[0];
    let dictado = (await getDictadoByParams(valoresDictado))[0];

    //TODO: buscar mesa si existe
    let mesaDeExamen = (await getMesaByDictado(dictado))[0];

    //TODO: crear mesa o asociarlo a una
    if (mesaDeExamen) {
        // Si existe mesa lo asocio
    } else {
        // Si no existe la creo
    }

    //TODO: crear resultado
    let resultadoMesa = {
        // Poner datos de resultado mesa
    }
    let responseResultado = await createResultadoMesa(resultadoMesa);

    // Si el resultado dio mal
    if(responseResultado){
        throw "Error al Inscribirse a la Mesa"
    }
    
    //TODO: return notificar mesa: 
    //solicitada - solo mensaje / completada - fecha, hora, aula, etc
    let response = {
        // Poner lo q hay q retornar
    }

    return response;
}


module.exports = registrarMesa