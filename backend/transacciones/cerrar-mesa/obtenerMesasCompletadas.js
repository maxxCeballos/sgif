'use strict';

const { getAllMesasExamen, addResultadoMesa } = require("../../controllers/mesaExamen");

/**
 * Devuelve todas las mesas en estado "Completada" que sean de una fecha anterior al dia de hoy
 * 
 * @returns un JSON con las mesas en forma de arreglo
 */
const obtenerMesasCompletadas = async () => {
    const mesas = await getAllMesasExamen();
    const hoy = new Date();
    const mesasCompletadas = mesas.find(mesa =>
        mesa.estado === "Completada" && mesa.fechaHora < hoy
    );

    return { mesas: mesasCompletadas };
}

module.exports = obtenerMesasCompletadas;