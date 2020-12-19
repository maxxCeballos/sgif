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
 * @returns (acta, fecha y hora, aula, datos de dictado y datos de cada alumno inscripto)
 */
const obtenerMesa = async (acta) => {
    const mesaExamen = (await getMesaExamenByActa(acta))[0];

    if (!mesaExamen) {
        throw "No existe Mesa";
    }

    if (mesaExamen.estado !== "Completada") {
        throw `La mesa no se puede cerrar, esta en estado ${mesaExamen.estado}`;
    }

    const hoy = new Date();

    if (mesaExamen.fechaHora > hoy) {
        throw 'La mesa no se puede cerrar, aún no fue evaluada';
    }

    let response = await getDatosResponse(mesaExamen);

    return response;
}

async function getDatosResponse(mesaExamen) {
    const dictado = await getDictadoByOid(mesaExamen.dictado);
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

    let mesaResponse = {
        oidMesa: mesaExamen._id,
        acta: mesaExamen.acta,
        fechaHora: String(mesaExamen.fechaHora),
        aula: mesaExamen.aula,
        cicloLectivoMateria: dictado.cicloLectivo,
        nombreMateria: dictado.materia.nombre,
        anioMateria: dictado.materia.anio,
        alumnos,
    };
    return mesaResponse;
}

module.exports = obtenerMesa;