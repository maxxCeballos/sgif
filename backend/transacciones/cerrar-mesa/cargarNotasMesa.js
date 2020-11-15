'use strict';

const { updateCalificacionAlumnoByOid, getAlumnoByOid } = require("../../controllers/alumno");
const { getMesaExamenByOid, updateMesaExamen } = require("../../controllers/mesaExamen");
const { updateResultadoMesa } = require("../../controllers/resultadoMesa");

/**
 * Carga las notas de una o varias mesas (si incluye asociadas)
 * 
 * Para cada mesa
 * {
 *  oidMesa,
 *  resultados: para cada result = {
 *      oidResult,
 *      oidAlumno,
 *      nota,
 *      condicion
 *  }
 * }
 * 
 * @param {*} mesasConNotas Arreglo donde cada instancia incluye una mesa y otro arreglo interno con resultados(id, nota y condicion) de cada alumno
 */
const cargarNotasMesa = async (mesasConNotas) => {

    for (const datosMesa of mesasConNotas) {
        //TODO: obtener mesa con oid para ver si existe
        const mesa = (await getMesaExamenByOid(datosMesa.oidMesa))[0];

        if (!mesa) {
            throw "No existe la Mesa";
        }

        if (mesa.resultados.length !== datosMesa.resultados.length) {
            throw "Existen resultados sin cargar";
        }

        let response = true;

        //TODO: obtener resultados con alumno y su calificacion
        for (const resultado of mesa.resultados) {
            // [resultado] es un oid
            const datosResultado = datosMesa.resultados.find(res => resultado === res.oidResult);

            if (!datosResultado) {
                throw "No se encontro resultado para: " + resultado;
            }

            if (datosResultado.condicion !== "Ausente") {
                if (datosResultado.nota >= 4) {
                    response = await modificarCondicionYNota(
                        response,
                        resultado,
                        "Aprobado",
                        datosResultado.nota);

                    let alumno = await getAlumnoByOid(datosResultado.oidAlumno);
                    
                    //FIXME: test
                    let calificacion = alumno.calificaciones.find(calificacion =>
                        calificacion.resultadoMesaExamen.find(resultado =>
                            resultado === datosResultado.oidResult))
                    calificacion = {
                        ...calificacion,
                        notaFinal: datosResultado.nota,
                        condicion: "Aprobado",
                    }

                    response = response && await updateCalificacionAlumnoByOid(
                        datosResultado.oidAlumno,
                        calificacion);
                } else {
                    response = await modificarCondicionYNota(
                        response,
                        resultado,
                        "Desaprobado",
                        datosResultado.nota);
                }
            } else {
                //FIXME: ver si condicion va como string o variable
                response = response && await updateResultadoMesa(
                    resultado,
                    "condicion",
                    datosResultado.condicion);
            }

            //TODO: cerrar mesa de examen (estado = "Cerrada")
            response = response && await updateMesaExamen(
                datosResultado.oidMesa,
                "estado",
                "Cerrada");
        }
    }
    return response;
}

async function modificarCondicionYNota(response, resultado, condicion, nota) {
    response = response && await updateResultadoMesa(
        resultado,
        "condicion",
        condicion);
    response = response && await updateResultadoMesa(
        resultado,
        "nota",
        nota);
    return response;
}

module.exports = cargarNotasMesa;

