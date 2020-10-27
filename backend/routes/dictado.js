'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createDictado,getDictado } = require('../controllers/dictado');
const asynchandler = require('../middlewares/asynchandler');


router.post('/dictado', asynchandler( async (req, res) => {

    const dictado = req.body;

    const response = await createDictado(dictado);

    res.send({ ok: true, response  });
}));

router.get('/dictado/:oid', asyncHandler( async (req, res) => {

    const oid = req.params.oid;
    const response = await getDictado(oid);

    res.send({ ok: true, response  });
}));

module.exports=router;