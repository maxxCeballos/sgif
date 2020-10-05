const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cursoEsquema = new Schema({
    anio: { type: Number, min: 1, max: 5 },
    division: { type: Number, min: 1, max: 3 },
    cicloLectivo: Number, //Se copia desde el esquema de CicloLectivo
    dictados = [Schema.Types.ObjectId],
    alumnos = [Schema.Types.ObjectId],
    preceptor = Schema.Types.ObjectId
}, { timestamps: true});

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso;