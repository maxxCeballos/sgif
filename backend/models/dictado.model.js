const mongoose = require('mongoose');
const Horario = require('./horario.model');

const Schema = mongoose.Schema;

const dictadoEsquema = new Schema({
    //TODO ver lo del ciclo lectivo, si es copia o no
    cicloLectivo: { type: Number, min: 1960, max: 9999 },
    programa: String, //FIXME es un archivo
    profesor: Schema.Types.ObjectId,
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    //TODO funciona?
    horarios: [Horario]
}, { timestamps: true });

const Dictado = mongoose.model('Dictado', dictadoEsquema);

module.exports = Dictado;