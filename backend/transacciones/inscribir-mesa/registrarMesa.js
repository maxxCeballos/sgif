'use strict';

const { getAlumnoByLegajo, addResultadoMesa: addResultadoMesaAlumno } = require('../../controllers/alumno');
const { createResultadoMesaBasico } = require('../../controllers/resultadoMesa');
const { createMesaExamen, getMesaExamenByDictado, addResultadoMesa, getMesaExamenByOid } = require('../../controllers/mesaExamen');
const { getDictadoByParams } = require('../../controllers/dictado');
const { verificarLegajo, verificarDictado } = require('../../utils/verificaciones');

//TODO: Pensar implementacion de errores (codigo con global tipo Error.TIPO1, mensaje por defecto y expandido)

const registrarMesa = async (oidAlumno, valoresDictado) => {
    let fueCreada = false;

    //TODO: verificar formatos
    if (!verificarDictado(valoresDictado)) {
        throw "El Dictado no es Correcto";
    }

    //TODO: verificar que el alumno tenga el dictado
    
    //TODO: crear resultado
    let responseResultado = await createResultadoMesaBasico(oidAlumno);

    // Si el resultado dio mal
    if (!responseResultado) {
        throw "Error al Inscribirse a la Mesa"
    }

    //TODO: buscar mesa si existe y no esta cerrada
    let objMesaDeExamen = (await getMesaExamenByDictado(dictado))[0];

    //TODO: crear mesa si no existe o asociarla
    if (!objMesaDeExamen) {
        // Si no existe la creo
        let acta = await generarNumActa();

        let nuevaMesa = {
            acta,
            estado: "Solicitada",
            dictado: objDictado._id,
            //FIXME: crear resultado primero
            resultados: [responseResultado._id],
            esCompartida: false
        }

        //TODO: Crear mesa

        fueCreada = true;
    } else {
        //TODO: esta mal, fijarse
        let responseAddResultadoMesa = await addResultadoMesaAlumno(
            objMesaDeExamen._id, responseResultado._id);

        // Si el resultado dio mal
        if (responseAddResultadoMesa) {
            throw "Error al Inscribirse a la Mesa"
        }
    }

    //TODO: asociar resultado al alumno
    let responseAgregarResultadoAlumno = await addResultadoMesaAlumno(
        oidAlumno, responseResultado._id);

    if (responseAgregarResultadoAlumno) {
        throw "Error al Inscribirse a la Mesa"
    }

    //TODO: return notificar mesa AGREGAR ACTA: 
    return generarResponse(fueCreada, objMesaDeExamen);
}

/**
 * solicitada - solo mensaje / completada - fecha, hora, aula, etc
 */
function generarResponse(fueCreada, objMesaDeExamen) {
    let response = {
        mensaje: "Inscripción Exitosa, será notificado cuando se establezca fecha, hora y aula"
    };

    if (!fueCreada) {
        response = {
            mensaje: "Inscripción Exitosa",
            fechaHora: objMesaDeExamen.fechaHora,
            aula: objMesaDeExamen.aula,
        };
    }
    return response;
}

/**
 * Genera un numero de acta que no sea utilizado por otra
 */
async function generarNumActa() {
    let numActa;

    do {
        numActa = 1000 + Math.round(Math.random() * 1000);
        let encontroMesa = await getMesaExamenByOid(numActa);
    } while (encontroMesa);

    return numActa;
}

module.exports = registrarMesa;
