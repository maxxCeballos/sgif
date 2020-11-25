const axios = require('axios');
const assert = require("chai").assert;
const { Assertion } = require("chai");
const urlBackend = "http://localhost:5000"

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

it(' ', async function () {
    let consulta = await obtenerDictados("99999");

    assert.equal(consulta.expanded, "No existe el Alumno");
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
