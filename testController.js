const alumnoDB = require('./test/backend/controllers/alumno');
const app = require('./backend/server');

async function testController() {
    let alumnoCrear = await alumnoDB.createAlumno({
        dni: 50000000,
        tipoDni: "dni",
        nombre: "jorge",
        apellido: "perez",
        legajo: 7999,
    })

    console.log("el alumno" + alumnoCreado);

    // let alumnoConsultar = await alumnoDB.getAlumno();

    // let response = (await alumnoDB.deleteAlumno());

    // console.log(response);
}

testController()
