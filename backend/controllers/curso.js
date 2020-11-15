'use strict';

const Curso = require('../models/curso.model');

const { getCicloLectivo } = require('./ciclo-lectivo');

const createCurso = async (anio) => {
    
    // anio es el anio del curso que se quiere crear, por ej matematica puede ser de 1, 2, etc..

    cicloLectivo = getCicloLectivo();

    cursos = getCursosCicloLectivo(cicloLectivo);

    let preceptores = [];

    for (let i = 0; i < cursos.length; i++) {
        preceptores.push(cursos[i].preceptor);
    }

    const preceptor // = consultar preceptores not in preceptores[]

    // obtener divisiones del curso

    const division // = cursos[cursos.lenght] + 1

    // buscar las materias del anio

    // obtener bloques de horario

    // obtener profesores que pueden dar la materia

    // crear el dictado de los cursos //

    const curso = new Curso({
        anio, // anio del colegio
        division,
        cicloLectivo, // anio en que estamos
        preceptor,        
        // dictados,
        // alumnos,
    });

    const cursoDB = await curso.save();

    return cursoDB;

}



const getCursosCicloLectivo = async (anioCiclo) => {
    
    const cursosCiclo = await Curso.find({ cicloLectivo : anioCiclo })
    
    return cursosCiclo

}



module.exports = {
    createCurso,
    getCursosCicloLectivo
}