const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const resultadoMesaEsquema = new Schema({
    alumno: Schema.Types.ObjectId,
    mesaDeExamen: Schema.Types.ObjectId,
    nota: Number,
    condicion: { type: String, enum: ["Aprobado", "Desaprobado", "Ausente"] }
})