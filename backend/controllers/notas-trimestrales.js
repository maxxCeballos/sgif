'use strict'

const { getCicloLectivo } = require('./ciclo-lectivo');
const { getCursosCicloLectivo } = require('./curso');

const registrarNotasTrimestrales = async (curso) => {    

    // obtener dictados y alumnos del curso seleccionado

    // obtener materias de cada dictado

    // (=>) el usuario selecciona un dictado

    // obtener calificaciones del alumno del dictado seleccionado

    // obtener horarios del dictado

    // obtener inasistencias trimestrales al dictado

    // calcular porcentajes de inasistencias

    // actualizar notas trimestrales

    // save nota trimestral
}

const getCursos = async () => {
    cicloLectivo = getCicloLectivo();
    
    // validar fecha de cierre. ? obtener fecha del sistema y comparar que este entre las fechas definidas en ciclo lectivo.

    cursosCicloLectivo = getCursosCicloLectivo(cicloLectivo.anio)

    // (=>) de los cursos obtenidos el usuario selecciona uno
}




module.exports = {
    registrarNotasTrimestrales,
}