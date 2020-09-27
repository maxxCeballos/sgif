const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//arr de profesores, el primero es el que puede impartir la materia, el resto secundarios
let profesores = [{
    //TODO: completar (ver si oid o los artib consultados)    
    tipoDni: { type: String },
    nroDni: { type: Number },
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}, {}]

let preceptores = [{
    //TODO: completar (ver si oid o los artib consultados) 
    tipoDni: { type: String },
    nroDni: { type: Number },
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}]

let dictado = {
    //TODO ver que pasa cuando pongamos el esquema de ciclo lectivo
    cicloLectivo: { type: Number, min: 1960, max: 9999 }, //FIXME ver el max que sea para el año actual
    programa: String, //TODO ver si lo dejamos
    profesor: {
        tipoDni: { type: String },
        nroDni: { type: Number },
        legajo: { type: String },
        nombre: { type: String },
        apellido: { type: String }
    },
    materia: {
        nombre: String,
        anio: Number
    }    
}

let resultados = [{
    alumno: Schema.Types.ObjectId,
    legajo: String,
    nombre: String,
    apellido: String,
    nota: Number,
    condicion: {type: String, enum:[]} //FIXME completar
}]

const mesaExamenEsquema = new Schema({
    acta: {},
    fechaHora: { type: Date },
    aula: {},
    estado: {},
    preceptores,
    profesores,
    dictado,
    resultados,
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [Schema.Types.ObjectId],
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;