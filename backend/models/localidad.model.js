const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const localidadEsquema = new Schema({
    nombre: String,   
    provincia: String,
}, { timestamps: true });

const Localidad = mongoose.model('Localidad', localidadEsquema);

module.exports = Localidad;