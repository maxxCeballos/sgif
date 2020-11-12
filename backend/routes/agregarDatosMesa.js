'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();

const { getMesasSolicitadas, updateMesaIndividual } = require('../controllers/mesaExamen');
const { getDictado } = require('../controllers/dictado');



router.get('/agregarDatosMesaExamen/mesasSolicitadas', asyncHandler(async (req, res) => {
    //TODO agregar cicloLectivo para controlar que sea actual, teniendo en cuenta dictado
    //Obtenemos las mesas en estado solicitado
    const solicitadas = await getMesasSolicitadas();


    //Obtener dictados de cada mesaDeExamen (si se haace aparte llevar esto, PD: si se queda hay que ver como corroborar si trajo mesas o la respuesta)
    var i;
    let mesaActual, dictadoActual, mesasConDictados = [];
    mesasConDictados = [];

    for (i in solicitadas) {
        //Genero una lista con tuplas de mesa y su dictado correspondiente
        mesaActual = solicitadas[i];
        dictadoActual = await getDictado(mesaActual.dictado);
        mesasConDictados.push({ "mesa": mesaActual, "dictado": dictadoActual });
    }
    console.log(mesasConDictados);

    res.send({ ok: true, mesasConDictados});

}));

//TODO Documentarlo lo de la seleccion porque lo cambiamos  DOC de  decicisones de diseño !!!!!! Para que sea amigable al suuario y ........

//generar ruta que se llama cuadno selecciona mesa individual

router.put('/agregarDatosMesaExamen/mesaIndividual/agregarDatos', asyncHandler(async (req, res) => {
//Esta ruta es llamada cuando decide completar una mesa de tipo individual
    let oidMesa,profesores, preceptores, fechaHora,aula,update;
    oidMesa=req.query.mesa;
    profesores=req.query.profesores;
    preceptores=req.query.preceptores;
    fechaHora=req.query.fechaHora;
    aula=req.query.aula;
    materiaMesa=req.query.materiaMesa;
    update={
        "estado":"Completada",
        "profesores":profesores,
        "preceptores":preceptores,
        "fechaHora":fechaHora,
        "aula":aula,

    }


    await updateMesaIndividual(oidMesa,update);
    res.send({ ok: true, response });
}));


//TODO preguntar si conviene llamar a dos routes distintos o hacerlo todo en uno 





module.exports = router;