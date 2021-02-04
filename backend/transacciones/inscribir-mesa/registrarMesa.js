'use strict';

const { addResultadoMesa: addResultadoMesaAlumno } = require('../../controllers/alumno');
const { createResultadoMesa, updateResultadoMesa } = require('../../controllers/resultadoMesa');
const { createMesaExamen, getMesaExamenByDictado, addResultadoMesa, getMesaExamenByOid } = require('../../controllers/mesaExamen');
const { verificarDictado } = require('../../utils/verificaciones');

//TODO limpiar si hay errores
const registrarMesa = async (oidAlumno, valoresDictado) => {
    let fueCreada = false;

    if (!verificarDictado(valoresDictado)) {
        throw {
            status: 204,
            message: "El Dictado no es Correcto"
        };
    }

    let responseResultado = await createResultadoMesa({ alumno: oidAlumno });

    // Si el resultado dio mal
    if (!responseResultado) {
        throw {
            status: 204,
            message: "Error al Inscribirse a la Mesa"
        };        
    }

    let objMesaDeExamen = await getMesaExamenByDictado(valoresDictado.id);
    let acta;

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

        if (!responseAddResultadoMesa) {
            throw {
                status: 204,
                message: "Error al Inscribirse a la Mesa"
            };    
        }
    }
    let responseAgregarResultadoAlumno = await addResultadoMesaAlumno(
        oidAlumno, valoresDictado.id, responseResultado._id);

    if (!responseAgregarResultadoAlumno) {
        throw {
            status: 204,
            message: "Error al Inscribirse a la Mesa"
        };    
    }

    let responseAsociarMesaResultado = await updateResultadoMesa(
        responseResultado._id, { mesaDeExamen: objMesaDeExamen._id });

    if (!responseAsociarMesaResultado) {
        throw {
            status: 204,
            message: "Error al Inscribirse a la Mesa"
        };    
    }

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
