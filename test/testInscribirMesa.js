const alumnoDB = require('./controllers/alumno');
const resultadoMesaDB = require('./controllers/resultadoMesa');
const mesaExamenDB = require('./controllers/mesaExamen');
const dictadoDB = require('./controllers/dictado');

const axios = require('axios');
const assert = require("chai").assert;
const urlBackend = "http://localhost:5000";
const databaseHandler = require('./databaseHandler');
const { expect } = require('chai');

const serverOn = true;

before(async function () {
    this.timeout(0);
    await databaseHandler.conectar(serverOn);
    if(!serverOn){
        throw "Error Servidor Apagado"
    }
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

        // Datos a precargar
        let alumno = {
            dni: 50123001,
            tipoDni: "dni",
            nombre: "Guido",
            apellido: "Canevello",
            legajo: 1501,
        }

        await alumnoDB.createAlumno(alumno);

        // Consulta a Testear
        let consulta = await obtenerDictados(alumno.legajo);

        // Limpieza 
        let response = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(response.deletedCount, 1)

        // Test de Transaccion
        assert.equal(consulta.expanded, "Alumno sin Calificaciones");
    })

    it('Deberia informar que tiene materias pero no desaprobadas', async function () {
        this.timeout(0);

        // Datos a precargar
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

        // Consulta a Testear
        let consulta = await obtenerDictados(alumno.legajo);

        // Limpieza 
        let response = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(response.deletedCount, 1)

        // Test de Transaccion
        assert.equal(consulta.expanded, "Alumno sin Calificaciones Desaprobadas");
    })
})

describe('Mesa de Castigo', () => {
    it('Deberia informar que esta en Mesa de Castigo', async function () {
        this.timeout(0);

        // Datos a precargar
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

        // Consulta a Testear
        let consulta = await obtenerDictados(alumno.legajo);

        // Limpieza 
        let responseResultado = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesaObj._id))
        let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
        let responseAlumno = (await alumnoDB.deleteAlumno(alumno.dni));
        assert.equal(responseResultado.deletedCount, 1)
        assert.equal(responseMesa.deletedCount, 1)
        assert.equal(responseAlumno.deletedCount, 1)

        // Test de Transaccion
        assert.equal(consulta.expanded, "Alumno estuvo Ausente en la Ultima Mesa con id: " + mesaExamenObj._id);
    })
})

//TODO dar a elegir las fechas para anotarse

