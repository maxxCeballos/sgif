const mongoose = require('mongoose');
const Horario = require('./horario.model');

const Schema = mongoose.Schema;

const dictadoEsquema = new Schema({
    cicloLectivo: Number, //Se copia desde el esquema de CicloLectivo
    programa: String, //FIXME es un archivo
    //TODO: ATENCION! con esquema persona, llenar con profesor
    profesor: {type: Schema.Types.ObjectId, ref: 'Persona'},
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    //TODO testear
    // horarios: [Horario]
}, { timestamps: true });

const Dictado = mongoose.model('Dictado', dictadoEsquema);

module.exports = Dictado;