'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();
const { createCicloLectivo,getCicloLectivoActual,getCicloLectivo,updateCicloLectivo } = require('../controllers/cicloLectivo');




//Rutas relacionada con alumno



//Rutas relacionadas con Curso
router.post('/ciclo', asyncHandler( async (req, res) => {

    const ciclo = req.body;

    const response = await createCicloLectivo(ciclo);

    res.send({ ok: true, response  });
}));

router.get('/ciclo/:ciclo', asyncHandler( async (req, res) => {

    const ciclo = req.params.ciclo;
    const response = await getCicloLectivo(ciclo);

    res.send({ ok: true, response  });
}));

router.get('/ciclo', asyncHandler( async (req, res) => {

    const response = await getCicloLectivoActual();

    res.send({ ok: true, response  });
}));

router.put('/ciclo/:id', asyncHandler( async (req, res) => {
    const oid= req.params.id;
    const response = await updateCicloLectivo(oid,req.body);

    res.send({ ok: true, response  });
}));

//Rutas relacionada con alumno
module.exports=router;