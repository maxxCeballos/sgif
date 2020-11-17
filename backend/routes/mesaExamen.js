'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const router = express.Router();
const { createMesa,updateMesa, getUltimaActa,getMesasCompletadas} = require('../controllers/mesaExamen');

router.post('/mesaExamen', asyncHandler( async (req, res) => {

    const mesaExamen = req.body;

    const response = await createMesa(mesaExamen);

    res.send({ ok: true, response  });
}));

router.put('/mesaExamen/:id', asyncHandler( async (req, res) => {
    const oidMesa=req.params.id;
    const update = req.body;

    const response = await updateMesa(oidMesa,update);

    res.send({ ok: true, response  });
}));


router.get('/mesaExamen/acta', asyncHandler( async (req, res) => {

    
    const response = await getUltimaActa();

    res.send({ ok: true, response  });
}));
router.get('/mesaExamen/completadas', asyncHandler( async (req, res) => {

    
    const response = await getMesasCompletadas();

    res.send({ ok: true, response  });
}));
module.exports=router;