'use strict'

let Curso = require('../models/curso.model');

const createCurso = async (curso) => {
    const { anio, division, cicloLectivo, dictados, alumnos, preceptor } = curso;

    const newCurso = new Curso({
        anio,
        division,
        cicloLectivo,
        dictados,
        alumnos,
        preceptor,
    });


    const cursoDB = await newCurso.save()

    return cursoDB;
}

const getCursoAlumno = async (cicloLectivo,oidAlumno) => {
    //Devuelvo el curso correspondiente al alumno con el oid 
    
    const cursoAlumno = await Curso.find({"cicloLectivo":cicloLectivo,"alumnos":{$in:[oidAlumno]}});
    return cursoAlumno
}
module.exports = {
    createCurso,
    getCursoAlumno
}