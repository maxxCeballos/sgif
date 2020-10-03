const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cicloLectivoEsquema = new Schema({
    cicloLectivo: { type: Number, min: 1960, max: 9999 }, //FIXME ver el max que sea para el año actual
    fechaIniClases: Date,
    fechaCiere1T: Date,
    fechaCiere2T: Date,
    fechaCiere3T: Date    
}, { timestamps: true });

const CicloLectivo = mongoose.model('CicloLectivo', cicloLectivoEsquema);

module.exports = CicloLectivo;