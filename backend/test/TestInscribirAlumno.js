'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

const { crearCicloLectivo, eliminarCicloLectivo, crearAlumno, eliminarAlumno } = require('./generadores/inscribir-alumno');

//DATOS PARA TESTING
const cicloValido = {
    cicloLectivo: 2021,
    fechaIniClases: "2021-03-02T00:00:00.000Z",
    fechaCiere1T: "2021-06-01T00:00:00.000Z",
    fechaCiere2T: "2021-09-01T00:00:00.000Z",
    fechaCiere3T: "2021-12-02T00:00:00.000Z",
    fechaFinInscripcion: "2021-02-28T00:00:00.000Z"
}
const oidResponsable = "5f99d2b469722c2260d0f290";
const alumno = {
    dni: "98765432",
    tipoDni: "DNI",
    nombre: "Agustín",
    apellido: "Gutierrez",
    genero: "Masculino",
    fechaNacimiento: "2006-05-10T00:00:00.000+00:00",
    lugarNacimiento: "Cipolletti",
    legajo: "5000",
    anioCorrespondiente: 2,
};

//TESTING
before(async function () {
    let espera = new Promise((res, req) => {
        setTimeout(() => res('success'), 5000)
    })
    await espera.then((res) => console.log("Base lista: ", res));
})

describe('Inscribir Alumno', function () {

    //Camino 1
    it('Debería responder fecha inválida', (done) => {

        //Verifica que la fecha retornada sea inválida
        requester
            .get('/insc-alumno/validar-fecha')
            .end(function (err, res) {

                expect(res.body.response).to.have.property('valido').to.be.equal(false);
                expect(res).to.have.status(200);
                done();

            });
    }).timeout(0);

    //Camino 2
    it('Debería fallar alumno Inscripto, Reinscripto o Egresado', (done) => {

        crearCicloLectivo(cicloValido).then(response1 => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {

                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    alumno.estadoInscripcion = "Inscripto";
                    crearAlumno(alumno, oidResponsable).then(response2 => {
                        //Verifico que el alumno Exista y no se pueda reinscribir                    
                        requester
                            .get('/insc-alumno/alumno/' + alumno.dni)
                            .end(function (err, res) {

                                expect(res.body.response).to.have.property('valido').to.be.equal(false);
                                expect(res).to.have.status(200);

                                //Elimino Recursos
                                Promise.all([eliminarCicloLectivo(), eliminarAlumno()])
                                    .then(resp => {
                                        console.log("Recursos eliminados")
                                        done();
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //Camino 3
    it('Debería fallar al reinscribir alumno', (done) => {

        crearCicloLectivo(cicloValido).then(response1 => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {

                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    alumno.estadoInscripcion = "No Inscripto";
                    crearAlumno(alumno, oidResponsable).then(alumnoDB => {
                        //Verifico que el alumno Exista y se pueda reinscribir
                        requester
                            .get('/insc-alumno/alumno/' + alumno.dni)
                            .end(function (err, res) {

                                expect(res.body.response).to.include({
                                    valido: true,
                                    operacion: "Reinscribir"
                                })
                                expect(res).to.have.status(200);

                                const oidAlumno = res.body.response.alumnoDB._id;

                                //Envío Año Reinscripción Inválido
                                requester
                                    .put('/insc-alumno/alumno/' + oidAlumno)
                                    .query({ anio: 7 })
                                    .end(function (err, res) {
                                        expect(res).to.have.status(400);

                                        //Elimino Recursos
                                        Promise.all([eliminarCicloLectivo(), eliminarAlumno()])
                                            .then(resp => {
                                                console.log("Recursos eliminados")
                                                done();
                                            });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //Camino 4
    it('Debería Reinscribir Alumno', (done) => {

        crearCicloLectivo(cicloValido).then(response1 => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {

                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    alumno.estadoInscripcion = "No Inscripto";
                    crearAlumno(alumno, oidResponsable).then(alumnoDB => {
                        requester
                            .get('/insc-alumno/alumno/' + alumno.dni)
                            .end(function (err, res) {

                                expect(res.body.response).to.include({
                                    valido: true,
                                    operacion: "Reinscribir"
                                })
                                expect(res).to.have.status(200);

                                const oidAlumno = res.body.response.alumnoDB._id;
                                //Envío Año Reinscripción Válido
                                const anioR = 3;
                                requester
                                    .put('/insc-alumno/alumno/' + oidAlumno)
                                    .query({ anio: anioR })
                                    .end(function (err, res) {
                                        expect(res.body.response).to.include({
                                            _id: oidAlumno,
                                            dni: alumno.dni,
                                            anioCorrespondiente: anioR,
                                            estadoInscripcion: "Reinscripto"
                                        });
                                        expect(res).to.have.status(200);

                                        //Elimino Recursos
                                        Promise.all([eliminarCicloLectivo(), eliminarAlumno()])
                                            .then(resp => {
                                                console.log("Recursos eliminados")
                                                done();
                                            });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

});