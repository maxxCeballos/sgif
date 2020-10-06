const mongoose = require('mongoose');

 const Schema = mongoose.Schema

let calificaciones = [{
    //Notas de cada trimestre
    nota1T: Number,
    nota2T: Number,
    nota3T: Number,
    cicloLectivo: { type: Number, min: 1960, max: 9999 },
    promedio: { type: Number, min: 1, max: 10 },
    notaFinal: { type: Number, min: 1, max: 10 },
    condicion: { type: String, enum: ["Cursando", "Aprobado", "Desaprobado", "Repitio"] },
    dictado: Schema.Types.ObjectId,

    //hace referencia a las mesas de examen en las que rindió, y asi obtiene los resultados
    resultadosMesasExamen: [Schema.Types.ObjectId],     
}];

let inasistencia = {
    valor: { type: Number, enum: [0.25, 0.5, 1] },
    estado: { type: String, enum: ["Justificada", "Injustificada", "Justificacion Especial"] },
    justificacion: String, //FIXME puede ser archivo
    dictado: Schema.Types.ObjectId,
};

let presentismos = [{
    fecha: Date,
    horaEntrada: String,
    horaSalida: String,
    inasistencia // si se retira antes o no va se completa aca
}];

let sanciones = [{
    id: String,
    fecha: Date,
    cantidad: { type: Number, enum: [0.25, 0.5, 1] },
    justificacion: String,
    preceptorSancion: Schema.Types.ObjectId
}];

let observaciones = [{
    titulo: String,
    descripcion: String,
    fecha: Date,
    archivo: String, //FIXME es un archivo
}];

const alumnoEsquema = new Schema({
    dni: String,
    tipoDni: String,
    nombre: String,
    apellido: String,
    genero: { type: String, enum: ["Masculino", "Femenino"] },
    fechaNacimiento: Date,
    legajo: String,
    fechaIngreso: Date,
    fechaEgreso: Date,
    nombreEscuelaAnt: String,
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
    anioCorespondiente: { type: Number, min: 1, max: 5 },
    observaciones,
    sanciones,
    presentismos,
    calificaciones,
    responsable: Schema.Types.ObjectId,
    hermanos: [Schema.Types.ObjectId],
    padres: [Schema.Types.ObjectId]
}, { timestamps: true });

const Alumno = mongoose.model('Alumno', alumnoEsquema);

module.exports = Alumno;