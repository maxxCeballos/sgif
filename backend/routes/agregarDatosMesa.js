'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();

const { getMesasSolicitadas, getMesasCompletadas, getMesasCompletadasCompartidas, updateMesa, getUltimaActa } = require('../controllers/mesaExamen');
const { getDictado } = require('../controllers/dictado');
const { getProfesores, getProfesorMateria, getPreceptores } = require('../controllers/persona');
const { verificarProfesores, verificarPreceptores, verificarMateriaAnio } = require('../transacciones/agregarDatosMesa');


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

    res.send({ ok: true, mesasConDictados });

}));

router.get('/agregarDatosMesaExamen/mesasParaCompartir', asyncHandler(async (req, res) => {
    //Obtiene las mesas cen estado completada que pueden ser compartidas


    //Obtenemos las mesas en estado completadas y que son padres
    const compartidas = await getMesasCompletadasCompartidas();
    //Obtenemos las mesas en estado completadas y que no son padres y tampoco compartidas
    const completadas= await  getMesasCompletadas();

    const mesas=Array.prototype.concat(compartidas.mesas,completadas.mesas);
    //Obtener dictados de cada mesaDeExamen (si se haace aparte llevar esto, PD: si se queda hay que ver como corroborar si trajo mesas o la respuesta)
    var i;
    let mesaActual, dictadoActual, mesasConDictados = [];
    mesasConDictados = [];
    console.log(mesas);
    for (i in mesas) {
        //Genero una lista con tuplas de mesa y su dictado correspondiente
        mesaActual = mesas[i];
        dictadoActual = await getDictado(mesaActual.dictado);
        mesasConDictados.push({ "mesa": mesaActual, "dictado": dictadoActual });
    }
    console.log(mesasConDictados);

    res.send({ ok: true, mesasConDictados });

}));

router.put('/agregarDatosMesaExamen/mesaIndividual/agregarDatos', asyncHandler(async (req, res) => {
    //Esta ruta es llamada cuando decide completar una mesa de tipo individual
    let oidMesa, profesorTitular, profesor2, profesor3, preceptor, preceptor2, fechaHora, aula, update, profesores, preceptores, response, mesas1, mesas2, verifPrecep, verifProfes;
    update = req.body
    update.fechaHora = new Date(update.fechaHora);
    mesas1 = await getMesasCompletadas();
    mesas2 = await getMesasCompletadasCompartidas();

    fechaHora = update.fechaHora;
    verifProfes = verificarProfesores(update.profesores, fechaHora, mesas1.mesas);
    if (verifProfes == true) {
        console.log("entre1");
        verifProfes = verificarProfesores(update.profesores, fechaHora, mesas2.mesas);
        if (verifProfes == true) {
            console.log("entre2");
            verifPrecep = verificarPreceptores(update.preceptores, fechaHora, mesas1.mesas);
            if (verifPrecep == true) {
                verifPrecep = verificarPreceptores(update.preceptores, fechaHora, mesas2.mesas);
                console.log("entre3");
            }

        }
    }

    if (verifPrecep == true) {
        response = {
            message: "Mesa Registrada",

        };

        update.acta = await getUltimaActa() + 1; //Aumento en 1  porque es la mesa siguiente
        update.estado = "Completada";
        console.log(update);
        response.mesaActualizada = await updateMesa(update.mesa, update);
    } else {
        response = {
            message: "No es posible posible crear la mesa"
        }
    }

    res.send({ ok: true, response });
}));

router.get('/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa', asyncHandler(async (req, res) => {
    let response, materia, anio;
    console.log(req.params.materia);
    materia = req.query.materia;
    anio = req.query.anio;
    response = await getProfesorMateria(materia, anio);
    res.send({ ok: true, response });
}));

router.get('/agregarDatosMesaExamen/obtenerProfesores', asyncHandler(async (req, res) => {
    let response;
    response = await getProfesores();
    res.send({ ok: true, response });
}));

router.get('/agregarDatosMesaExamen/obtenerPreceptores', asyncHandler(async (req, res) => {
    let response;
    response = await getPreceptores();
    res.send({ ok: true, response });
}));

router.put('/agregarDatosMesaExamen/registrarCompletada/:oidMesa', asyncHandler(async (req, res) => {
    //Esta ruta es llamada cuando la mesa pasa al estado completada
    let update;
    update = {
        "estado": "Completada",
    }
    response = await updateMesa(oidMesa, update);
    res.send({ ok: true, response });
}));

router.put('/agregarDatosMesaExamen/registrarCompartida/', asyncHandler(async (req, res) => {
    //Esta ruta se llama cuando se quiere registrar una mesa como compartida

    let respClient, response1, response2, materia, anio, esValido, updateMesaIndividual, updateMesaPadre, oidIndividual, oidPadre, esPadre
        , profesoresPadre, preceptoresPadre, fechaHoraPadre, aulaPadre, actaNueva;
    //Del front tengo que recibir por body un json de la manera 
    // {   oidInd:,
    //     padre:,
    //     esPadre:
    //     materia:,
    //     anio:,
    //     profesores:,
    //     preceptores:,
    //     fechaHora:,
    //     aula:,

    // }
    oidIndividual = req.body.oidIndividual;
    oidPadre = req.body.padre;
    esPadre = req.body.esPadre;
    materia = req.body.materia;
    anio = req.body.anio;
    profesoresPadre = Array.from(req.body.profesores);
    preceptoresPadre = req.body.preceptores;
    fechaHoraPadre = req.body.fechaHora;
    aulaPadre = req.body.aula;
    esValido = await verificarMateriaAnio(materia, anio, profesoresPadre)

    if (esValido == true) {
        actaNueva = await getUltimaActa() + 1;

        if (esPadre == true) {
            //si ya es padre no es necesario modificar los demas atributos
            updateMesaPadre = {
                "$push": { "asociadas": oidIndividual }
            }
        } else {
            //como no e spadre hay que llenar los atributos correspondientes
            updateMesaPadre = {
                "esPadre": true,
                "esCompartida": true,
                "$push": { "asociadas": oidIndividual }
            }

        }

        updateMesaIndividual = {
            "acta": actaNueva,
            "estado": "Completada",
            "profesores": profesoresPadre,
            "preceptores": preceptoresPadre,
            "fechaHora": fechaHoraPadre,
            "aula": aulaPadre,
            "esCompartida": true,
            "$push": { "asociadas": oidPadre }
        }
        //la mesa que es compartida y no es padre tiene en la primer posicion
        //del arreglo asociadas a su padre.
        response1 = await updateMesa(oidIndividual, updateMesaIndividual);
        response2 = await updateMesa(oidPadre, updateMesaPadre);
        respClient = {
            "valida": "Se registro la mesa con exito",
            "mesaIndividualU": response1,
            "mesaCompartidaUpdate": response2

        }
    } else {

        respClient = {
            "valida": "No es posible crear la mesa"
        }


    }
    res.send({ ok: true, respClient });
}));






//#TODO hacer cuando llamamos a las compartidas y vienen con las asociadas en el json
//#TODO verificar si funcionan bien las verificaciones
//TODO Documentarlo lo de la seleccion porque lo cambiamos  DOC de  decicisones de diseño !!!!!! Para que sea amigable al suuario y ........
module.exports = router;