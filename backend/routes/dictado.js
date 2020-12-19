'use strict';

const express = require('express');
const asynchandler = require('../middlewares/asynchandler');

const router = express.Router();

const { createDictado } = require('../controllers/dictado');





router.post('/dictado', asynchandler(async (req, res) => {
  
    const dictado = req.body;

    const response = await createDictado(dictado);

    res.send({ ok: true, response });
}));

module.exports = router;
