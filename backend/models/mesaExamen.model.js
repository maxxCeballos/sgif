const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//arr de profesores, el primero es el que puede impartir la materia, el resto secundarios
let profesores = [{
    idProfesor: Schema.Types.ObjectId,
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}, {}]

let preceptores = [{
    idPreceptor: Schema.Types.ObjectId,
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}]

let resultados = [{
    idAlumno: Schema.Types.ObjectId,
    legajo: String,
    nombre: String,
    apellido: String,
    nota: Number,
    condicion: { type: String, enum: ["Aprobado", "Desaprobado", "Ausente"] },
}]

const mesaExamenEsquema = new Schema({
    acta: { type: Number }, //TODO revisar tipo
    fechaHora: { type: Date },
    aula: { type: Number },
    estado: { type: String, enum: ["Solicitada", "Completada", "Cerrada"] },
    preceptores=[Schema.Types.ObjectId], //son 2 preceptores
    profesores=[Schema.Types.ObjectId], //son 3 profesores
    dictado: Schema.Types.ObjectId,
    resultados=[Schema.Types.ObjectId],

    //estructura para compartir mesas y referencias 
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [Schema.Types.ObjectId],
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;