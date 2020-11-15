'use strict';

const { getMesaExamenByActa, getMesaExamenByOid } = require("../../controllers/mesaExamen");
const { getDictadoByOid } = require("../../controllers/dictado");
const { getAlumnoByOid } = require("../../controllers/alumno");

/**
 * Devuelve un arreglo con la información de la o las mesas (en caso que tenga asociada), junto con datos de los alumnos que se han inscripto a ellas
 * 
 * @param {*} acta el numero de acta de la mesa
 * 
 * @returns cada mesa incluye (acta, fecha y hora, aula, datos de dictado y datos de cada alumno inscripto)
 */
const obtenerAlumnosMesas = async (acta) => {
    //TODO: Verificar acta
    if (!verificarActa(acta)) {
        throw "El acta no es valida";
    }

    //TODO: obtener mesa con acta
    const mesa = (await getMesaExamenByActa(acta))[0];

    if (!mesa) {
        throw "No existe la Mesa";
    }

    //TODO: verificar q mesa sea Completada y fecha (ver carteles de error en transaccion)
    if (mesa.estado !== "Completada") {
        throw `La mesa no se puede cerrar, esta en estado ${mesa.estado}`;
    }

    const hoy = new Date();
    if (mesa.fechaHora < hoy) {
        throw 'La mesa no se puede cerrar, aún no fue evaluada';
    }

    //TODO: primero cargo la response de la mesa q se solicito y despues todas las asociadas cada una con su dictado
    let response = [];

    let mesaResponse = await getDatosResponse(mesa);

    response.push(mesaResponse);

    if (mesa.esCompartida) {
        await agregarInfoAsociadas(mesa, response);
    }

    return response;
}

async function agregarInfoAsociadas(mesa, response) {
    let padre = mesa;
    if (!mesa.esPadre) {
        // Si no es el padre, lo obtengo de su asociacion
        padre = (await getMesaExamenByOid(mesa.asociadas[0]))[0];
    }

    for (const mesaAsociada of padre.asociadas) {
        let mesaAsociadaResponse = await getDatosResponse(mesaAsociada);
        response.push(mesaAsociadaResponse);
    }
}

async function getDatosResponse(mesa) {
    const dictado = await getDictadoByOid(mesa.dictado);
    let alumnos = [];

    for (const resultado of mesa.resultados) {
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
        oidMesa: mesa._id,
        acta: mesa.acta,
        fechaHora: mesa.fechaHora,
        aula: mesa.aula,
        cicloLectivoMateria: dictado.cicloLectivo,
        nombreMateria: dictado.materia.nombre,
        anioMateria: dictado.materia.anio,
        alumnos,
    };
    return mesaResponse;
}

module.exports = obtenerAlumnosMesas;