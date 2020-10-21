'use strict';

const { getAlumnoByLegajo } = require('../controllers/alumno');
const { getResultadoMesaByOid } = require('../controllers/resultadoMesa');
const { getMesaExamenByOid } = require('../controllers/mesaExamen');
const { getDictadoByOid } = require('../controllers/dictado');

/**
 * Busca los dictados de las calificaciones desaprobadas del Alumno recibido,
 * verificando que el alumno no haya estado ausente en una mesa del mes anterior
 * 
 * @param {*} legajoAlumno legajo del Alumno a buscar
 * 
 * @returns objeto con arreglo de dictados: dictadosDesaprobados = {
 *      dictados: [{nombreMateria, anioMateria, cicloLectivo},],
 *  }
 */
const obtenerDictados = async (legajoAlumno) => {
    //TODO: verificar formatos
    if (!verificarFormato(legajoAlumno)) {
        //FIXME: expandir error legajo malformado
        const err = {
            code: "error x"
        }
        throw err;
    }

    //TODO: buscar alumno
    let alumno = await getAlumnoByLegajo(legajoAlumno);

    if (!alumno) {
        //FIXME: expandir error alumno no encontrado
        throw err;
    }

    //TODO: buscar sus calificaciones desaprobadas
    let calificacionesDesaprobadas = alumno.calificaciones.filter(
        calificacion => calificacion.condicion === "Desaprobado"
    )

    //TODO: verificar ausencia previa a mesa
    if (calificacionesDesaprobadas.find(estuvoAusente)) {
        //FIXME: expandir error estuvo ausente a mesa
        throw err;
    }

    //TODO: obtener dictados
    //Tienen que tener {nombreMateria, anioMateria, cicloLectivo}
    let dictadosDesaprobados = {
        dictados: [],
    };

    calificacionesDesaprobadas.forEach(calificacion => {
        let objetoDictado = getDictadoByOid(calificacion.dictado);
        let nuevoDictado = {
            nombreMateria: objetoDictado.materia.nombre,
            anioMateria: objetoDictado.materia.anio,
            cicloLectivo: objetoDictado.cicloLectivo,
        }
        dictadosDesaprobados.dictados.push(nuevoDictado);
    })

    //TODO: devolver dictados
    return dictadosDesaprobados;
}

/**
 * Busca si un resultado de mesa del mes anterior es ausente
 * 
 * @param {*} element arreglo de OIDs de ResultadosMesas
 * 
 * @returns el oid del resultado mesa que fue ausente en el mes pasado
 * o undefined
 */
function estuvoAusente(element, index, array) {
    //Arreglo de OID de resultados
    let resultadosMesasExamen = element.resultadosMesas;

    const result = resultadosMesasExamen.find(function (oidResultado) {
        let objetoResultado = getResultadoMesaByOid(oidResultado);
        let objetoMesa = getMesaExamenByOid(objetoResultado.mesaDeExamen);

        return (objetoMesa.fechaHora //FIXME: Verificar si es de mes - 1;
            && objetoResultado.condicion === "Ausente");
    })

    return result;
}

const registrarMesa = async (legajoAlumno, dictado) => {

    //TODO: verificar formatos

    //TODO: buscar oid alumno y dictado 

    //TODO: buscar mesa si existe

    //TODO: crear mesa o asociarlo a una

    //TODO: crear resultado

    //TODO: return notificar mesa: 
    //solicitada - solo mensaje / completada - fecha, hora, aula, etc

}

module.exports = {
    obtenerDictados,
    registrarMesa,
}