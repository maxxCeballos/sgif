const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//FIXME provincia?
const localidadEsquema = new Schema({
    nombre: String,   
}, { timestamps: true });

const Localidad = mongoose.model('Localidad', localidadEsquema);

module.exports = Localidad;