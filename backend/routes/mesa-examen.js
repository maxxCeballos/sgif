'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();

const { createResultadoMesa } = require('../controllers/resultadoMesa');
const { createMesa, updateMesa, getUltimaActa, getMesasCompletadas} = require('../controllers/mesaExamen');


router.post('/mesa-examen', (req, res) => {


    res.status(200).send({ status: true, data: alumno });
});

router.post('/resultado-mesa/:dni', async (req, res) => {
    const resultadoMesa = req.body;

    const response = await createResultadoMesa(resultadoMesa);

    res.send({ ok: true, response });
})


//routes yaupe



router.post('/mesaExamen', asyncHandler(async (req, res) => {

    const mesaExamen = req.body;

    const response = await createMesa(mesaExamen);

    res.send({ ok: true, response });
}));

router.put('/mesaExamen/:id', asyncHandler(async (req, res) => {
    const oidMesa = req.params.id;
    const update = req.body;

    const response = await updateMesa(oidMesa, update);

    res.send({ ok: true, response });
}));


router.get('/mesaExamen/acta', asyncHandler(async (req, res) => {


    const response = await getUltimaActa();

    res.send({ ok: true, response });
}));
router.get('/mesaExamen/completadas', asyncHandler(async (req, res) => {


    const response = await getMesasCompletadas();

    res.send({ ok: true, response });
}));


module.exports = router;