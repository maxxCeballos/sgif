'use strict';

const { getAlumnoByLegajo } = require('../../controllers/alumno');
const { createResultadoMesa } = require('../../controllers/resultadoMesa');
const { getMesaExamenByDictado, addResultadoMesa } = require('../../controllers/mesaExamen');
const { getDictadoByParams } = require('../../controllers/dictado');
const { verificarLegajo, verificarDictado } = require('../../utils/verificaciones');

//TODO: Pensar implementacion de errores (codigo con global tipo Error.TIPO1, mensaje por defecto y expandido)

const registrarMesa = async (legajoAlumno, valoresDictado) => {
    let fueCreada = false;

    //TODO: verificar formatos
    if (!verificarLegajo(legajoAlumno)) {
        throw "El Legajo no es Correcto";
    }

    if (!verificarDictado(valoresDictado)) {
        throw "El Dictado no es Correcto";
    }

    //TODO: buscar oid alumno y dictado 
    let objAlumno = (await getAlumnoByLegajo(legajoAlumno))[0];
    let objDictado = (await getDictadoByParams(valoresDictado))[0];

    //FIXME: ver q alumno y dictado existen

    //TODO: buscar mesa si existe
    let objMesaDeExamen = (await getMesaExamenByDictado(dictado))[0];

    //TODO: crear mesa si no existe
    if (!objMesaDeExamen) {       
        // Si no existe la creo

        // FIXME: generar acta
        let acta = 1000;

        let nuevaMesa = {
            acta,
            estado: "Solicitada",
            dictado: objDictado._id,
            //FIXME: crear resultado primero
            resultados: [objResultado._id],
            esCompartida: false
        }

        fueCreada = true;
    }

    //TODO: crear resultado
    let resultadoMesa = {
        alumno: objAlumno._id,
        mesaDeExamen: objMesaDeExamen._id,
    }
    let responseResultado = await createResultadoMesa(resultadoMesa);

    // Si el resultado dio mal
    if (responseResultado) {
        throw "Error al Inscribirse a la Mesa"
    }

    //TODO: asociar resultado a mesa

    //FIXME: get id de resultado mesa
    let responseAgregarResultado = await addResultadoMesa(objMesaDeExamen._id, resultadoMesa._id);

    //TODO: return notificar mesa AGREGAR ACTA: 
    //solicitada - solo mensaje / completada - fecha, hora, aula, etc
    let response = {
        mensaje: "Inscripción Exitosa, será notificado cuando se establezca fecha, hora y aula"
    }
    if(!fueCreada){
        response = {
            mensaje: "Inscripción Exitosa",
            fechaHora: objMesaDeExamen.fechaHora,
            aula: objMesaDeExamen.aula,
        }
    }
    return response;
}


module.exports = registrarMesa