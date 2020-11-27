const axios = require('axios');
const assert = require("chai").assert;
const alumnoDB = require('../controllers/alumno');
const databaseHandler = require('../databaseHandler');

const urlBackend = "http://localhost:5000";

before(async function () {
    console.log("se conecta");
    await databaseHandler.conectar();
});

describe('Legajo Incorrecto', () => {
    it('Deberia solicitar legajo', async function () {
        // this.timeout(0)

        let consulta = await obtenerDictados("");

        assert.equal(consulta.expanded, "Por Favor, Ingrese un Legajo");
    })

    it('Deberia solicitar legajo con formato correcto', async function () {
        let consulta = await obtenerDictados("Legajo Incorrecto");

        assert.equal(consulta.expanded, "El Legajo no es Correcto");
    })

    it('Deberia solicitar legajo existente', async function () {
        let consulta = await obtenerDictados("99999");

        assert.equal(consulta.expanded, "No existe el Alumno");
    })
})

describe('Prueba de DB', () => {

    it('Deberia crear alumno y borrarlo', async function () {
        this.timeout(0);

        let alumnoCrear = await alumnoDB.createAlumno({
            dni: 50000000,
            tipoDni: "dni",
            nombre: "jorge",
            apellido: "perez",
            legajo: 7999,
        })

        console.log(alumnoCrear);

        assert.exists(alumnoCrear._id);

        let idCreado = alumnoCrear._id;

        let alumnoConsultar = await alumnoDB.getAlumno(alumnoCrear._id);

        console.log(alumnoConsultar)

        assert.equal(alumnoConsultar, alumnoConsultar);

        let response = (await alumnoDB.deleteAlumno(alumnoCrear._id));

        console.log(response);

        assert.equal(response.deletedCount, 1)
    })

})

after(function () {
    console.log("se desconecta")
    databaseHandler.desconectar();
});

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
