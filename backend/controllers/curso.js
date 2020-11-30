'use strict';

const mongoose = require('mongoose');

const Curso = require('../models/curso.model');
const Materia = require('../models/materia.model');
const Horario = require('../models/horario.model');
const Persona = require('../models/persona.model');
const Dictado = require('../models/dictado.model');

const { getCicloLectivo } = require('./ciclo-lectivo');
const { getPreceptores } = require('../controllers/preceptor')

const createCurso = async (anio) => {

    let response = {};
    response.ok = true;

    let division = 1;

    if ( anio < 1 || anio > 5 ) {
        response.ok = false;
        response.message = "año incorrecto, debe ser de 1 a 5";
        return response;
    }
    
    const cicloLectivo = await getCicloLectivo();
    const cursos = await getCursosCicloLectivo(cicloLectivo.cicloLectivo, anio);
    
    if ( cursos.length > 0 ){
    
        if (cursos[0].division > 2) {
            
            response.ok = false;
            response.message = `ya existen 3 divisiones de ${anio}º año`;
            return response;
            
        }
        
        response.preceptor = cursos[0].preceptor;    
        division = cursos[0].division + 1;
        
    } else {

        const respPreceptores = await getPreceptores();

        if ( !respPreceptores.ok ){
            return respPreceptores;
        } 

        const preceptores  = respPreceptores.preceptores;
        response.preceptor = preceptores.filter( preceptor => cursos.every(curso => curso.preceptor.preceptor.legajo !== preceptor.preceptor.legajo ));
    }

    const materias = await Materia.find({ anio : anio });

    if ( materias.length === 0 ) {
        response.ok = false;
        response.message = `T: alta curso. No se encontraron materias del año ${anio}`;
        return response;
    }

    const horarios = await Horario.find({});

    if ( horarios.length === 0 ) {
        response.ok = false;
        response.message = `T: alta curso. No se encontraron horarios`;
        return response;
    }
    
    response.materias = materias;
    response.horarios = horarios;

    const curso =  new Curso({
        cicloLectivo: cicloLectivo.cicloLectivo,
        anio: anio,
        division: division
    });

    response.curso = await curso.save();

    if ( response.curso.length === 0 ) {
        response.ok = false;
        response.message = `T: alta curso. No se pudo registrar el curso`
        return response;
    }
    
    return response;
}


const buscarProfesor = async (materia) => {

    let response = {};
    response.ok = true;
    
    const materias = await Materia.find({ nombre : materia });

    if ( materias.length === 0 ) {
        response.ok = false;
        response.message = `La materia ${materia} no pertenece a la planilla de materias`;
        return response;
    }

    // buscar profesores que puedan dar esa materia
    const profesores = await Persona.find({ 'profesor.materias': {$elemMatch: {nombre: `${materia}`}}});
    
    if ( profesores.length === 0 ) {
        response.ok = false;
        response.message = `No existen profesores para dar la materia ${materia}`;
        return response;
    }
    
    response.profesores = profesores;
    
    return response;

}


// la combinacion de horario, materia y profesor es un dictado.
const createDictado = async (cicloLectivo, programa, horarios, nombreMateria, anioMateria, idProfesor, idCurso) => {

    let response = {};
    response.ok = true;
    
    // chequear que el idProfesor, id sea correcto
    
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

        if ( horarioDB.length === 0 ) {

            response.ok = false;
            response.message = "el horario indicado no es correcto";
            return response;

        }

        dictado.horarios.push( {
            dia: horarioDB.dia,
            bloqueHorario: horarioDB.bloqueHorario
        });        
    }

    const dictadoDB = await dictado.save();

    if  ( dictadoDB.length === 0 ) {
        response.ok= false;
        response.message = "T: alta curso. Ocurrió un error al guardar dictado"
        return response;
    }
    
    let cursoDB = await Curso.findById(idCurso);

    if ( cursoDB.length === 0 ) {
        response.ok= false;
        response.message = "T: alta curso. No se encontró el curso solicitado";
        return response;
    }
    
    cursoDB.dictados.push(dictadoDB._id);
    
    cursoDB = await cursoDB.save();
    
    if ( cursoDB.length === 0 ) {
        response.ok= false;
        response.message = "T: alta curso. Ocurrió un error al guardar curso"
        return response;
    }

    response.dictado = dictadoDB;

    return response;
}


// obtiene los cursos del año solicitado, del ciclo lectivo actual.
const getCursosCicloLectivo = async (anioCiclo, anioCurso) => {
    
    const cursosCiclo = await Curso.find({ cicloLectivo : anioCiclo, anio: anioCurso }).sort({ division : -1 }).populate({ path : 'preceptor'})

    return cursosCiclo;
}



module.exports = {
    createCurso,
    getCursosCicloLectivo,
    buscarProfesor,
    createDictado
}