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
    confirmación: true,
    egresoPrimario: false,
    egresoSecundario: false,
    relacionParentesco: "Padre"
}

const padreCompleto = {
    padre: {
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
        confirmación: datosPadre.confirmación,
        egresoPrimario: datosPadre.egresoPrimario,
        egresoSecundario: datosPadre.egresoSecundario,
        relacionParentesco: datosPadre.relacionParentesco
    }
}

const padreEsperado = {
    padre: datosPadre,
    dni: personaPadre.dni,
    nombre: personaPadre.nombre,
    apellido: personaPadre.apellido,
    genero: personaPadre.genero,
}

module.exports = {
    personaPadre,
    datosPadre,
    padreCompleto,
    padreEsperado
}