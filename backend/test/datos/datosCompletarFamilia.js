'useStrict'

//DATOS PARA TESTING

const personaPadre = {
    dni: "98765433",
    nombre: "Tomás",
    apellido: "Ramirez",
    genero: "Masculino",
}

const datosPadre = {
    fechaNacimiento: "1970-05-10T00:00:00.000Z",
    nacionalidad: "Argentino",
    telefono: "556841233",
    ocupacion: "Programador",
    lugarTrabajo: "Google",
    telefonoLaboral: "0800-GOOGLE-123",
    bautismo: true,
    comunion: true,
    confirmacion: true,
    egresoPrimario: false,
    egresoSecundario: false,
    relacionParentesco: "Padre"
}

const padreCompleto = {
    dni: personaPadre.dni,
    nombre: personaPadre.nombre,
    apellido: personaPadre.apellido,
    genero: personaPadre.genero,
    fechaNacimiento: datosPadre.fechaNacimiento,
    nacionalidad: datosPadre.nacionalidad,
    telefono: datosPadre.telefono,
    ocupacion: datosPadre.ocupacion,
    lugarTrabajo: datosPadre.lugarTrabajo,
    telefonoLaboral: datosPadre.telefonoLaboral,
    bautismo: datosPadre.bautismo,
    comunion: datosPadre.comunion,
    confirmacion: datosPadre.confirmacion,
    egresoPrimario: datosPadre.egresoPrimario,
    egresoSecundario: datosPadre.egresoSecundario,
    relacionParentesco: datosPadre.relacionParentesco
}

const padreEsperado = {
    padre: {
        fechaNacimiento: datosPadre.fechaNacimiento,
        nacionalidad: datosPadre.nacionalidad,
        telefono: datosPadre.telefono,
        ocupacion: datosPadre.ocupacion,
        lugarTrabajo: datosPadre.lugarTrabajo,
        telefonoLaboral: datosPadre.telefonoLaboral,
        bautismo: datosPadre.bautismo,
        comunion: datosPadre.comunion,
        confirmacion: datosPadre.confirmacion,
        egresoPrimario: datosPadre.egresoPrimario,
        egresoSecundario: datosPadre.egresoSecundario,
        relacionParentesco: datosPadre.relacionParentesco
    },
    dni: personaPadre.dni,
    nombre: personaPadre.nombre,
    apellido: personaPadre.apellido,
    genero: personaPadre.genero
}

const personaHermano = {
    dni: "98765434",
    nombre: "Lucía",
    apellido: "Gimenez",
    genero: "Femenino",
}

const datosHermano = {
    fechaNacimiento: "2005-05-10T00:00:00.000Z",
    escuelaActual: "Fatima",
    grado: "3º año"
}

const hermanoCompleto = {
    dni: personaHermano.dni,
    nombre: personaHermano.nombre,
    apellido: personaHermano.apellido,
    genero: personaHermano.genero,
    fechaNacimiento: datosHermano.fechaNacimiento,
    escuelaActual: datosHermano.escuelaActual,
    grado: datosHermano.grado
}

const hermanoEsperado = {
    hermano: {
        fechaNacimiento: datosHermano.fechaNacimiento,
        escuelaActual: datosHermano.escuelaActual,
        grado: datosHermano.grado,
        hermanos: []
    },
    dni: personaHermano.dni,
    nombre: personaHermano.nombre,
    apellido: personaHermano.apellido,
    genero: personaHermano.genero
}

module.exports = {
    personaPadre,
    datosPadre,
    padreCompleto,
    padreEsperado,
    personaHermano,
    datosHermano,
    hermanoCompleto,
    hermanoEsperado
}