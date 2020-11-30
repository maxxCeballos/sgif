const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const dictadoEsquema = new Schema({
    cicloLectivo: Number,
    programa: String,
    profesor: {type: Schema.Types.ObjectId, ref: 'Persona'},
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    horarios: Array
}, { timestamps: true });

const Dictado = mongoose.model('Dictado', dictadoEsquema);

module.exports = Dictado;