'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();

const { getMesasSolicitadas, getMesasCompletadas, getMesasCompletadasCompartidas, updateMesa, getUltimaActa } = require('../controllers/mesaExamen');
const { getDictado } = require('../controllers/dictado');
const { getProfesores, getProfesorMateria, getPreceptores } = require('../controllers/persona');
const { verificarProfesores, verificarPreceptores, verificarMateriaAnio } = require('../transacciones/agregarDatosMesa');


router.get('/agregarDatosMesaExamen/mesasSolicitadas', asyncHandler(async (req, res) => {
  
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
        mesasConDictados.push({ "mesaId": mesaActual._id, "materia": dictadoActual.materia.nombre, "anio": dictadoActual.materia.anio, "cicloLectivo": dictadoActual.cicloLectivo });
    }
    console.log(mesasConDictados);

    res.send({ ok: true, mesasConDictados });

}));

router.get('/agregarDatosMesaExamen/mesasParaCompartir', asyncHandler(async (req, res) => {
    //Obtiene las mesas cen estado completada que pueden ser compartidas


    //Obtenemos las mesas en estado completadas y que son padres
    const compartidas = await getMesasCompletadasCompartidas();
    //Obtenemos las mesas en estado completadas y que no son padres y tampoco compartidas
    const completadas = await getMesasCompletadas();

    const mesas = Array.prototype.concat(compartidas.mesas, completadas.mesas);
    //Obtener dictados de cada mesaDeExamen (si se haace aparte llevar esto, PD: si se queda hay que ver como corroborar si trajo mesas o la respuesta)
    var i;
    let mesaActual, dictadoActual, mesasConDictados = [];
    mesasConDictados = [];
    
    for (i in mesas) {
        //Genero una lista con tuplas de mesa y su dictado correspondiente
        mesaActual = mesas[i];
        dictadoActual = await getDictado(mesaActual.dictado);
        let fechaN= new Date(mesaActual.fechaHora).toISOString().substr(0, 10);
        let hora= new Date(mesaActual.fechaHora).toISOString().substr(11,5);
        mesasConDictados.push({
            "idMesa": mesaActual._id,
            "materia": dictadoActual.materia.nombre,
            "anio": dictadoActual.materia.anio,
            "cicloLectivo": dictadoActual.cicloLectivo,
            "acta": mesaActual.acta,
            "fecha": fechaN,
            "hora": hora,
            "aula": mesaActual.aula,
            "esCompartida": mesaActual.esCompartida,
            "esPadre": mesaActual.esPadre,
            "profesores": mesaActual.profesores,
            "preceptores": mesaActual.preceptores

        });
    }
   

    res.send({ ok: true, mesasConDictados });

}));

router.put('/agregarDatosMesaExamen/mesaIndividual/agregarDatos', asyncHandler(async (req, res) => {
    //Esta ruta es llamada cuando decide completar una mesa de tipo individual
    let oidMesa, profesorTitular, profesor2, profesor3, preceptor, preceptor2, fechaHora, aula, update, profesores, mesaActualizada, respClient, mesas1, mesas2, verifPrecep, verifProfes;

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
        update.acta = await getUltimaActa() + 1; //Aumento en 1  porque es la mesa siguiente
        update.estado = "Completada";
        console.log("aca el updateee"+update+"acta el id de la mesa"+update.mesa);
        mesaActualizada = await updateMesa(update.mesa, update);
        respClient = {
            message: "Se actualizo la mesa con éxito",
            mesa:mesaActualizada
        };
    } else {
       
        throw{
            status:204,
           
        }
    }

    res.send({ ok: true, respClient });
}));

router.get('/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa', asyncHandler(async (req, res) => {
    let response = [], materia, anio, profesores, profe, profesFormat = [], profeActual;
    console.log(req.params.materia);
    materia = req.query.materia;
    anio = req.query.anio;
    profesores = await getProfesorMateria(materia, anio);
    console.log(profesores);
    for (profe in profesores) {
        profeActual = profesores[profe];

        profesFormat.push({ "nombre": profeActual.nombre + " " + profeActual.apellido, "idProfe": profeActual._id });
    };
    response = profesFormat;
    res.send({ ok: true, response });
}));

router.get('/agregarDatosMesaExamen/obtenerProfesores', asyncHandler(async (req, res) => {
    let response = [], profesores, profe, profesFormat = [], profeActual;
    profesores = await getProfesores();
    for (profe in profesores) {
        profeActual = profesores[profe];

        profesFormat.push({ "nombre": profeActual.nombre + " " + profeActual.apellido, "idProfe": profeActual._id });
    };
    response = profesFormat;

    res.send({ ok: true, response });
}));

router.get('/agregarDatosMesaExamen/obtenerPreceptores', asyncHandler(async (req, res) => {
    let response = [], preceptores, precepFormat = [], precep, precepActual;
    preceptores = await getPreceptores();
    for (precep in preceptores) {
        precepActual = preceptores[precep];

        precepFormat.push({ "nombre": precepActual.nombre + " " + precepActual.apellido, "idPrecep": precepActual._id });
    };
    response = precepFormat;

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
    console.log(profesoresPadre);
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
            "message": "Se registro la mesa con exito",
            "mesaIndividualUpdate": response1,
            "mesaCompartidaUpdate": response2
        }
    } else {

        throw  {
            status:204

        }


    }
    res.send({ ok: true, respClient });
}));






//#TODO hacer cuando llamamos a las compartidas y vienen con las asociadas en el json
//#TODO verificar si funcionan bien las verificaciones
//TODO Documentarlo lo de la seleccion porque lo cambiamos  DOC de  decicisones de diseño !!!!!! Para que sea amigable al suuario y ........
module.exports = router;