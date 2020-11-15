const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const horarioEsquema = new Schema({
    dia: { type: String, enum: ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"] },
    bloqueHorario: {
        horaInicio: String, 
        horaFin: String,
        // TODO: ver si se puede definir calculo en vez de carga manual
        duracion: Number //en minutos        
    }
    //TODO puede ser asi tambien bloqueHorario: BloqueHorario
}, { timestamps: true });

const Horario = mongoose.model('Horario', horarioEsquema);

module.exports = Horario;