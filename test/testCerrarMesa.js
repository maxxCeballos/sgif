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
    if (!serverOn) {
        throw "Error Servidor Apagado"
    }
});

after(function () {
    databaseHandler.desconectar();
});

describe('No Devuelve Mesas', () => {
    xit('Debería informar que no hay mesas', async function () {
        //No anda si hay mesas ya cargadas externamente
        this.timeout(0);

        let consulta = await obtenerTodasMesas();

        assert.equal(consulta.expanded, "No hay mesas")
    })

    it('Debería informar que no hay mesas (por no estar en estado Solicitada)', async function () {
        this.timeout(0);

        //* Datos a precargar
        let mesaExamen = {
            acta: 5021,
            estado: "Solicitada",
        }

        await mesaExamenDB.createMesaExamen(mesaExamen);

        //* Consulta a Testear
        let consulta = await obtenerTodasMesas();

        //* Limpieza
        let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
        assert.equal(responseMesa.deletedCount, 1)

        //* Test de Transaccion
        if (typeof consulta.expanded === 'string') {
            assert.equal(consulta.expanded, "No hay mesas")
        } else {
            let actasMesas = consulta.response.map(mesa => {
                return mesa.acta;
            })
            expect(actasMesas).to.not.include.members([mesaExamen.acta]);
        }
    })

    it('Debería informar que no hay mesas (por no estar en estado Cerrada)', async function () {
        this.timeout(0);

        //* Datos a precargar
        let mesaExamen = {
            acta: 5022,
            estado: "Cerrada",
        }

        await mesaExamenDB.createMesaExamen(mesaExamen);

        //* Consulta a Testear
        let consulta = await obtenerTodasMesas();

        //* Limpieza
        let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
        assert.equal(responseMesa.deletedCount, 1)

        //* Test de Transaccion
        if (typeof consulta.expanded === 'string') {
            assert.equal(consulta.expanded, "No hay mesas")
        } else {
            let actasMesas = consulta.response.map(mesa => {
                return mesa.acta;
            })
            expect(actasMesas).to.not.include.members([mesaExamen.acta]);
        }
    })

    it('Debería informar que no hay mesas (porque no sucedio)', async function () {
        this.timeout(0);

        //* Datos a precargar
        let fechaHora = crearFecha(1);

        let mesaExamen = {
            acta: 5023,
            estado: "Completada",
            fechaHora,
        }

        await mesaExamenDB.createMesaExamen(mesaExamen);

        //* Consulta a Testear
        let consulta = await obtenerTodasMesas();

        //* Limpieza
        let responseMesa = (await mesaExamenDB.deleteMesaExamen(mesaExamen.acta))
        assert.equal(responseMesa.deletedCount, 1)

        //* Test de Transaccion
        if (typeof consulta.expanded === 'string') {
            assert.equal(consulta.expanded, "No hay mesas")
        } else {
            let actasMesas = consulta.response.map(mesa => {
                return mesa.acta;
            })
            expect(actasMesas).to.not.include.members([mesaExamen.acta]);
        }
    })
});

