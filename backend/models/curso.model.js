const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cursoEsquema = new Schema({
    anio: { type: Number, min: 1, max: 5 },
    division: { type: Number, min: 1, max: 3 },
    cicloLectivo: Number, //Se copia desde el esquema de CicloLectivo
    dictados = [{type: Schema.Types.ObjectId, ref: 'Dictado'}],
    alumnos = [{type: Schema.Types.ObjectId, ref: 'Alumno'}],
    
    //TODO: ATENCION! llenar solo con preceptor
    // es Persona el esquema al que va a relacionar
    preceptor = {type: Schema.Types.ObjectId, ref: 'Persona'}
}, { timestamps: true});

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso;