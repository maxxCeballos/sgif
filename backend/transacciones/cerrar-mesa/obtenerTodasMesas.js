'use strict';

const { getAllMesasExamen } = require("../../controllers/mesaExamen");
const { getDictadoByOid } = require("../../controllers/dictado");

/**
 * Devuelve todas las mesas completadas y previas a la fecha de hoy para que el usuario seleccione una para cerrar
 *  
 * @returns arreglo con datos de [(oid, acta, fecha y hora, aula y datos de dictado)] para cada mesa
 */
const obtenerTodasMesas = async () => {
    const mesas = await getAllMesasExamen();

    if (mesas.length === 0) {
        throw "No hay mesas";
    }

    // Busca las mesas completadas y con la fecha adecuada
    const fechaHoy = new Date();
    const mesasCompletadas = mesas.find(mesa =>
        mesa.fechaHora < fechaHoy && mesa.estado === "Completada");
    if (mesasCompletadas - length === 0) {
        throw "No hay mesas";
    }

    let response = await getDatosResponse(mesasCompletadas);
    return response;
}

async function getDatosResponse(mesas) {
    let mesasResponse = [];

    for (const mesa of mesas) {
        const dictado = await getDictadoByOid(mesa.dictado);
        let mesaIndivResponse = {
            oidMesa: mesa._id,
            acta: mesa.acta,
            fechaHora: String(mesa.fechaHora),
            aula: mesa.aula,
            cicloLectivoMateria: dictado.cicloLectivo,
            nombreMateria: dictado.materia.nombre,
            anioMateria: dictado.materia.anio,
        };
        mesasResponse.push(mesaIndivResponse);
    }

    return mesaResponse;
}

module.exports = obtenerTodasMesas;