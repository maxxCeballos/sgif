const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let direccion = {
    altura: { type: Number },
    piso: { type: Number },
    depto: { type: String },
    barrio: { type: String },
    calle: { type: String },
    modulo: { type: String },
    tira: { type: String }
}

const escuelaEsquema = new Schema({
    nombre: String,
    codigo: String,
    direccion

}, { timestamps: true });

const Escuela = mongoose.model('Escuela', escuelaEsquema);

module.exports = Escuela;