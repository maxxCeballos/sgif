'use strict';

const { getAlumnoByLegajo } = require('../../controllers/alumno');
const { getResultadoMesaByOid } = require('../../controllers/resultadoMesa');
const { getMesaExamenByOid } = require('../../controllers/mesaExamen');
const { getDictadoByOid } = require('../../controllers/dictado');
const { verificarLegajo } = require('../../utils/verificaciones');

//TODO: Pensar implementacion de errores (codigo con global tipo Error.TIPO1, mensaje por defecto y expandido)

/**
 * Busca los dictados de las calificaciones desaprobadas del Alumno recibido,
 * verificando que el alumno no haya estado ausente en una mesa del mes anterior
 * 
 * @param {String} legajoAlumno legajo del Alumno a buscar
 * 
 * @returns objeto con arreglo de dictados: dictadosDesaprobados = {
 *      dictados: [{nombreMateria, anioMateria, cicloLectivo},],
 *  }
 */
const obtenerDictados = async (legajoAlumno) => {
    if (!verificarLegajo(legajoAlumno)) {
        throw "El Legajo no es Correcto";
    }

    let alumno = (await getAlumnoByLegajo(legajoAlumno))[0];

    //FIXME: necesito verificar inscripcion?
    if (!alumno) {
        throw "No existe el Alumno";
    } else if (!alumno.calificaciones || alumno.calificaciones.length === 0) {
        throw "Alumno sin Calificaciones";
    }

    let calificacionesDesaprobadas = getCalificacionesDesaprobadas(alumno)

    if (noTieneCalificacionesDesaprobadas(calificacionesDesaprobadas)) {
        throw "Alumno sin Calificaciones Desaprobadas";
    }

    let idMesaAusente = await getMesaAusenteMesPasado(calificacionesDesaprobadas);

    if (idMesaAusente) {
        throw "Alumno estuvo Ausente en la Ultima Mesa con id: " + idMesaAusente;
    }

    let dictadosDesaprobados = await getDictadosDesaprobados(calificacionesDesaprobadas);

    return dictadosDesaprobados;
}

// TODO: agregar el id de alumno
/**
 * Devuelve dictados con el formato {id, nombreMateria, anioMateria, cicloLectivo} de un conjunto de calificaciones
 */
async function getDictadosDesaprobados(calificacionesDesaprobadas) {
    let dictadosDesaprobados = {
        dictados: [],
    };

    for (const calificacion of calificacionesDesaprobadas) {
        let objetoDictado = await getDictadoByOid(calificacion.dictado);

        let nuevoDictado = {
            id: objetoDictado._id,
            nombreMateria: objetoDictado.materia.nombre,
            anioMateria: objetoDictado.materia.anio,
            cicloLectivo: objetoDictado.cicloLectivo,
        };
        dictadosDesaprobados.dictados.push(nuevoDictado);
    }
    return dictadosDesaprobados;
}

function noTieneCalificacionesDesaprobadas(calificacionesDesaprobadas) {
    return calificacionesDesaprobadas.length === 0;
}

function getCalificacionesDesaprobadas(alumno) {
    return alumno.calificaciones.filter(
        calificacion => calificacion.condicion === "Desaprobado"
    );
}

/**
 * Busca si un resultado de mesa del mes anterior es ausente
 *  
 * @returns el oid del resultado mesa que fue ausente en el mes pasado
 * o undefined
 */
async function getMesaAusenteMesPasado(calificacionesDesaprobadas) {
    let i = 0;
    let MesaAusente = true;

    while (i < calificacionesDesaprobadas.length && MesaAusente) {
        MesaAusente = await estuvoAusenteCalificacionIndiv(calificacionesDesaprobadas[i]);
        i++;
    }
    return MesaAusente;
}

async function estuvoAusenteCalificacionIndiv(unaCalificacion) {
    let resultadoMesasExamen = unaCalificacion.resultadoMesaExamen;

    let i = 0;
    let result = false;
    while (i < resultadoMesasExamen.length && !result) {
        result = await estuvoAusenteMesaIndiv(resultadoMesasExamen[i]);
        i++;
    }

    if (result) {
        return resultadoMesasExamen[i - 1];
    } else {
        return undefined;
    }
}

async function estuvoAusenteMesaIndiv(oidResultado) {
    let objetoResultado = await getResultadoMesaByOid(oidResultado);
    let objetoMesa = await getMesaExamenByOid(objetoResultado.mesaDeExamen);

    return (objetoResultado.condicion === "Ausente"
        && (esDeMesPasado(objetoMesa.fechaHora)) //FIXME: Verificar si es de mes - 1;
    )
}

function esDeMesPasado(fechaPrevia) {
    let hoy = new Date();

    if (!(fechaPrevia.getYear() < hoy.getYear())) {
        //FIXME: ver que pasa si es de este mes
        return fechaPrevia.getMonth() === hoy.getMonth() - 1;
    }

    return false;
}

module.exports = obtenerDictados