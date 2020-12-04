let INSCRIBIR_MESA = {
    ruta: "/inscribir-mesa",
    nombre: "Inscribir Alumno en Mesa de Examen",
    component() {
        () => import('../components/transacciones/inscribirMesa/Main.vue')
    }
}

let AGREGAR_DATOS_MESA = {
    ruta: "/agregar-datos-mesa",
    nombre: "Agregar Datos a Mesa de Examen",
    component() {
        () => import('../components/transacciones/agregarDatosMesa/Main.vue')
    }
}

let CERRAR_MESA = {
    ruta: "/cerrar-mesa",
    nombre: "Cerrar Mesa de Examen",
    component() {
        () => import('../components/transacciones/cerrarMesa/Main.vue')
    }
}

let CONSULTAR_ALUMNO = {
    ruta: "/consultar-alumno",
    nombre: "Consultar Información de Alumno",
    component() {
        () => import('../components/transacciones/consultarAlumno/Main.vue')
    }
}

module.exports = {
    INSCRIBIR_MESA,
    AGREGAR_DATOS_MESA,
    CERRAR_MESA,
    CONSULTAR_ALUMNO
}