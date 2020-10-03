const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let alumnos = [{
    oid: Schema.Types.ObjectId,
}];

/* TODO se puede poner asi en vez de lo de arriba?
    let alumnos = [Schema.Types.ObjectId];
*/

let preceptor = {
    oid: Schema.Types.ObjectId,
    legajo: String,
    nombre: String,
    apellido: String
};

const cursoEsquema = new Schema({
    anio: { type: Number, min: 1, max: 5 },
    division: { type: Number, min: 1, max: 3 },
    //TODO ver que pasa cuando pongamos el esquema de ciclo lectivo
    cicloLectivo: { type: Number, min: 1960, max: 9999 }, //FIXME ver el max que sea para el año actual    
    dictados = [Schema.Types.ObjectId],
    alumnos,
    preceptor
}, { timestamps: true});

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso;