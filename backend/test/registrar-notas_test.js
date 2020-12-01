'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

describe('REGISTRAR NOTAS TRIMESTRALES', function () {

    describe('Obtener Cursos', function () {

        it('Trimestre especificado incorrecto', (done) => {
            requester
                .get('/notas-trimestrales/cursos?trimestre=4')
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);


    });


    describe('Obtener Detalle Cursos', function () {

        it('Curso especificado incorrecto', (done) => {
            requester
                .get('/notas-trimestrales/curso/detalle?cursoID=0005076a4c816f138a4a7000')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('Detalle Curso', (done) => {
            requester
                .get('/notas-trimestrales/curso/detalle?cursoID=5fc5076a4c816f138a4a712d')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response.cicloLectivo).to.equal(2020);
                    expect(res.body.response.anio).to.equal(1);
                    expect(res.body.response.division).to.equal(1);
                    done();
                });
        }).timeout(0);
    });


    describe('Calcular Presentismo', function () {

        it('Alumno especificado incorrecto', (done) => {
            requester
                .get('/notas-trimestrales/dictado/alumno?alumnoID=5f94e527ee542319f9e3b000')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);


        it('Dictado especificado incorrecto', (done) => {
            requester
                .get('/notas-trimestrales/dictado/alumno?dictadoID=000507a34c816f138a4a712f&alumnoID=5f94e527ee542319f9e3b688')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('Alumno apto para registro de nota', (done) => {
            requester
                .get('/notas-trimestrales/dictado/alumno?dictadoID=5fc507a34c816f138a4a712f&alumnoID=5f94e527ee542319f9e3b688')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    done();
                });
        }).timeout(0);

        // agregar alumno no apto para rendir
    });


    describe('Registrar Nota', function () {

        it('Trimestre especificado incorrecto', (done) => {
            requester
                .post('/notas-trimestrales/alta')
                .send({
                    "trimestre" : "4"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('Dictado especificado incorrecto', (done) => {
            requester
                .post('/notas-trimestrales/alta')
                .send({
                    "alumnoID": "5f94e527ee542319f9e3b688",
                    "trimestre" : "1",
                    "nota": 8,
                    "dictadoID": "5f8b869cda6dcc223c737540"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    expect(res.body.message).to.equal('Error: Error al Registrar nota de 1º trimestre');
                    done();
                });
        }).timeout(0);

        it('Dictado especificado incorrecto', (done) => {
            requester
                .post('/notas-trimestrales/alta')
                .send({
                    "alumnoID": "5f94e527ee542319f9e3b688",
                    "trimestre" : "2",
                    "nota": 8,
                    "dictadoID": "5f8b869cda6dcc223c737540"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    expect(res.body.message).to.equal('Error: Error al Registrar nota de 2º trimestre');
                    done();
                });
        }).timeout(0);

        it('Dictado especificado incorrecto', (done) => {
            requester
                .post('/notas-trimestrales/alta')
                .send({
                    "alumnoID": "5f94e527ee542319f9e3b688",
                    "trimestre" : "3",
                    "nota": 8,
                    "dictadoID": "5f8b869cda6dcc223c737540"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    expect(res.body.message).to.equal('Error: Error al Registrar nota de 3º trimestre');
                    done();
                });
        }).timeout(0);

        it('Registro Exitoso', (done) => {
            requester
                .post('/notas-trimestrales/alta')
                .send({
                    "alumnoID": "5f94e527ee542319f9e3b688",
                    "trimestre" : "3",
                    "nota": 8,
                    "dictadoID": "5f8b869cda6dcc223c737543"
                })
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    done();
                });
        }).timeout(0);

    });


});

