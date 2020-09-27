const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const personaEsquema = new Schema({
    
}, { timestamps: true });

const Persona = mongoose.model('Persona', personaEsquema);

module.exports = Persona;