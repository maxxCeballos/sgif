const axios = require('axios');
const assert = require("chai").assert;
const alumnoDB = require('./controllers/alumno');
const resultadoMesaDB = require('./controllers/resultadoMesa');
const mesaExamenDB = require('./controllers/mesaExamen');
const databaseHandler = require('./databaseHandler');
const urlBackend = "http://localhost:5000";

const serverOn = false;

before(async function () {
    this.timeout(0);
    await databaseHandler.conectar(serverOn);
});

after(function () {
    databaseHandler.desconectar();
});

describe('Legajo Incorrecto', () => {
    it('Deberia solicitar legajo', async function () {
        this.timeout(0);

        let consulta = await obtenerDictados("");

        assert.equal(consulta.expanded, "Por Favor, Ingrese un Legajo");
    })

    it('Deberia solicitar legajo con formato correcto', async function () {
        this.timeout(0);

        let consulta = await obtenerDictados("Legajo Incorrecto");

        assert.equal(consulta.expanded, "El Legajo no es Correcto");
    })

    it('Deberia informar que no existe el Alumno', async function () {
        this.timeout(0);

        let consulta = await obtenerDictados("99999");

        assert.equal(consulta.expanded, "No existe el Alumno");
    })
})

describe('Sin Materias para rendir', () => {
    it('Deberia informar que no tiene materias', async function () {
        this.timeout(0);

        let alumno = {
            dni: 50123001,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1501,
        }

        await alumnoDB.createAlumno(alumno);

        let consulta = await obtenerDictados(alumno.legajo);

        let response = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(response.deletedCount, 1)
        assert.equal(consulta.expanded, "Alumno sin Calificaciones");
    })

    it('Deberia informar que tiene materias pero no desaprobadas', async function () {
        this.timeout(0);

        let alumno = {
            dni: 50123002,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1502,
            calificaciones: [{
                nota1T: 7,
                nota2T: 7,
                nota3T: 7,
                cicloLectivo: 2019,
                promedio: 7,
                notaFinal: 7,
                condicion: "Aprobado",
            }]
        }

        await alumnoDB.createAlumno(alumno);

        let consulta = await obtenerDictados(alumno.legajo);

        let response = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(response.deletedCount, 1)
        assert.equal(consulta.expanded, "Alumno sin Calificaciones Desaprobadas");
    })
})

// FIXME: ver si conviene agrupar y crear mesas para q usen varios
describe('Mesa de Castigo', () => {
    it('Deberia informar que esta en Mesa de Castigo', async function () {
        this.timeout(0);

        let resultadoMesa = {
            condicion: "Ausente",
        }

        let resultadoMesaObj = await resultadoMesaDB.createResultadoMesa(resultadoMesa);

        let alumno = {
            dni: 50123003,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1503,
            calificaciones: [{
                nota1T: 4,
                nota2T: 4,
                nota3T: 4,
                cicloLectivo: 2019,
                promedio: 4,
                condicion: "Desaprobado",
                resultadoMesaExamen: [resultadoMesaObj._id]
            }]
        }

        let fechaHora = crearFecha(-1);

        let mesaExamen = {
            acta: 5000,
            fechaHora,
            estado: "Cerrada",
            resultados: [resultadoMesaObj._id]
        }

        let alumnoObj = await alumnoDB.createAlumno(alumno);
        let mesaExamenObj = await mesaExamenDB.createMesaExamen(mesaExamen);

        await resultadoMesaDB.updateResultadoMesa(resultadoMesaObj._id, {
            alumno: alumnoObj._id,
            mesaDeExamen: mesaExamenObj._id
        });

        let consulta = await obtenerDictados(alumno.legajo);

        let responseResultado = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesaObj._id))
        let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
        let responseAlumno = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(responseResultado.deletedCount, 1)
        assert.equal(responseMesa.deletedCount, 1)
        assert.equal(responseAlumno.deletedCount, 1)
        assert.equal(consulta.expanded, "Alumno estuvo Ausente en la Ultima Mesa con id: " + mesaExamenObj._id);
    })
})


// TODO: cambios de diseño de transaccion, anotar


describe('Prueba de DB', () => {
    it('Deberia crear alumno y borrarlo', async function () {
        this.timeout(0);

        let alumnoTest = {
            dni: 50123000,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1500,
        }

        let alumnoCrear = await alumnoDB.createAlumno(alumnoTest)

        // console.log(alumnoCrear);

        let response = (await alumnoDB.deleteAlumno(alumnoTest.dni));

        // console.log(response);

        assert.exists(alumnoCrear._id);
        assert.equal(response.deletedCount, 1)
    })
})

/**
 * Crea una fecha de hoy modificada
 * 
 * @param {*} cantidadMeses la cantidad de meses que se agregan o quitan de la fecha (no debe ser mayor a 12)
 */
function crearFecha(cantidadMeses) {
    if (cantidadMeses > 12 || cantidadMeses < -12) {
        throw "Error en cantidadMeses"
    }

    let fechaHora = new Date();
    let mes = fechaHora.getMonth() + cantidadMeses;

    if (mes >= 12) {
        fechaHora.setYear(fechaHora.getYear() + 1);
        fechaHora.setMonth(mes - 12);
    } else if (mes < 0) {
        fechaHora.setYear(fechaHora.getYear() - 1);
        fechaHora.setMonth(12 + mes);
    } else {
        fechaHora.setMonth(mes);
    }
    return fechaHora;
}

async function obtenerDictados(legajo) {
    return await axios
        .get(`${urlBackend}/inscribir-mesa/obtener-dictados/${legajo}`)
        .then((res) => {
            return res.response.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}
