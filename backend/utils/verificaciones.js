'use strict';

/**
 * Verifica que el formato del legajo sea correcto
 * 
 * @returns verdadero si el formato es correcto
 */
const verificarLegajo = (legajoAlumno) => {
    return !isNaN(legajoAlumno);
}

/**
 * Verifica que los valores sean correctos
 * 
 * @param {*} valoresDictado incluye los valores de {nombreMateria, anioMateria, cicloLectivo}
 */
const verificarDictado = (valoresDictado) => {
    let verificarId = valoresDictado.id !== undefined;

    let verificarCicloLectivo = valoresDictado.cicloLectivo
        && !isNaN(valoresDictado.cicloLectivo);

    let verificarNombreMateria = valoresDictado.nombreMateria !== undefined;

    let verificarAnioMateria = valoresDictado.anioMateria
        && !isNaN(valoresDictado.anioMateria) 
        && valoresDictado.anioMateria >= 1 
        && valoresDictado.anioMateria <= 5;

    return verificarId && verificarCicloLectivo && verificarNombreMateria && verificarAnioMateria;
}

module.exports = {
    verificarLegajo,
    verificarDictado,
}