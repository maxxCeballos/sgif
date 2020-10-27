'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createMateria,getMateria } = require('../controllers/materia');
const asynchandler = require('../middlewares/asynchandler');




router.post('/materia', asynchandler( async (req, res) => {

    const materia = req.body;

    const response = await createMateria(materia);

    res.send({ ok: true, response  });
}));

router.get('/materia/:id', asyncHandler( async (req, res) => {

    const idMateria = req.params.id;
    const response = await getMateria(idMateria);

    res.send({ ok: true, response  });
}));

//Rutas relacionada con alumno
module.exports=router;