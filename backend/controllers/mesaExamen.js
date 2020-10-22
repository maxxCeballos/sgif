'use strict'

let MesaExamen = require('../models/mesaExamen.model');

const createMesaExamen = () => {


}

const updateMesaExamen = () => {

}


const deleteMesaExamen = () => {


}


const getMesaExamenByOid = async (oidMesa) => {
    //FIXME: ver como se buscaria por oid
    const mesaDB = await MesaExamen.findById(oidMesa).exec();

    return mesaDB
}



module.exports = {
    createMesaExamen,
    updateMesaExamen,
    deleteMesaExamen,
    getMesaExamenByOid,
}