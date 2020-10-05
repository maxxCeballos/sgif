const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bloqueHorarioEsquema = new Schema({
    horaInicio: String, 
    horaFin: String,
    duracion: Number //en minutos
}, { timestamps: true });

const BloqueHorario = mongoose.model('BloqueHorario', bloqueHorarioEsquema);

module.exports = BloqueHorario;