const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const materiaEsquema = new Schema({
    
}, { timestamps: true });

const Materia = mongoose.model('Materia', materiaEsquema);

module.exports = Materia;