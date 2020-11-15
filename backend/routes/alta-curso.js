'use strict';

const express = require('express');
const router = express.Router();

const asyncHandler = require('../middlewares/asynchandler');
const  { createCurso } = require('../controllers/curso');

router.post('/alta-curso', asynchandler(async (req, res) => {

    curso = req.body.curso;

    const response = await createCurso();

    res.send({ ok: true, response})
}))