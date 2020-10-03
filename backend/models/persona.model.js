const mongoose = require('mongoose');

const Schema = mongoose.Schema;
let responsable = {
    legajo: { type: String },
    cuitCuil: { type: String },
    telefono: { type: String },
    email: { type: String },
    altura: { type: Number },
    piso: { type: Number },
    depto: { type: String },
    barrio: { type: String },
    calle: { type: String },
    modulo: { type: String },
    tira: { type: String },
    localidad: { type: String },
    codigoPostal: { type: Number },
    provincia: { type: String },

};


let hermano = {
    fechaNacimiento: { type: Date },
    escuelaActual: { type: String },
    grado: { type: String },
    hermanos: [Schema.Types.ObjectId],


};

let padre = {
    fechaNacimiento: { type: Date },
    partidaNacimiento: { type: String },
    nacionalidad: { type: String },
    telefono: { type: String },
    ocupacion: { type: String },
    lugarTrabajo: { type: String },
    bautismo: { type: Boolean },
    comunion: { type: Boolean },
    confirmación: { type: Boolean },
    egresoPrimario: { type: Boolean },
    egresoSecundario: { type: Boolean },
    relacionParentesco: { type: String }
    //FIXME ver relacion alumno 
};

let preceptor = {
    legajo: { type: Date },
    email: { type: String }
};

let materias = [{
    nombre: { type: String },
    anio: { type: Number, min: 1, max: 5 }
}];

let profesor = {
    cuil: { type: String },
    lugarNacimiento: { type: String },
    fechaNacimiento: { type: Date },
    nacionalidad: { type: String },
    domicilioLegal: { type: String },
    localidad: { type: String },
    telefono: { type: String },
    email: { type: String },
    fechaIngreso: { type: Date },
    nivel: { type: String },
    condicion: { type: String },
    datosTrabajo: { type: String },
    escuelaPrevia: { type: String },
    fechaSalidaEscuelaPrevia: { type: Date },
    antiguedadTotal: { type: Number },
    materias
};

const personaEsquema = new Schema({
    nombre: String,
    apellido: String,
    dni: String,
    sexo: { type: String, enum: ["Masculino", "Femenino"] },
    responsable,
    hermano,
    padre,
    preceptor,
    alumno: Schema.Types.ObjectId

}, { timestamps: true });


const Persona = mongoose.model('Persona', personaEsquema);

module.exports = Persona;