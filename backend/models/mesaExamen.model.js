const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//arr de profesores, el primero es el que puede impartir la materia, el resto secundarios
let profesores = [{
    //TODO: completar (ver si oid o los artib consultados)
    idProfesor: Schema.Types.ObjectId,
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}, {}]

let preceptores = [{
    //TODO: completar (ver si oid o los artib consultados)
    idPreceptor: Schema.Types.ObjectId,
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}]

let resultados = [{
    //FIXME pasar a alumno
    idAlumno: Schema.Types.ObjectId,
    legajo: String,
    nombre: String,
    apellido: String,
    nota: Number,
    condicion: { type: String, enum: [] } //FIXME completar
}]

const mesaExamenEsquema = new Schema({
    acta: { type: Number }, //TODO revisar tipo
    fechaHora: { type: Date },
    aula: { type: Number },
    estado: {type:String, enum:["Solicitada","Completada","Cerrada"]},
    preceptores,
    profesores,
    dictado: Schema.Types.ObjectId,
    resultados,

    //estructura para compartir mesas y referencias 
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [Schema.Types.ObjectId],
    
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;