'use strict';

const { getAlumnoByLegajo, addResultadoMesa: addResultadoMesaAlumno } = require('../../controllers/alumno');
const { createResultadoMesa, updateResultadoMesa } = require('../../controllers/resultadoMesa');
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

    //TODO: crear resultado
    let responseResultado = await createResultadoMesa({ alumno: oidAlumno });

    // Si el resultado dio mal
    if (!responseResultado) {
        throw "Error al Inscribirse a la Mesa"
    }

    //TODO: buscar mesa si existe y no esta cerrada
    let objMesaDeExamen = await getMesaExamenByDictado(valoresDictado.id);
    let acta;

    //TODO: crear mesa si no existe o asociarla
    if (!objMesaDeExamen) {
        // Si no existe la creo
        acta = await generarNumActa();

        let nuevaMesa = {
            acta,
            estado: "Solicitada",
            dictado: valoresDictado.id,
            resultados: [responseResultado._id],
            esCompartida: false
        }

        objMesaDeExamen = await createMesaExamen(nuevaMesa);
        fueCreada = true;
    } else {
        acta = objMesaDeExamen.acta;
        let responseAddResultadoMesa = await addResultadoMesa(
            objMesaDeExamen._id, responseResultado._id);

        // Si el resultado dio mal
        if (!responseAddResultadoMesa) {
            throw "Error al Inscribirse a la Mesa"
        }
    }
    //TODO: asociar resultado al alumno
    let responseAgregarResultadoAlumno = await addResultadoMesaAlumno(
        oidAlumno, valoresDictado.id, responseResultado._id);

    if (!responseAgregarResultadoAlumno) {
        throw "Error al Inscribirse a la Mesa"
    }

    let responseAsociarMesaResultado = await updateResultadoMesa(
        responseResultado._id, { mesaDeExamen: objMesaDeExamen._id });

    if (!responseAsociarMesaResultado) {
        throw "Error al Inscribirse a la Mesa"
    }

    //TODO: return notificar mesa AGREGAR ACTA: 
    return generarResponse(acta, fueCreada, objMesaDeExamen);
}

/**
 * solicitada - solo mensaje / completada - fecha, hora, aula, etc
 */
function generarResponse(acta, fueCreada, objMesaDeExamen) {
    let response = {
        acta,
        mensaje: "Inscripción Exitosa, será notificado cuando se establezca fecha, hora y aula"
    };

    if (!fueCreada) {
        response = {
            acta,
            mensaje: "Inscripción Exitosa",
            fechaHora: String(objMesaDeExamen.fechaHora),
            aula: objMesaDeExamen.aula,
        };
    }
    return response;
}

/**
 * Genera un numero de acta que no sea utilizado por otra
 */
async function generarNumActa() {
    // let numActa;
    // let encontroMesa;

    // do {
    //     numActa = 1000 + Math.round(Math.random() * 1000);
    //     encontroMesa = await getMesaExamenByOid(numActa);
    // } while (encontroMesa);

    // return numActa;
    return 5010;
}

module.exports = registrarMesa;
