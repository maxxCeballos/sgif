'useStrict'

//DATOS PARA TESTING
const cicloValido = {
    cicloLectivo: 2021,
    fechaIniClases: "2021-03-02T00:00:00.000Z",
    fechaCiere1T: "2021-06-01T00:00:00.000Z",
    fechaCiere2T: "2021-09-01T00:00:00.000Z",
    fechaCiere3T: "2021-12-02T00:00:00.000Z",
    fechaFinInscripcion: "2021-02-28T00:00:00.000Z"
}

const oidResponsable = "5f99d2b469722c2260d0f290";

const alumno = {
    dni: "98765432",
    tipoDni: "DNI",
    nombre: "Agustín",
    apellido: "Gutierrez",
    genero: "Masculino",
    fechaNacimiento: "2006-05-10T00:00:00.000Z",
    lugarNacimiento: "Cipolletti",
    legajo: "5000",
    nombreEscuelaAnt: "Limay",
    anioCorrespondiente: 2,
};

const personaAlumno = {
    dni: alumno.dni,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    genero: alumno.genero,
}

const datosAlumno = {
    tipoDni: alumno.tipoDni,
    fechaNacimiento: alumno.fechaNacimiento,
    lugarNacimiento: alumno.lugarNacimiento,
    nombreEscuelaAnt: alumno.nombreEscuelaAnt,
    anioCorrespondiente: alumno.anioCorrespondiente,
}

const alumnoEsperado = {
    dni: personaAlumno.dni,
    tipoDni: alumno.tipoDni,
    nombre: alumno.nombre,
    apellido: alumno.apellido,
    genero: alumno.genero,
    fechaNacimiento: alumno.fechaNacimiento,
    legajo: '7',    
    nombreEscuelaAnt: alumno.nombreEscuelaAnt,
    anioCorrespondiente: alumno.anioCorrespondiente,
    estadoInscripcion: 'Inscripto'
}

const personaResponsable = {
    dni: "98765431",
    nombre: "Mariana",
    apellido: "Estevez",
    genero: "Femenino",
}

const datosResponsable = {
    cuitCuil: "1987654311",
    telefono: "556841234",
    email: "mariana.estevez@gmail.com",
    calle: "Irigoyen",
    altura: 200,
    barrio: "Huliches",
    localidad: "Cipolletti",
    codigoPostal: 8324,
    provincia: "Río Negro"
}

const responsableCompleto = {
    responsable: {
        dni: "98765431",
        nombre: "Mariana",
        apellido: "Estevez",
        genero: "Femenino",
        cuitCuil: "1987654311",
        telefono: "556841234",
        email: "mariana.estevez@gmail.com",
        calle: "Irigoyen",
        altura: 200,
        barrio: "Huliches",
        localidad: "Cipolletti",
        codigoPostal: 8324,
        provincia: "Río Negro"
    }
}

const responsableEsperado = {
    responsable: {
        cuitCuil: "1987654311",
        telefono: "556841234",
        email: "mariana.estevez@gmail.com",
        calle: "Irigoyen",
        altura: 200,
        legajo: "1",
        barrio: "Huliches",
        localidad: "Cipolletti",
        codigoPostal: 8324,
        provincia: "Río Negro"
    },
    dni: "98765431",
    nombre: "Mariana",
    apellido: "Estevez",
    genero: "Femenino",
}

module.exports = {
    cicloValido,
    oidResponsable,
    alumno,
    personaAlumno,
    datosAlumno,
    alumnoEsperado,
    personaResponsable,
    datosResponsable,
    responsableCompleto,
    responsableEsperado
}