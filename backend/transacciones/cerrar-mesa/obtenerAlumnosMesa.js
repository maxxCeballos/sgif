'use strict';

const { getMesaExamenByActa } = require("../../controllers/mesaExamen");
const { getResultadoMesaByOid } = require("../../controllers/resultadoMesa");
const { getDictadoByOid } = require("../../controllers/dictado");
const { getAlumnoByOid } = require("../../controllers/alumno");

/**
 * Devuelve un arreglo con la información de la mesa, junto con datos de los alumnos que se han inscripto a ellas
 * 
 * @param {*} acta el numero de acta de la mesa
 * 
 * @returns [(acta, fecha y hora, aula, datos de dictado y datos de cada alumno inscripto)]
 */
const obtenerMesa = async (oidMesa) => {
    const mesaExamen = (await getMesaExamenByActa(acta))[0];

    if (!mesaExamen) {
        throw "No existe Mesa";
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

async function getDatosResponse(mesaExamen) {
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

module.exports = obtenerMesa;