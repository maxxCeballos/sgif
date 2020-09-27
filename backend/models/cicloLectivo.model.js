const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cicloLectivoEsquema = new Schema({
    
}, { timestamps: true });

const CicloLectivo = mongoose.model('CicloLectivo', cicloLectivoEsquema);

module.exports = CicloLectivo;