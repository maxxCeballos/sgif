const alumnoDB = require('../controllers/alumno');
const resultadoMesaDB = require('../controllers/resultadoMesa');
const mesaExamenDB = require('../controllers/mesaExamen');
const dictadoDB = require('../controllers/dictado');

const databaseHandler = require('../databaseHandler');

async function cargaInscribirMesa() {
    await databaseHandler.conectar(false);

    // Creacion previa de resultados (ya que es necesario el id)
    const resultados = [
        {
            condicion: "Ausente",
        }, {
            condicion: "Ausente",
        }
    ]

    for (let i = 0; i < resultados.length; i++) {
        const res = resultados[i];
        let responseRes = await resultadoMesaDB.createResultadoMesa(res);
        resultados[i] = {
            ...res,
            obj: responseRes,
        }
    }

    // Creacion previa de dictados
    const dictados = [
        {
            cicloLectivo: 2008,
            materia: {
                nombre: "Matematicas",
                anio: 3
            },
        },
    ]

    for (let i = 0; i < dictados.length; i++) {
        const dic = dictados[i];
        let responseDic = await dictadoDB.createDictado(dic);
        dictados[i] = {
            ...dic,
            obj: responseDic,
        }
    }

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
        }, {
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
                resultadoMesaExamen: [resultados[0].obj._id]
            }]
        }, {
            dni: 50123004,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1504,
            calificaciones: [{
                nota1T: 4,
                nota2T: 4,
                nota3T: 4,
                cicloLectivo: 2019,
                promedio: 4,
                condicion: "Desaprobado",
                resultadoMesaExamen: [resultados[1].obj._id],
                dictado: dictados[0].obj._id
            }]
        }
    ]

    const mesas = [
        {
            acta: 5000,
            fechaHora: crearFecha(-1),
            estado: "Cerrada",
            resultados: [resultados[0].obj._id]
        }, {
            acta: 5001,
            fechaHora: crearFecha(-3),
            estado: "Cerrada",
            resultados: [resultados[1].obj._id],
            dictado: dictados[0].obj._id
        }
    ]

    // Agregar en DB
    for (let i = 0; i < alumnos.length; i++) {
        const alumno = alumnos[i];
        let responseRes = await alumnoDB.createAlumno(alumno);
        alumnos[i] = {
            ...alumno,
            obj: responseRes,
        }
    }

    for (let i = 0; i < mesas.length; i++) {
        const mesa = mesas[i];
        let responseRes = await mesaExamenDB.createMesaExamen(mesa);
        mesas[i] = {
            ...mesa,
            obj: responseRes,
        }
    }

    await resultadoMesaDB.updateResultadoMesa(resultados[0].obj._id, {
        alumno: alumnos[2].obj._id,
        mesaDeExamen: mesas[0].obj._id
    });

    await resultadoMesaDB.updateResultadoMesa(resultados[1].obj._id, {
        alumno: alumnos[3].obj._id,
        mesaDeExamen: mesas[1].obj._id
    });

    //Funcionalidad
    let datos = {
        dniAlumnos: [],
        objResultados: [],
        objDictados: [],
        actaMesas: [],
    }

    // Agregar a respuesta
    alumnos.forEach(al => datos.dniAlumnos.push(al.dni))
    resultados.forEach(res => datos.objResultados.push(res.obj))
    mesas.forEach(mesa => datos.actaMesas.push(mesa.acta))
    dictados.forEach(dic => datos.objDictados.push(dic.obj))
    
    databaseHandler.desconectar();
    return datos;
}

/**
 * @param {*} datos {dniAlumnos, objResultados, objDictados, actaMesas}
 */
async function eliminarInscribirMesa(datos) {
    await databaseHandler.conectar(false);

    let response = true;

    //ELIMINAR
    for (const alumno of datos.dniAlumnos) {
        response = response
            && (await alumnoDB.deleteAlumno(alumno)).deletedCount === 1;
    }

    for (const mesa of datos.actaMesas) {
        response = response
            && (await mesaExamenDB.deleteMesaExamen(mesa)).deletedCount === 1;
    }

    for (const resultado of datos.objResultados) {
        response = response
            && (await resultadoMesaDB.deleteResultadoMesa(resultado._id))
                .deletedCount === 1;
    }

    for (const dictado of datos.objDictados) {
        response = response
            && (await dictadoDB.deleteDictado(dictado._id))
                .deletedCount === 1;
    }

    databaseHandler.desconectar();
    return response;
}

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

module.exports = {
    cargaInscribirMesa,
    eliminarInscribirMesa
}