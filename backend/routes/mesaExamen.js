'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();
const { createMesa,updateMesaIndividual} = require('../controllers/mesaExamen');

router.post('/mesaExamen', asyncHandler( async (req, res) => {

    const mesaExamen = req.body;

    const response = await createMesa(mesaExamen);

    res.send({ ok: true, response  });
}));

router.put('/mesaExamen/:id', asyncHandler( async (req, res) => {
    const oidMesa=req.params.id;
    const update = req.body;

    const response = await updateMesaIndividual(oidMesa,update);

    res.send({ ok: true, response  });
}));

module.exports=router;