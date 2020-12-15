'use strict';

const mongoose = require('mongoose');

const Curso = require('../models/curso.model');
const Materia = require('../models/materia.model');
const Horario = require('../models/horario.model');
const Persona = require('../models/persona.model');
const Dictado = require('../models/dictado.model');

const { BadRequest, NotFound } = require('../middlewares/errores');

const { getCicloLectivo } = require('./ciclo-lectivo');
const { getPreceptores } = require('../controllers/preceptor');
const { query } = require('express');

const createCurso = async (anio) => {

    let response = {};
    let division = 1;

    if ( anio < 1 || anio > 5 ) throw new BadRequest("año incorrecto, debe ser de 1 a 5");
    
    const cicloLectivo = await getCicloLectivo();
    const cursos = await getCursosCicloLectivo(cicloLectivo.cicloLectivo, anio);
    
    if ( cursos.length > 0 ){
    
        if (cursos[0].division > 2) throw new BadRequest(`ya existen 3 divisiones de ${anio}º año`);
        
        division = cursos[0].division + 1;
        
    } 

    const materias = await Materia.find({ anio : anio });
    if ( materias.length === 0 ) throw new NotFound(`No se encontraron materias del año ${anio}`);

    const horarios = await Horario.find({});
    if ( horarios.length === 0 ) throw new NotFound(`No se encontraron horarios`);
    
    response.materias = materias;
    response.horarios = horarios;

    const curso =  new Curso({
        cicloLectivo: cicloLectivo.cicloLectivo,
        anio: anio,
        division: division
    });

    response.curso = await curso.save();
    if ( !response.curso ) throw new Error("Internal Server Error. Ocurrió un error al guardar curso");
    
    return response;
}

const getPreceptorCurso = async (anio) => {

    let response = {};

    if ( anio < 1 || anio > 5 ) throw new BadRequest("año incorrecto, debe ser de 1 a 5");
    
    const cicloLectivo = await getCicloLectivo();
    const cursos = await getCursosCicloLectivo(cicloLectivo.cicloLectivo, anio);
    
    if ( cursos.length > 0 ){
        
        response.preceptor = cursos[0].preceptor;    
        
    } else {

        const respPreceptores = await getPreceptores();

        if ( !respPreceptores.ok ){
            return respPreceptores;
        } 

        const preceptores  = respPreceptores.preceptores;
        response.preceptor = preceptores.filter( preceptor => cursos.every(curso => curso.preceptor.preceptor.legajo !== preceptor.preceptor.legajo ));
    }

    return response;
}


const buscarProfesor = async (materia) => {
    
    const materias = await Materia.find({ nombre : materia });
    if ( materias.length === 0 ) throw new NotFound(`La materia ${materia} no pertenece a la planilla de materias`);

    const profesores = await Persona.find({ 'profesor.materias': {$elemMatch: {nombre: `${materia}`}}});
    if ( profesores.length === 0 ) throw new NotFound(`No existen profesores para dar la materia ${materia}`);
    
    return profesores;

}


// la combinacion de horario, materia y profesor es un dictado.
const createDictado = async (cicloLectivo, programa, horarios, nombreMateria, anioMateria, idProfesor, idCurso, idPreceptor) => {

    let response = {}
    response.cursoCompleto = false;
    
    const profesor = await Persona.findById( idProfesor );
    if ( !profesor ) throw new NotFound(`No existe profesor`);
    
    let horarioDB;
    horarios = horarios.split(',')
    
    const dictado = new Dictado({
        cicloLectivo,
        programa,
        profesor: mongoose.Types.ObjectId(idProfesor),
        materia: {
            nombre: nombreMateria,
            anio: anioMateria,
        }
    });
    
    for (let i = 0 ; i < horarios.length ; i++ ) {

        horarioDB = await Horario.findById( horarios[i] );
        if ( !horarioDB ) throw new NotFound("No se encontró horario");

        dictado.horarios.push( {
            dia: horarioDB.dia,
            bloqueHorario: horarioDB.bloqueHorario
        });        
    }

    const dictadoDB = await dictado.save();
    if  ( !dictadoDB ) throw new Error("Internal Server Error. Ocurrió un error al guardar dictado");

    response.dictadoDB = dictadoDB;
    
    let cursoDB = await Curso.findById(idCurso);
    if ( !cursoDB ) throw new NotFound("No se encontró el curso solicitado");
    
    cursoDB.dictados.push(dictadoDB._id);

    cursoDB.preceptor = idPreceptor;
    
    cursoDB = await cursoDB.save();
    if ( !cursoDB ) throw new Error("Internal Server Error. Ocurrió un error al guardar curso");


    const materiasAnioCiclo = await getCicloLectivo();

    if ( cursoDB.dictados.length === materiasAnioCiclo.materiasAnio[cursoDB.anio] ) {
        response.cursoCompleto = true
    }

    return response;
}

const deleteCurso = async (id) => {

    const query = await Curso.findByIdAndDelete(id)
    return query;
}


// obtiene los cursos del año solicitado, del ciclo lectivo actual.
const getCursosCicloLectivo = async (anioCiclo, anioCurso) => {
    
    const cursosCiclo = await Curso.find({ cicloLectivo : anioCiclo, anio: anioCurso }).sort({ division : -1 }).populate({ path : 'preceptor'});

    return cursosCiclo;
}



module.exports = {
    createCurso,
    getCursosCicloLectivo,
    buscarProfesor,
    createDictado,
    getPreceptorCurso,
    deleteCurso
}