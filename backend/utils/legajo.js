'use strict';

/**
 * Verifica que el formato del legajo sea correcto
 * 
 * @returns verdadero si el formato es correcto
 */
const verificarLegajo = (legajoAlumno) => {
    return !isNaN(legajoAlumno);
}

module.exports = {
    verificarLegajo,
}