'use strict'

const Curso = require('../models/curso.model');
const Dictado = require('../models/dictado.model');
const Alumno = require('../models/alumno.model');

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
            return { message: "trimestre incorrecto" };
    }

    if ( !enFecha ) {
        return { message: "Cierre de trimestre en fuera de termino" };
    }
    
    const cursosCicloLectivo = await getCursosCicloLectivo(cicloLectivo.cicloLectivo);

    return cursosCicloLectivo;
}

const getDetalleCurso = async (idCurso) => {

    const curso = await Curso.findById(idCurso).populate({ path : 'dictados' }).populate({ path : 'materia'});

    // si no existe curso entonces error

    return curso;

}

const calcularPresentismo = async (idDictado, idAlumno) => {

    let response;

    let alumno = await Alumno.findById( idAlumno, 'presentismos');
    let cant = await Dictado.findById( idDictado, 'bloquesDictados');

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
        return response = "debe rendir examen complementario";
    }

    return response = "ingrese nota";

}

const registrarNotasTrimestrales = async (idAlumno, trimestre, notaTrimestre, idDictado) => {

    let alumnoDB;

    switch (trimestre) {
        case '1':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota1T": notaTrimestre} });
            break;
        case '2':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota2T": notaTrimestre} });
            break;
        case '3':
            alumnoDB = await Alumno.update({ "_id" : idAlumno, "calificaciones.dictado": idDictado }, { $set : {"calificaciones.$.nota3T": notaTrimestre} });
            break;
        default:
            return { message: "trimestre incorrecto" };
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