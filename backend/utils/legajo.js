'use strict';

/**
 * Verifica que el formato del legajo sea correcto
 * 
 * @param {*} legajoAlumno 
 */
const verificarLegajo = (legajoAlumno) => {
    return !isNaN(legajoAlumno);
}

module.exports = {
    verificarLegajo,
}