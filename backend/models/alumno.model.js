const mongoose = require('mongoose');

const Schema = mongoose.Schema

let dictado = {
    idDictado: Schema.Types.ObjectId,
    materia: {
        nombre: String,
        anio: { type: Number, min: 1, max: 5 }
    },
    programa: String
}

let resultadosMesasEx = [{
    nota: Number,
    condicion: { type: String, enum: ["Aprobado", "Desaprobado", "Ausente"] },
    mesaDeExamen: Schema.Types.ObjectId,
}];

let calificaciones = [{
    //Notas de cada trimestre
    nota1T: Number,
    nota2T: Number,
    nota3T: Number,
    cicloLectivo: { type: Number, min: 1960, max: 9999 },
    promedio: { type: Number, min: 1, max: 10 },
    notaFinal: { type: Number, min: 1, max: 10 },
    condicion: { type: String, enum: ["Cursando", "Aprobado", "Desaprobado", "Repitio"] },
    resultadosMesasEx,
    dictado
}];

let inasistencia = {
    valor: { type: Number, enum: [0.25, 0.5, 1] },
    estado: { type: String, enum: ["Justificada", "Injustificada", "Justificacion Especial"] },
    justificacion: String, //FIXME puede ser archivo
    dictado: {
        idDictado: Schema.Types.ObjectId,
    }
};

let presentismos = [{
    fecha: Date,
    horaEntrada: String, 
    horaSalida: String, 
    inasistencia // si se retira antes o no va se completa aca
}];

let preceptorSancion = {
    idPreceptor: Schema.Types.ObjectId,
    nombre: String,
    apellido: String,
    legajo: String,
}

let sanciones = [{
    id: String, 
    fecha: Date,
    cantidad: {type: Number, enum: [0.25, 0.5, 1]},
    justificacion: String,
    preceptorSancion
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
    idResponsable: Schema.Types.ObjectId,
    idHermanos: [Schema.Types.ObjectId],
    idPadres: [Schema.Types.ObjectId]
}, { timestamps: true });

const Alumno = mongoose.model('Alumno', alumnoEsquema);

module.exports = Alumno;