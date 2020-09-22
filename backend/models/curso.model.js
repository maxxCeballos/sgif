const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let alumnos = [{
    legajo: String,
    nombre: String,
    apellido: String,
    oid: Schema.Types.ObjectId
}];

let preceptor = {
    legajo: String,
    nombre: String,
    apellido: String,
    oid: Schema.Types.ObjectId
};

let dictados = [{
    //TODO ver si queda, en curso esta
    cicloLectivo: { type: Number, min: 1960, max: 9999 },
    programa: String,
    horarios: [{
        dia: { type: String, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
        hora: String, //FIXME ver un tipo de dato para hora
    }],
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    profesor: {
        legajo: String,
        nombre: String,
        apellido: String,
        oid: Schema.Types.ObjectId
    }
}];


const cursoEsquema = new Schema({
    anio: { type: Number, min: 1, max: 5 },
    division: { type: Number, min: 1, max: 3 },
    //TODO ver que pasa cuando pongamos el esquema de ciclo lectivo
    cicloLectivo: { type: Number, min: 1960, max: 9999 }, //FIXME ver el max que sea para el año actual
    alumnos,
    dictados,
    preceptor
}, { timestamps: true });

const Curso = mongoose.model('Curso', cursoEsquema);

module.exports = Curso;