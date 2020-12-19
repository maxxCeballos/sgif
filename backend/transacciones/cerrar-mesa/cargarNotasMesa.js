'use strict';

const { updateCalificacionConResultado } = require("../../controllers/alumno");
const { getMesaExamenByOid, updateMesaExamenDatos } = require("../../controllers/mesaExamen");
const { updateResultadoMesa } = require("../../controllers/resultadoMesa");

/**
 * Carga las notas de una o varias mesas (si incluye asociadas)
 * 
 * [para cada result = {
 *      oidResultado,
 *      oidAlumno,
 *      nota,
 *      condicion
 *  }]
 */
const cargarNotasMesa = async (oidMesa, notas) => {
    const mesa = await getMesaExamenByOid(oidMesa);

    if (!mesa) {
        throw "No existe la Mesa";
    }

    if (mesa.resultados.length !== notas.length) {
        throw "Existen resultados sin cargar";
    }

    for (const datoNota of notas) {
        // [resultado] es un oid
        const resultado = mesa.resultados.find(res => String(datoNota.oidResultado) === String(res));

        if (!datoNota) {
            throw "No se encontro resultado para: " + resultado;
        }

        if (datoNota.condicion && datoNota.condicion === "Ausente") {
            let responseActualizarResultado = await updateResultadoMesa(
                resultado, { condicion: datoNota.condicion });

            if (!responseActualizarResultado) {
                throw "No se pudo cerrar la Mesa";
            }
        } else if (datoNota.nota >= 4) {
            // TODO: verificar q nota no sea mayor a 10 o menor a 1
            let responseActualizarResultado = await updateResultadoMesa(
                resultado, { condicion: "Aprobado", nota: datoNota.nota });

            if (!responseActualizarResultado) {
                throw "No se pudo cerrar la Mesa";
            }

            let responseActualizarAlumno = await updateCalificacionConResultado(
                datoNota.oidAlumno,
                datoNota.nota,
                "Aprobado",
                resultado);

            if (!responseActualizarAlumno) {
                throw "No se pudo cerrar la Mesa";
            }
        } else {
            let responseActualizarResultado = await updateResultadoMesa(
                resultado, { condicion: "Desaprobado", nota: datoNota.nota });

            if (!responseActualizarResultado) {
                throw "No se pudo cerrar la Mesa";
            }
        }
    }

    let responseActualizarResultado = await updateMesaExamenDatos(
        oidMesa, { estado: "Cerrada" });

    if (!responseActualizarResultado) {
        throw "No se pudo cerrar la Mesa";
    }

    return {
        mensaje: "Mesa Cerrada con Éxito"
    };
}

module.exports = cargarNotasMesa;