describe('Transacciones Correctas', () => {
    it('Deberia informar que se anoto en una Solicitada y no tener problemas con la ausencia',
        async function () {
            this.timeout(0);

            // Datos a precargar
            let resultadoMesa = {
                condicion: "Ausente",
            }

            let resultadoMesaObj = await resultadoMesaDB.createResultadoMesa(resultadoMesa);

            let dictado = {
                cicloLectivo: 2008,
                materia: {
                    nombre: "Matematicas",
                    anio: 3
                }
            }

            let dictadoObj = await dictadoDB.createDictado(dictado);

            let alumno = {
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
                    resultadoMesaExamen: [resultadoMesaObj._id],
                    dictado: dictadoObj._id
                }]
            }

            let fechaHora = crearFecha(-3);

            let mesaExamen = {
                acta: 5001,
                fechaHora,
                estado: "Cerrada",
                resultados: [resultadoMesaObj._id],
                dictado: dictadoObj._id
            }

            let alumnoObj = await alumnoDB.createAlumno(alumno);
            let mesaExamenObj = await mesaExamenDB.createMesaExamen(mesaExamen);

            await resultadoMesaDB.updateResultadoMesa(resultadoMesaObj._id, {
                alumno: alumnoObj._id,
                mesaDeExamen: mesaExamenObj._id
            });

            // Consulta a Testear
            let consultaObtenerDictados = await obtenerDictados(alumno.legajo);
            let consultaRegistrarMesa = await registrarMesa(
                consultaObtenerDictados.response.idAlumno,
                {
                    id: consultaObtenerDictados.response.dictados[0].id,
                    nombreMateria: consultaObtenerDictados.response.dictados[0].nombreMateria,
                    anioMateria: consultaObtenerDictados.response.dictados[0].anioMateria,
                    cicloLectivo: consultaObtenerDictados.response.dictados[0].cicloLectivo,
                });

            let mesaCreadaTransaccionObj = await mesaExamenDB.getMesaExamen(
                consultaRegistrarMesa.response.acta);

            alumnoObj = await alumnoDB.getAlumno(alumno.dni);
            let idResultadoCreadoTransaccion = alumnoObj.calificaciones[0].resultadoMesaExamen
                .find(resultado => String(resultado) !== String(resultadoMesaObj._id));
            let resultadoCreadoTransaccionObj = await resultadoMesaDB.getResultadoMesa(idResultadoCreadoTransaccion);

            // Limpieza
            let responseDictado = (await dictadoDB.deleteDictado(dictadoObj._id));
            let responseResultadoCreadoTransaccion = (await resultadoMesaDB.deleteResultadoMesa(
                idResultadoCreadoTransaccion))
            let responseResultado = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesaObj._id))
            let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
            let responseMesaCreadaTransaccion = (await mesaExamenDB.deleteMesaExamen(
                consultaRegistrarMesa.response.acta))
            let responseAlumno = (await alumnoDB.deleteAlumno(alumno.dni));

            assert.equal(responseDictado.deletedCount, 1)
            assert.equal(responseResultadoCreadoTransaccion.deletedCount, 1)
            assert.equal(responseResultado.deletedCount, 1)
            assert.equal(responseMesaCreadaTransaccion.deletedCount, 1)
            assert.equal(responseMesa.deletedCount, 1)
            assert.equal(responseAlumno.deletedCount, 1)

            // Test de Transaccion
            let esperadoObtenerDictados = {
                idAlumno: String(alumnoObj._id),
                dictados: [
                    {
                        id: String(dictadoObj._id),
                        nombreMateria: dictado.materia.nombre,
                        anioMateria: dictado.materia.anio,
                        cicloLectivo: dictado.cicloLectivo,
                    },
                ],
            }
            expect(consultaObtenerDictados.response).to.deep.include(esperadoObtenerDictados);

            assert.equal(
                consultaRegistrarMesa.response.mensaje,
                "Inscripción Exitosa, será notificado cuando se establezca fecha, hora y aula"
            );
            expect(consultaRegistrarMesa.response).to.have.deep.property('acta');

            let esperadoMesaRegistrada = {
                estado: "Solicitada",
                resultados: [idResultadoCreadoTransaccion]
            }// En esta verificacion se fija si el alumno y la mesa tienen el mismo resultado
            expect(mesaCreadaTransaccionObj).to.deep.include(esperadoMesaRegistrada);

            let esperadoResultadoRegistrado = {
                alumno: alumnoObj._id,
                mesaDeExamen: mesaCreadaTransaccionObj._id,
            }
            expect(resultadoCreadoTransaccionObj).to.deep.include(esperadoResultadoRegistrado);
        })

    it('Deberia informar que se anoto en una Completada y dar solo dos opciones de Dictado',
        async function () {
            this.timeout(0);

            // Datos a precargar
            let dictado1 = {
                cicloLectivo: 2008,
                materia: {
                    nombre: "Biologia",
                    anio: 2
                }
            }
            let dictado1Obj = await dictadoDB.createDictado(dictado1);

            let dictado2 = {
                cicloLectivo: 2009,
                materia: {
                    nombre: "Educacion Física",
                    anio: 3
                }
            }
            let dictado2Obj = await dictadoDB.createDictado(dictado2);

            let dictado3 = {
                cicloLectivo: 2009,
                materia: {
                    nombre: "Lengua",
                    anio: 3
                }
            }
            let dictado3Obj = await dictadoDB.createDictado(dictado3);

            let alumno = {
                dni: 50123005,
                tipoDni: "dni",
                nombre: "Guido",
                apellido: "Canevello",
                legajo: 1505,
                calificaciones: [{
                    nota1T: 4,
                    nota2T: 4,
                    nota3T: 4,
                    cicloLectivo: 2018,
                    promedio: 4,
                    condicion: "Desaprobado",
                    dictado: dictado1Obj._id
                }, {
                    nota1T: 4,
                    nota2T: 4,
                    nota3T: 4,
                    cicloLectivo: 2019,
                    promedio: 4,
                    condicion: "Desaprobado",
                    dictado: dictado2Obj._id
                }, {
                    nota1T: 7,
                    nota2T: 7,
                    nota3T: 7,
                    cicloLectivo: 2019,
                    promedio: 7,
                    notaFinal: 7,
                    condicion: "Aprobado",
                    dictado: dictado3Obj._id
                }]
            }

            let fechaHora = crearFecha(0);

            let mesaExamen = {
                acta: 5002,
                aula: 3,
                fechaHora,
                estado: "Completada",
                dictado: dictado1Obj._id
            }

            await alumnoDB.createAlumno(alumno);
            await mesaExamenDB.createMesaExamen(mesaExamen);

            // Consulta a Testear
            let consultaObtenerDictados = await obtenerDictados(alumno.legajo);

            let datosDictado = consultaObtenerDictados.response.dictados
                .find(dictado => dictado.nombreMateria === dictado1.materia.nombre)
            let consultaRegistrarMesa = await registrarMesa(
                consultaObtenerDictados.response.idAlumno,
                {
                    id: datosDictado.id,
                    nombreMateria: datosDictado.nombreMateria,
                    anioMateria: datosDictado.anioMateria,
                    cicloLectivo: datosDictado.cicloLectivo,
                });

            let mesaExamenObj = await mesaExamenDB.getMesaExamen(mesaExamen.acta);
            let alumnoObj = await alumnoDB.getAlumno(alumno.dni);

            let calificacionAux = alumnoObj.calificaciones
                .find(calificacion => String(calificacion.dictado) === String(dictado1Obj._id));
            let idResultadoCreadoTransaccion = calificacionAux.resultadoMesaExamen[0]
            let resultadoCreadoTransaccionObj = await resultadoMesaDB.getResultadoMesa(
                idResultadoCreadoTransaccion);

            // Limpieza
            let responseDictado1 = (await dictadoDB.deleteDictado(dictado1Obj._id));
            let responseDictado2 = (await dictadoDB.deleteDictado(dictado2Obj._id));
            let responseDictado3 = (await dictadoDB.deleteDictado(dictado3Obj._id));
            let responseResultadoCreadoTransaccion = (await resultadoMesaDB.deleteResultadoMesa(
                idResultadoCreadoTransaccion))
            let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
            let responseAlumno = (await alumnoDB.deleteAlumno(alumno.dni));

            assert.equal(responseDictado1.deletedCount, 1)
            assert.equal(responseDictado2.deletedCount, 1)
            assert.equal(responseDictado3.deletedCount, 1)
            assert.equal(responseResultadoCreadoTransaccion.deletedCount, 1)
            assert.equal(responseMesa.deletedCount, 1)
            assert.equal(responseAlumno.deletedCount, 1)

            // Test de Transaccion
            let esperadoObtenerDictados = {
                idAlumno: String(alumnoObj._id),
                dictados: [
                    {
                        id: String(dictado1Obj._id),
                        nombreMateria: dictado1.materia.nombre,
                        anioMateria: dictado1.materia.anio,
                        cicloLectivo: dictado1.cicloLectivo,
                    }, {
                        id: String(dictado2Obj._id),
                        nombreMateria: dictado2.materia.nombre,
                        anioMateria: dictado2.materia.anio,
                        cicloLectivo: dictado2.cicloLectivo,
                    },
                ],
            }

            let noEsperadoObtenerDictados = {
                dictados: [
                    {
                        id: String(dictado3Obj._id),
                        nombreMateria: dictado3.materia.nombre,
                        anioMateria: dictado3.materia.anio,
                        cicloLectivo: dictado3.cicloLectivo,
                    },
                ]
            }

            expect(consultaObtenerDictados.response).to.deep.include(esperadoObtenerDictados);
            expect(consultaObtenerDictados.response).to.not.include(noEsperadoObtenerDictados);

            let esperadoRegistrarMesa = {
                acta: mesaExamen.acta,
                mensaje: "Inscripción Exitosa",
                fechaHora: String(mesaExamen.fechaHora),
                aula: mesaExamen.aula,
            }

            expect(consultaRegistrarMesa.response).to.deep.include(esperadoRegistrarMesa);

            assert.equal(
                String(mesaExamenObj.resultados[0]),
                String(idResultadoCreadoTransaccion)
            )

            let esperadoResultadoRegistrado = {
                alumno: alumnoObj._id,
                mesaDeExamen: mesaExamenObj._id,
            }
            expect(resultadoCreadoTransaccionObj).to.deep.include(esperadoResultadoRegistrado);
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

        let response = (await alumnoDB.deleteAlumno(alumnoTest.dni));

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
        fechaHora.setYear(fechaHora.getFullYear() + 1);
        fechaHora.setMonth(mes - 12);
    } else if (mes < 0) {
        fechaHora.setYear(fechaHora.getFullYear() - 1);
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
            return res.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}

async function registrarMesa(oidAlumno, valoresDictado) {
    return await axios
        .post(`${urlBackend}/inscribir-mesa/registrar-mesa/${oidAlumno}`, valoresDictado)
        .then((res) => {
            return res.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}
