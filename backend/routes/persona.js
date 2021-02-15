'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createPersona,getPersona,updatePersona } = require('../controllers/persona');
const asynchandler = require('../middlewares/asynchandler');


router.post('/persona', asynchandler( async (req, res) => {

    const persona = req.body;

    const response = await createPersona(persona);

    res.send({ ok: true, response  });
}));

router.get('/persona/:oid', asyncHandler( async (req, res) => {

    const oid = req.params.oid;
    const response = await getPersona(oid);

    res.send({ ok: true, response  });
}));

router.put('/persona/:id', asyncHandler( async (req, res) => {
    const oidPersona=req.params.id;
    const update = req.body;

    const response = await updatePersona(oidPersona,update);

    res.send({ ok: true, response  });
}));
module.exports=router;