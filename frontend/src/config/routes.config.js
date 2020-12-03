let INSCRIBIR_MESA = {
    ruta: "/inscribir-mesa",
    nombre: "Inscribir Alumno en Mesa de Examen",
    component(){
        () => import('../components/transacciones/agregarDatosMesa/MesaIndividual.vue' )
    }
}

module.exports = {
    INSCRIBIR_MESA,
}