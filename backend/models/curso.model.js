const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cursoEsquema = new Schema({
    anio: { type: Number, min: 1, max: 5 },
    division: { type: Number, min: 1, max: 3 },
    cicloLectivo: Number, //Se copia desde el esquema de CicloLectivo
    dictados: [{type: Schema.Types.ObjectId, ref: 'Dictado'}],
    alumnos: [{type: Schema.Types.ObjectId, ref: 'Alumno'}],
    
    //TODO: ATENCION! con esquema persona, llenar con preceptor
    preceptor: {type: Schema.Types.ObjectId, ref: 'Persona'}
}, { timestamps: true});

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso;