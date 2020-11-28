const axios = require('axios');
const assert = require("chai").assert;
const alumnoDB = require('../controllers/alumno');
const databaseHandler = require('../databaseHandler');

const urlBackend = "http://localhost:5000";

before(async function () {
    await databaseHandler.conectar();
});

after(function () {
    databaseHandler.desconectar();
});

describe('Legajo Incorrecto', () => {
    it('Deberia solicitar legajo', async function () {
        let consulta = await obtenerDictados("");

        assert.equal(consulta.expanded, "Por Favor, Ingrese un Legajo");
    })

    it('Deberia solicitar legajo con formato correcto', async function () {
        let consulta = await obtenerDictados("Legajo Incorrecto");

        assert.equal(consulta.expanded, "El Legajo no es Correcto");
    })

    it('Deberia informar que no existe el Alumno', async function () {
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

// TODO: cambios de diseño

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

        let alumnoConsultar = await alumnoDB.getAlumno(alumnoTest.dni);

        let response = (await alumnoDB.deleteAlumno(alumnoTest.dni));

        // console.log(response);

        assert.exists(alumnoCrear._id);
        assert.equal(response.deletedCount, 1)
    })
})

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
