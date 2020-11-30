'use strict'

const Curso = require('../models/curso.model');
const Dictado = require('../models/dictado.model');
const Alumno = require('../models/alumno.model');

const { getCicloLectivo } = require('./ciclo-lectivo');

const registrarNotasTrimestrales = async (curso) => {    

    // obtener calificaciones del alumno del dictado seleccionado

    // obtener horarios del dictado

    // obtener inasistencias trimestrales al dictado

    // calcular porcentajes de inasistencias

    // actualizar notas trimestrales

    // save nota trimestral
}

const getCursos = async () => {
    
    const cicloLectivo = await getCicloLectivo();

    // validar fecha de cierre. ? obtener fecha del sistema y comparar que este entre las fechas definidas en ciclo lectivo.
    
    const cursosCicloLectivo = await getCursosCicloLectivo(cicloLectivo.cicloLectivo)

    return cursosCicloLectivo;
}

const getDetalleCurso = async (idCurso) => {

    const detalle = await Curso.findById(idCurso, 'dictados');

    const dictados = detalle.dictados

    const dictadosDB = [];

    for ( let i = 0 ; i < dictados.length ; i++ ) {

        let dictado = await Dictado.findById(dictados[i]).populate({ path : 'materia'});

        dictadosDB.push(dictado);

    }

    return dictadosDB;

}


const getCursosCicloLectivo = async (anioCiclo) => {
    
    const cursosCiclo = await Curso.find({ cicloLectivo : anioCiclo })

    return cursosCiclo;

}


const getNotasHorariosDictado = async (idDictado) => {

    const notas = await Alumno.find({ 'calificaciones' : {$elemMatch: {dictado: idDictado}}})

    const horarios = await Dictado.findById(idDictado, 'horarios');

    const response = {
        notas,
        horarios: horarios.horarios
    }

    return response;
}






module.exports = {
    registrarNotasTrimestrales,
    getCursos,
    getDetalleCurso,
    getNotasHorariosDictado,
}