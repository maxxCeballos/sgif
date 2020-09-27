const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const escuelaEsquema = new Schema({

}, { timestamps: true });

const Escuela = mongoose.model('Escuela', escuelaEsquema);

module.exports = Escuela;