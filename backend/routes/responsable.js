'use strict';

const express = require('express');
const asyncHandler = require('../middlewares/asynchandler');


const router = express.Router();

const { createResponsable, updateResponsable, getAllResponsables, getResponsableById, deleteResponsable } = require('../controllers/responsable');
const asynchandler = require('../middlewares/asynchandler');


router.post('/responsable', asyncHandler( async (req, res) => {

    const responsable = req.body

    const response = await createResponsable(responsable);

    res.send({ ok: true, response  });
}));


router.get('/responsable/:dni', asynchandler( async (req, res) => {

    const dni = req.params.dni

    const response = await getResponsableById(dni)

    res.send({ ok: true, response })

}));

router.get('/responsable', asyncHandler( async (req, res) => {

    const response = await getAllResponsables();

    res.send({ ok: true, response });

}));

router.put('/responsable', asyncHandler( async (req, res) => {

    const responsable = req.body

    const response = await updateResponsable(responsable);

    res.send({ ok: true, response });

}));


router.delete('/responsable/:dni', asyncHandler( async (req, res) => {

    const dni = req.params.dni

    const response = await deleteResponsable(dni)

    res.send({ ok: true, response })    
}));

module.exports = router;