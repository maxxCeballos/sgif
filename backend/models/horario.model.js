const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const horarioEsquema = new Schema({
    dia: { type: String, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
    //FIXME se puede hacer asi, o con enums que ya tengan todos los bloques posibles
    bloqueHorario: {
        horaInicio: String, 
        horaFin: String,
        duracion: Number //en minutos        
    }
    //TODO puede ser asi tambien bloqueHorario: BloqueHorario
}, { timestamps: true });

const Horario = mongoose.model('Horario', horarioEsquema);

module.exports = Horario;