const mongoose = require('mongoose');

const Schema = mongoose.Schema;

//arr de profesores, el primero es el que puede impartir la materia, el resto secundarios
let profesores = [{
    //TODO: ATENCION! con esquema persona, llenar con profesor
    idProfesor: { type: Schema.Types.ObjectId, ref: 'Persona' },
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}, {}]

let preceptores = [{
    //TODO: ATENCION! con esquema persona, llenar con preceptor
    idPreceptor: { type: Schema.Types.ObjectId, ref: 'Persona' },
    legajo: { type: String },
    nombre: { type: String },
    apellido: { type: String }
}, {}]

let resultados = [{
    idAlumno: { type: Schema.Types.ObjectId, ref: 'Alumno' },
    legajo: String,
    nombre: String,
    apellido: String,
    nota: Number,
    condicion: { type: String, enum: ["Aprobado", "Desaprobado", "Ausente"] },
}]

const mesaExamenEsquema = new Schema({
    acta: { type: Number, unique: true }, //TODO revisar tipo
    fechaHora: { type: Date },
    aula: { type: Number },
    estado: { type: String, enum: ["Solicitada", "Completada", "Cerrada"] },
    //TODO: ATENCION! con esquema persona, llenar con preceptores y profesores
    preceptores: [{ type: Schema.Types.ObjectId, ref: 'Persona' }], //son 2 preceptores
    profesores: [{ type: Schema.Types.ObjectId, ref: 'Persona' }], //son 3 profesores
    dictado: { type: Schema.Types.ObjectId, ref: 'Dictado' },
    //FIXME: arreglar!!
    resultados: [{ type: Schema.Types.ObjectId, ref: 'ResultadoMesa' }],

    //estructura para compartir mesas y referencias 
    esCompartida: Boolean,
    esPadre: Boolean,
    asociadas: [{ type: Schema.Types.ObjectId, ref: 'MesaExamen' }],
}, { timestamps: true })

const MesaExamen = mongoose.model('MesaExamen', mesaExamenEsquema);

module.exports = MesaExamen;