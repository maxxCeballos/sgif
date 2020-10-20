const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultadoMesaEsquema = new Schema({
    alumno: { type: Schema.Types.ObjectId, ref: 'Alumno' },
    mesaDeExamen: { type: Schema.Types.ObjectId, ref: 'MesaExamen' },
    legajo: String,
    nombre: String,
    apellido: String,
    nota: Number,
    condicion: { type: String, enum: ["Aprobado", "Desaprobado", "Ausente"] }
})