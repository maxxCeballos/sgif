const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mesaExamenEsquema = new Schema({
    acta: { type: Number }, //TODO revisar tipo
    fechaHora: { type: Date },
    aula: { type: Number },
    estado: { type: String, enum: ["Solicitada", "Completada", "Cerrada"] },
    preceptores: [Schema.Types.ObjectId], //son 2 preceptores
    //arr de profesores, el primero es el que puede impartir la materia, el resto secundarios
    profesores: [Schema.Types.ObjectId], //son 3 profesores
    dictado: Schema.Types.ObjectId,
    resultados: [Schema.Types.ObjectId],

    //estructura para compartir mesas y referencias 
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [Schema.Types.ObjectId],
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;