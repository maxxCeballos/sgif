const alumnoDB = require('../controllers/alumno');
const resultadoMesaDB = require('../controllers/resultadoMesa');
const mesaExamenDB = require('../controllers/mesaExamen');
const dictadoDB = require('../controllers/dictado');

const databaseHandler = require('../databaseHandler');

const alumnos = [
    {
        // Alumno sin materias
        dni: 50123001,
        tipoDni: "dni",
        nombre: "Guido",
        apellido: "Canevello",
        legajo: 1501,
    }, {
        // Alumno sin materias desaprobadas
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
]

async function cargaInscribirMesa() {
    await databaseHandler.conectar(false);

    let datos = {
        dniAlumnos: [],
        idResultados: [],
        idDictados: [],
        actaMesas: [],
    }

    //AGREGAR
    await alumnoDB.createAlumno(alumnos[0]);
    datos.dniAlumnos.push(alumnos[0].dni);

    // await alumnoDB.deleteAlumno(alumnos[0].dni)

    // await alumnoDB.createAlumno(alumnos[1]);

    databaseHandler.desconectar();

    return datos;
}

/**
 * @param {*} datos {dniAlumnos, idResultados, idDictados, actaMesas}
 */
async function eliminarInscribirMesa(datos) {
    await databaseHandler.conectar(false);

    let response = true;

    //ELIMINAR
    for (const alumno of datos.dniAlumnos) {
        response = response
            && (await alumnoDB.deleteAlumno(alumno)).deletedCount === 1;
    }

    databaseHandler.desconectar();
    return response;
}

module.exports = {
    cargaInscribirMesa,
    eliminarInscribirMesa
}