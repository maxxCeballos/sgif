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
    dictado: { type: Schema.Types.ObjectId, ref: 'Dictado' },

    //hace referencia a las mesas de examen en las que rindió, y asi obtiene los resultados
    resultadoMesaExamen: [{ type: Schema.Types.ObjectId, ref: 'ResultadoMesa' }]
}];

let inasistencia = {
    valor: { type: Number, enum: [0.25, 0.5, 1] },
    estado: { type: String, enum: ["Justificada", "Injustificada", "Justificacion Especial"] },
    justificacion: String, //FIXME puede ser archivo
    dictado: { type: Schema.Types.ObjectId, ref: 'Dictado' },
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

    //TODO: ATENCION! con esquema persona, llenar con preceptor
    preceptorSancion: { type: Schema.Types.ObjectId, ref: 'Persona' }
}];

let observaciones = [{
    titulo: String,
    descripcion: String,
    fecha: Date,
    archivo: String, //FIXME es un archivo
}];

const alumnoEsquema = new Schema({
    dni: { type: String, unique: true },
    tipoDni: String,
    nombre: String,
    apellido: String,
    genero: { type: String, enum: ["Masculino", "Femenino", "Otro"] },
    fechaNacimiento: Date,
    legajo: { type: String, unique: true },
    fechaIngreso: Date,
    fechaEgreso: Date,
    nombreEscuelaAnt: String,
    foto: String, //FIXME poner tipo de dato para la foto
    sacramento: [{
        tipo: { type: String, enum: ["Bautismo", "Comunión", "Confirmación"] },
        fecha: Date,
        diocesis: String
    }],
    estadoInscripcion: {
        type: String, enum: ["Inscripto", "No Inscripto", "Reinscripto"]
    },
    anioCorrespondiente: { type: Number, min: 1, max: 5 },
    observaciones,
    sanciones,
    presentismos,
    calificaciones,

    //TODO: ATENCION! con esquema persona, llenar con preceptores, profesores y hermanos
    responsable: { type: Schema.Types.ObjectId, ref: 'Persona' },
    hermanos: [{ type: Schema.Types.ObjectId, ref: 'Persona' }],
    padres: [{ type: Schema.Types.ObjectId, ref: 'Persona' }]
}, { timestamps: true });

const Alumno = mongoose.model('Alumno', alumnoEsquema);

module.exports = Alumno;