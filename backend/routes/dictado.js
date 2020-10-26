'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');
const { model } = require('../models/alumno.model');

const router = express.Router();



router.post('/dictado', asyncHandler(async (req, res) => {

    const dictado = req.body;

    const response = await createDictado(dictado);

    res.send({ ok: true, response });
}));

model.exports = router;