const mongoose = require('mongoose');

const Schema = mongoose.Schema

let dictado = {
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    programa: String
}

let calificaciones = [{
    //Notas de cada trimestre
    nota1T: Number,
    nota2T: Number,
    nota3T: Number,
    cicloLectivo: { type: Number, min: 1960, max: 9999 },
    promedio: { type: Number, min: 1, max: 10 },
    notaFinal: { type: Number, min: 1, max: 10 },
    condicion: { type: String, enum: ["Cursando", "Aprobado", "Desaprobado", "Repitio"] },
    dictado
}];

let resultadosMesasEx = [{

}];

let inasistencia = {
    valor: { type: Number, enum: [0.25, 0.5, 1] },
    estado: { type: String, enum: ["Justificada", "Injustificada", "Justificacion Especial"] },
    justificacion: Srting, //FIXME ver si suben una captura por ej
};

let presentismos = [{
    fecha: Date,
    horaEntrada: String, //FIXME tipo hora
    horaSalida: String,


}];

let sanciones = [{

}];

let observaciones = [{

}];

const alumnoEsquema = new Schema({
    dni: String,
    tipoDni: String,
    nombre: String,
    apellido: String,
    genero: { type: String, enum: ["Masculino", "Femenino"] },
    fechaNac: Date,
    legajo: String,
    fechaIngreso: Date,
    fechaEgreso: Date,
    foto: String, //FIXME poner tipo de dato para la foto
    sacramento: [{
        tipo: { type: String, enum: ["Bautismo", "Comunión", "Confirmación"] },
        fueTomado: Boolean,
        fecha: Date,
        diocesis: String
    }],
    estadoInscripción: {
        type: String, enum: ["Inscripto", "No Inscripto", "Reinscripto"]
    },
    anioCorespondiente: { type: Number, min: 1, max: 5 }
}, { timestamps: true });

const Alumno = mongoose.model('Alumno', alumnoEsquema);

module.exports = Alumno;