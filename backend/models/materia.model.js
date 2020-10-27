const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const materiaEsquema = new Schema({
    nombre: String,
    anio: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

const Materia = mongoose.model('Materia', materiaEsquema);

module.exports = Materia;