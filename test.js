const { expect } = require('chai');

let real = [
    {
        nom: "a",
        edad: 2
    }, {
        nom: "b",
        edad: 5
    }, {
        nom: "c",
        edad: 1
    }, {
        nom: "d",
        edad: 20
    },
]

// let a = [1, 2, 3]

let esperado = [
    {
        nom: "c",
        edad: 1
    }, {
        nom: "a",
        edad: 2
    }, {
        nom: "b",
        edad: 5
    },
]

// let b = [3, 1, 2]

it("Aux", () => {
    expect(real).to.deep.include.members(esperado)
})