describe('Mesa Cerrada Correctamente', () => {
    it('Deberia cargar un alumno aprobado, otro desaprobado, y otro ausente para la mesa de Matematicas', async function () {
        this.timeout(0);

        //* Datos a precargar
        let dictado1 = {
            cicloLectivo: 2008,
            materia: {
                nombre: "Matematicas",
                anio: 3
            }
        }
        let dictado1Obj = await dictadoDB.createDictado(dictado1);

        let dictado2 = {
            cicloLectivo: 2008,
            materia: {
                nombre: "Lengua",
                anio: 3
            }
        }
        let dictado2Obj = await dictadoDB.createDictado(dictado2);

        let dictado3 = {
            cicloLectivo: 2008,
            materia: {
                nombre: "Fisica",
                anio: 3
            }
        }
        let dictado3Obj = await dictadoDB.createDictado(dictado3);

        let resultadoMesa1Obj = await resultadoMesaDB.createResultadoMesa({});
        let resultadoMesa2Obj = await resultadoMesaDB.createResultadoMesa({});
        let resultadoMesa3Obj = await resultadoMesaDB.createResultadoMesa({});

        // Aprueba
        let alumno1 = {
            dni: 50123020,
            tipoDni: "dni",
            nombre: "Guido0",
            apellido: "Canevello0",
            legajo: 1520,
            calificaciones: [{
                nota1T: 4,
                nota2T: 4,
                nota3T: 4,
                cicloLectivo: 2009,
                promedio: 4,
                condicion: "Desaprobado",
                resultadoMesaExamen: [resultadoMesa1Obj._id],
                dictado: dictado1Obj._id
            }]
        }
        let alumno1Obj = await alumnoDB.createAlumno(alumno1);

        // Desaprueba
        let alumno2 = {
            dni: 50123021,
            tipoDni: "dni",
            nombre: "Guido1",
            apellido: "Canevello1",
            legajo: 1521,
            calificaciones: [{
                nota1T: 4,
                nota2T: 4,
                nota3T: 4,
                cicloLectivo: 2009,
                promedio: 4,
                condicion: "Desaprobado",
                resultadoMesaExamen: [resultadoMesa2Obj._id],
                dictado: dictado1Obj._id
            }]
        }
        let alumno2Obj = await alumnoDB.createAlumno(alumno2);

        // Ausente
        let alumno3 = {
            dni: 50123022,
            tipoDni: "dni",
            nombre: "Guido2",
            apellido: "Canevello2",
            legajo: 1522,
            calificaciones: [{
                nota1T: 4,
                nota2T: 4,
                nota3T: 4,
                cicloLectivo: 2009,
                promedio: 4,
                condicion: "Desaprobado",
                resultadoMesaExamen: [resultadoMesa3Obj._id],
                dictado: dictado1Obj._id
            }]
        }
        let alumno3Obj = await alumnoDB.createAlumno(alumno3);

        let fechaHora = crearFecha(-1);
        let mesaExamen1 = {
            acta: 5023,
            estado: "Completada",
            aula: 3,
            fechaHora,
            resultados: [
                resultadoMesa1Obj._id,
                resultadoMesa2Obj._id,
                resultadoMesa3Obj._id,
            ],
            dictado: dictado1Obj._id
        }
        let mesaExamen1Obj = await mesaExamenDB.createMesaExamen(mesaExamen1);
        await resultadoMesaDB.updateResultadoMesa(resultadoMesa1Obj._id, {
            alumno: alumno1Obj._id,
            mesaDeExamen: mesaExamen1Obj._id
        });
        await resultadoMesaDB.updateResultadoMesa(resultadoMesa2Obj._id, {
            alumno: alumno2Obj._id,
            mesaDeExamen: mesaExamen1Obj._id
        });
        await resultadoMesaDB.updateResultadoMesa(resultadoMesa3Obj._id, {
            alumno: alumno3Obj._id,
            mesaDeExamen: mesaExamen1Obj._id,
        });

        let mesaExamen2 = {
            acta: 5024,
            estado: "Completada",
            aula: 4,
            fechaHora,
            dictado: dictado2Obj._id
        }
        let mesaExamen2Obj = await mesaExamenDB.createMesaExamen(mesaExamen2);

        let mesaExamen3 = {
            acta: 5025,
            estado: "Completada",
            aula: 5,
            fechaHora,
            dictado: dictado3Obj._id
        }
        let mesaExamen3Obj = await mesaExamenDB.createMesaExamen(mesaExamen3);

        //* Consulta a Testear
        let consultaObtenerTodasMesas = await obtenerTodasMesas();

        let mesaAElegir = consultaObtenerTodasMesas.response.find(
            mesa => mesa.nombreMateria === dictado1.materia.nombre
        )
        let consultaObtenerAlumnosMesa = await obtenerAlumnosMesa(mesaAElegir.oidMesa);

        let notas = [
            {
                oidResultado: consultaObtenerAlumnosMesa.response[0].oidResultado,
                oidAlumno: consultaObtenerAlumnosMesa.response[0].oidAlumno,
                nota: 6
            },
            {
                oidResultado: consultaObtenerAlumnosMesa.response[1].oidResultado,
                oidAlumno: consultaObtenerAlumnosMesa.response[1].oidAlumno,
                nota: 2
            },
            {
                oidResultado: consultaObtenerAlumnosMesa.response[2].oidResultado,
                oidAlumno: consultaObtenerAlumnosMesa.response[2].oidAlumno,
                condicion: "Ausente"
            }
        ];
        let consultaCargarNotasMesa = await cargarNotasMesa(mesaAElegir.oidMesa, notas);

        resultadoMesa1Obj = await resultadoMesaDB.getResultadoMesa(resultadoMesa1Obj);
        resultadoMesa2Obj = await resultadoMesaDB.getResultadoMesa(resultadoMesa2Obj);
        resultadoMesa3Obj = await resultadoMesaDB.getResultadoMesa(resultadoMesa3Obj);
        alumno1Obj = await alumnoDB.getAlumno(alumno1.dni);
        mesaExamen1Obj = await mesaExamenDB.getMesaExamen(mesaExamen1.acta);

        //* Limpieza
        let responseDictado1 = (await dictadoDB.deleteDictado(dictado1Obj._id));
        let responseDictado2 = (await dictadoDB.deleteDictado(dictado2Obj._id));
        let responseDictado3 = (await dictadoDB.deleteDictado(dictado3Obj._id));
        let responseResultado1 = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesa1Obj._id))
        let responseResultado2 = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesa2Obj._id))
        let responseResultado3 = (await resultadoMesaDB.deleteResultadoMesa(resultadoMesa3Obj._id))
        let responseAlumno1 = (await alumnoDB.deleteAlumno(alumno1.dni));
        let responseAlumno2 = (await alumnoDB.deleteAlumno(alumno2.dni));
        let responseAlumno3 = (await alumnoDB.deleteAlumno(alumno3.dni));
        let responseMesa1 = (await mesaExamenDB.deleteMesaExamen(mesaExamen1.acta))
        let responseMesa2 = (await mesaExamenDB.deleteMesaExamen(mesaExamen2.acta))
        let responseMesa3 = (await mesaExamenDB.deleteMesaExamen(mesaExamen3.acta))

        assert.equal(responseDictado1.deletedCount, 1)
        assert.equal(responseDictado2.deletedCount, 1)
        assert.equal(responseDictado3.deletedCount, 1)
        assert.equal(responseResultado1.deletedCount, 1)
        assert.equal(responseResultado2.deletedCount, 1)
        assert.equal(responseResultado3.deletedCount, 1)
        assert.equal(responseAlumno1.deletedCount, 1)
        assert.equal(responseAlumno2.deletedCount, 1)
        assert.equal(responseAlumno3.deletedCount, 1)
        assert.equal(responseMesa1.deletedCount, 1)
        assert.equal(responseMesa2.deletedCount, 1)
        assert.equal(responseMesa3.deletedCount, 1)

        //* Test de Transaccion
        // Hay que verificar uno por uno, ya que pueden estar en distinta posicion
        let esperadoObtenerTodasMesas = [
            {
                oidMesa: String(mesaExamen1Obj._id),
                acta: mesaExamen1.acta,
                fechaHora: String(mesaExamen1.fechaHora),
                aula: mesaExamen1.aula,
                cicloLectivoMateria: dictado1.cicloLectivo,
                nombreMateria: dictado1.materia.nombre,
                anioMateria: dictado1.materia.anio,
            }, {
                oidMesa: String(mesaExamen2Obj._id),
                acta: mesaExamen2.acta,
                fechaHora: String(mesaExamen2.fechaHora),
                aula: mesaExamen2.aula,
                cicloLectivoMateria: dictado2.cicloLectivo,
                nombreMateria: dictado2.materia.nombre,
                anioMateria: dictado2.materia.anio,
            }, {
                oidMesa: String(mesaExamen3Obj._id),
                acta: mesaExamen3.acta,
                fechaHora: String(mesaExamen3.fechaHora),
                aula: mesaExamen3.aula,
                cicloLectivoMateria: dictado3.cicloLectivo,
                nombreMateria: dictado3.materia.nombre,
                anioMateria: dictado3.materia.anio,
            },
        ];

        let esperadoObtenerAlumnosMesa = [
            {
                oidResultado: String(resultadoMesa1Obj._id),
                oidAlumno: String(alumno1Obj._id),
                nombre: alumno1.nombre,
                apellido: alumno1.apellido,
                legajo: String(alumno1.legajo),
            }, {
                oidResultado: String(resultadoMesa2Obj._id),
                oidAlumno: String(alumno2Obj._id),
                nombre: alumno2.nombre,
                apellido: alumno2.apellido,
                legajo: String(alumno2.legajo),
            }, {
                oidResultado: String(resultadoMesa3Obj._id),
                oidAlumno: String(alumno3Obj._id),
                nombre: alumno3.nombre,
                apellido: alumno3.apellido,
                legajo: String(alumno3.legajo),
            },
        ]

        expect(consultaObtenerTodasMesas.response).to.deep.include.members(esperadoObtenerTodasMesas);

        assert.equal(consultaObtenerAlumnosMesa.response.length, esperadoObtenerTodasMesas.length)
        expect(consultaObtenerAlumnosMesa.response).to.deep.include.members(esperadoObtenerAlumnosMesa);

        assert.equal(consultaCargarNotasMesa.response.mensaje, "Mesa Cerrada con Éxito")
        assert.equal(mesaExamen1Obj.estado, "Cerrada")
        expect(alumno1Obj.calificaciones[0]).to.deep.include({
            condicion: "Aprobado",
            notaFinal: notas[0].nota
        })
        expect(resultadoMesa1Obj).to.deep.include({
            condicion: "Aprobado",
            nota: notas[0].nota
        })
        expect(resultadoMesa2Obj).to.deep.include({
            condicion: "Desaprobado",
            nota: notas[1].nota
        })
        expect(resultadoMesa3Obj).to.deep.include({
            condicion: "Ausente",
        })
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

async function obtenerTodasMesas() {
    return await axios
        .get(`${urlBackend}/cerrar-mesa/obtener-todas-mesas`)
        .then((res) => {
            return res.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}

async function obtenerAlumnosMesa(oidMesa) {
    return await axios
        .get(`${urlBackend}/cerrar-mesa/obtener-alumnos-mesa/${oidMesa}`)
        .then((res) => {
            return res.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}

async function cargarNotasMesa(oidMesa, notas) {
    return await axios
        .put(`${urlBackend}/cerrar-mesa/cargar-notas-mesa/${oidMesa}`, notas)
        .then((res) => {
            return res.data;
        })
        .catch((res) => {
            return res.response.data;
        });
}