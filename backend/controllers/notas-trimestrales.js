'use strict'

const Curso = require('../models/curso.model');
const Dictado = require('../models/dictado.model');
const Alumno = require('../models/alumno.model');

const { BadRequest, NotFound } = require('../middlewares/errores');

const { getCicloLectivo } = require('./ciclo-lectivo');


const getCursos = async (trimestre) => {
    
    const cicloLectivo = await getCicloLectivo();

    const hoy = new Date();
    let enFecha = true;
    let fechaCierre

    switch (trimestre) {
        case '1':
            fechaCierre = cicloLectivo.fechaCiere1T;
            enFecha = hoy <= fechaCierre;
            break;
        case '2':
            fechaCierre = cicloLectivo.fechaCiere2T;
            enFecha = hoy <= fechaCierre;
            break;
        case '3':
            fechaCierre = cicloLectivo.fechaCiere3T;
            enFecha = hoy <= fechaCierre;
            break;
        default:
            throw new BadRequest(`El trimestre ${trimestre} es incorrecto`);
    }

    if ( !enFecha ) throw new BadRequest("Cierre de trimestre en fuera de termino");
    
    const cursosCicloLectivo = await getCursosCicloLectivo(cicloLectivo.cicloLectivo);
    if ( cursosCicloLectivo.length === 0 ) throw new NotFound("No se encontraron cursos para el ciclo lectivo");

    return cursosCicloLectivo;
}

const getDetalleCurso = async (idCurso) => {

    const curso = await Curso.findById(idCurso).populate({ path : 'dictados' }).populate({ path : 'materia'});
    if ( !curso ) throw new NotFound("No se encontró el curso solicitado");

    return curso;

}

const calcularPresentismo = async (idDictado, idAlumno) => {

    let response = true;

    let alumno = await Alumno.findById( idAlumno, 'presentismos');
    if ( !alumno ) throw new NotFound("No se encontró el alumno solicitado");
    
    let cant = await Dictado.findById( idDictado, 'bloquesDictados');
    if ( !cant ) throw new NotFound("No se encontró el dictado solicitado");

    let bloquesDictados = cant.bloquesDictados;
    let cantInasistencias = 0.0;

    alumno.presentismos = alumno.presentismos.filter( presentismo => presentismo.inasistencia.dictado == idDictado);

    for ( let i = 0 ; i < alumno.presentismos.length ; i++ ) {

        if ( alumno.presentismos[i].inasistencia.estado == 'injustificada' ) {
            cantInasistencias +=  alumno.presentismos[i].inasistencia.valor;
        }
    }

    const porcentaje =  cantInasistencias / bloquesDictados;

    if ( porcentaje > 0.25 ) {
        response = false;
        return response;
    }

    return response;

}

const registrarNotasTrimestrales = async (idAlumno, trimestre, notaTrimestre, idDictado) => {

    let alumnoDB;

    switch (trimestre) {
        case '1':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota1T": notaTrimestre} });
            if (alumnoDB.n === 0 ) throw new BadRequest('Error al Registrar nota de 1º trimestre');
            break;
        case '2':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota2T": notaTrimestre} });
            if (alumnoDB.n === 0 ) throw new BadRequest('Error al Registrar nota de 2º trimestre');
            break;
        case '3':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota3T": notaTrimestre} });
            if (alumnoDB.n === 0 ) throw new BadRequest('Error al Registrar nota de 3º trimestre');
            break;
        default:
            throw new BadRequest(`El trimestre ${trimestre} es incorrecto`);
    }

    return true;

}


const getCursosCicloLectivo = async (anioCiclo) => {
    
    const cursosCiclo = await Curso.find({ cicloLectivo : anioCiclo })

    return cursosCiclo;

}



module.exports = {
    registrarNotasTrimestrales,
    getCursos,
    getDetalleCurso,
    calcularPresentismo,
    registrarNotasTrimestrales
}