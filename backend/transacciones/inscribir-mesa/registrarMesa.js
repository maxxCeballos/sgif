'use strict';

const { getAlumnoByLegajo } = require('../../controllers/alumno');
const { getResultadoMesaByOid } = require('../../controllers/resultadoMesa');
const { getMesaExamenByOid } = require('../../controllers/mesaExamen');
const { getDictadoByOid } = require('../../controllers/dictado');
const { verificarLegajo } = require('../../utils/legajo');

const registrarMesa = async (legajoAlumno, dictado) => {

    //TODO: verificar formatos

    //TODO: buscar oid alumno y dictado 

    //TODO: buscar mesa si existe

    //TODO: crear mesa o asociarlo a una

    //TODO: crear resultado

    //TODO: return notificar mesa: 
    //solicitada - solo mensaje / completada - fecha, hora, aula, etc

}


module.exports = registrarMesa