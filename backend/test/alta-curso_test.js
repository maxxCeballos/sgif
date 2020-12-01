'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

describe("ALTA CURSO", function() {
    describe('create Curso', function () {

        it('Año especificado incorrecto', (done) => {
            requester
                .post('/alta-curso?anio=0')
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('Existen 3 divisiones del año especificado', (done) => {
            requester
                .post('/alta-curso?anio=1')
                .end(function (err, res) {
                    expect(res).to.have.status(400);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('No exiten Materias para el año especificado', (done) => {
            requester
                .post('/alta-curso?anio=4')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    done();
                });
        }).timeout(0);

        it('Alta curso exitoso', (done) => {
            requester
                .post('/alta-curso?anio=5')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    done();
                });
        }).timeout(0);

    });


    describe('Buscar Profesor', function () {
        
        it('Materia especificada  incorrecta', (done) => {
            requester
                .get('/alta-curso/profesor?materia=Quimicaa')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    expect(res.body.message).to.equal('Error: La materia Quimicaa no pertenece a la planilla de materias');
                    done();
                });
        }).timeout(0);

        it('No existe profesor para dar la materia', (done) => {
            requester
                .get('/alta-curso/profesor?materia=Quimica')
                .end(function (err, res) {
                    expect(res).to.have.status(404);
                    expect(res.body.ok).to.be.false;
                    expect(res.body.message).to.equal('Error: No existen profesores para dar la materia Quimica');
                    done();
                });
        }).timeout(0);

        it('Devuelve Profesor para Materia', (done) => {
            requester
                .get('/alta-curso/profesor?materia=Biologia')
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response[0].nombre).to.equal('Martin');
                    expect(res.body.response[0].apellido).to.equal('Otamendi');
                    done();
                });
        }).timeout(0);

    })


    describe('Crear Dictado', function () {

        it('Profesor especificado incorrecto', (done) => {
            requester
            .post('/alta-curso/dictado')
            .send({ dictado: {
                "idProfesor" : "000067b5e46bd85ae46d0990"
            }})
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                expect(res.body.message).to.equal('Error: No existe profesor');
                done();
            });
        }).timeout(0);


        it('Horario especificado incorrecto', (done) => {
            requester
            .post('/alta-curso/dictado')
            .send({ dictado: {
                "idProfesor": "5fad67b5e46bd85ae46d0999",
                "horarios" : "000bdb087d60576e3f2e2000"
            }})
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                expect(res.body.message).to.equal('Error: No se encontró horario');
                done();
            });
        }).timeout(0);

        it('Dictado especificado incorrecto', (done) => {
            requester
            .post('/alta-curso/dictado')
            .send({ dictado: {
                "idProfesor": "5fad67b5e46bd85ae46d0999",
                "horarios" : "5fbbdb087d60576e3f2e2aab",
                "idCurso": "0005076a4c816f138a4a7000"
            }})
            .end(function (err, res) {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                expect(res.body.message).to.equal('Error: No se encontró el curso solicitado');
                done();
            });
        }).timeout(0);

        // agregar caso exitoso
    });
});