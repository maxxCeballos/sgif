'use strict';

const { getMesaExamenByOid } = require("../../controllers/mesaExamen");
const { getResultadoMesaByOid } = require("../../controllers/resultadoMesa");
const { getAlumnoByOid } = require("../../controllers/alumno");

/**
 * Devuelve un arreglo con la información de la mesa, junto con datos de los alumnos que se han inscripto a ellas
 * 
 * @param {*} acta el numero de acta de la mesa
 * 
 * @returns [(datos de cada alumno inscripto)]
 */
const obtenerAlumnosMesa = async (oidMesa) => {
    const mesaExamen = await getMesaExamenByOid(oidMesa);

    if (!mesaExamen) {
        throw {
            status: 204,
            message: "No existe la mesa"
        };
    }

    let alumnos = [];

    for (const oidResultado of mesaExamen.resultados) {
        const resultado = await getResultadoMesaByOid(oidResultado);
        const alumno = await getAlumnoByOid(resultado.alumno);
        alumnos.push({
            oidResultado: resultado._id,
            oidAlumno: alumno._id,
            nombre: alumno.nombre,
            apellido: alumno.apellido,
            legajo: alumno.legajo,
        });
    }
    
    return alumnos;
}

module.exports = obtenerAlumnosMesa;