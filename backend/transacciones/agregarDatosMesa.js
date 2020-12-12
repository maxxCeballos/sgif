'use strict'


const { getPersona } = require('../controllers/persona');

function verificarProfesores(profesores, fechaHora, mesas) {
    //Retorna true si hay un profesor en una mesa en la misma fecha
    let esValido = true, iMesa = 0, i = 0, mesaActual;
    console.log(mesas);
    while (esValido && mesas.length != 0 && mesas.length != iMesa) {
        //Este while iteras sobre las mesas completadas
        mesaActual = mesas[iMesa];
        console.log(fechaHora);

        if (fechaHora.getTime() === mesaActual.fechaHora.getTime()) {
            while (i < 3 && esValido) {
                //Este while itera sobre los profesores de las mesas
                if (profesores[0] == mesaActual.profesores[i] || profesores[1] == mesaActual.profesores[i] || profesores[2] == mesaActual.profesores[i]) {
                    //Si algun profe coincide no se puede asignar a la mesa
                    esValido = false;
                }
                i = i + 1;
            }
            i = 0;
        }

        iMesa = iMesa + 1;
        console.log(esValido);
    }
    return esValido;
}

function verificarPreceptores(preceptores, fechaHora, mesas) {
    //Retorna true si hay un preceptor en una mesa en la misma fecha
    let esValido = true, iMesa = 0, i = 0, mesaActual;
    while (esValido && mesas.length != 0 && mesas.length != iMesa) {
        //Este while iteras sobre las mesas completadas
        mesaActual = mesas[iMesa];
        if (fechaHora.getTime() === mesaActual.fechaHora.getTime()) {
            while (i < 2 && !esValido) {
                //Este while itera sobre los profesores de las mesas
                if (preceptores[0] == mesaActual.preceptores[i] || preceptores[1] == mesaActual.preceptores[i]) {
                    //Si algun profe coincide no se puede asignar a la mesa
                    esValido = false;
                }
                i = i + 1;
            }
            i = 0;
        }

        iMesa = iMesa + 1;
    }
    return esValido;
}

async function verificarMateriaAnio(materia, anio, profesores) {
    //Verifico si algun profesor puede dar la materia de un determinado anio
    let profe = 0, materias, mat = 0, esValido = false, profesorActual;
  
    while (!esValido && profe < profesores.length) {
        profesorActual = await getPersona(profesores[profe]);
        materias = profesorActual.profesor.materias;
        
        while (!esValido && mat < materias.length) {
            //Itero en sus materias para saber si puede dar la materia del año ingresado por parametro
           
            if (materias[mat].nombre == materia && materias[mat].anio == anio) {
                esValido = true;
            }
            mat = mat + 1;
        }
        mat = 0;
        profe = profe + 1;
    }

    return esValido;
}


module.exports = {
    verificarProfesores,
    verificarPreceptores,
    verificarMateriaAnio
};