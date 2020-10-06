'use strict';

const express = require('express');


const router = express.Router();




router.post('/mesa-examen', (req, res) => {
    

    res.status(200).send({ status: true, data: alumno });
});



module.exports = router;