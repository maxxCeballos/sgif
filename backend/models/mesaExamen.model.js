const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mesaExamenEsquema = new Schema({
    acta: { type: Number, unique: true },
    fechaHora: { type: Date },
    aula: { type: Number },
    estado: { type: String, enum: ["Solicitada", "Completada", "Cerrada"] },
    //TODO: ATENCION! con esquema persona, llenar con preceptores y profesores
    preceptores: [{ type: Schema.Types.ObjectId, ref: 'Persona' }], //son 2 preceptores
    profesores: [{ type: Schema.Types.ObjectId, ref: 'Persona' }], //son 3 profesores
    dictado: { type: Schema.Types.ObjectId, ref: 'Dictado' },
    resultados: [{ type: Schema.Types.ObjectId, ref: 'ResultadoMesa' }],

    //estructura para compartir mesas y referencias 
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [{ type: Schema.Types.ObjectId, ref: 'MesaExamen' }],
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;