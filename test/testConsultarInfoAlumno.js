const app =require('../server.js');
const assert = require('chai').assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const server = 'http://localhost:3000'
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(jsonSchema);


describe('Consultar Información Básica', function () {


    //####################
    //###### TEST 1 ######
    //####################

    it('deberia devolver una lista vacia porque el alumno no existe', (done) => {
        chai.request(server).get('/consultarCalificacionesCicloActual/' + "00000009").end((err, res) => {


            expect(res).to.have.status(204);
            done();
        });




    });
    //####################
    //###### TEST 2 ######
    //####################

    it('deberia devolver una lista vacia porque el alumno no existe', (done) => {
        chai.request(server).get('/consultarInfo/' + "00000009").end((err, res) => {

            expect(res).to.have.status(204);
            done();
        });



    });
    //####################
    //###### TEST 3 ######
    //####################

    it('deberia devolver una lista vacia porque el alumno no existe', (done) => {
        chai.request(server).get('/consultarCalificacionesMateria/' + "00000009").end((err, res) => {

            expect(res).to.have.status(204);
            done();
        });



    });
    //####################
    //###### TEST 4 ######
    //####################

    it('deberia devolver una lista vacia porque el alumno no existe', (done) => {
        chai.request(server).get('/consultarInfoFamiliar/' + "00000009").end((err, res) => {
            //Busco las mesas en estado solicitada
            //expect(res.body).to.have.a('object');
            expect(res).to.have.status(204);
            done();
        });



    });
    //####################
    //###### TEST 5 ######
    //####################


    it('deberia ser exitoso consultar las calificacion del ciclo actual del alumno', (done) => {
        chai.request(server).get('/consultarCalificacionesCicloActual/' + "47776955").end((err, res) => {

            expect(res).to.have.status(200);
            expect(res.body.response).to.have.own.property('ciclo');
            expect(res.body.response).to.have.own.property('calificaciones');
            done();
        });



    });

    //####################
    //###### TEST 6 ######
    //####################



    it('deberia ser exitoso consultar observaciones,sanciones y inasistencias del cicloLEctivoActual del alumno', (done) => {
        chai.request(server).get('/consultarInfo/' + "47776955").end((err, res) => {
            //Busco las mesas en estado solicitada
            //expect(res.body).to.have.a('object');
            expect(res).to.have.status(200);
            expect(res.body.informacion).to.have.own.property('observaciones');
            expect(res.body.informacion).to.have.own.property('sanciones');
            expect(res.body.informacion).to.have.own.property('presentismos');
            done();
        });



    });



    //####################
    //###### TEST 7 ######
    //####################

    it('deberia ser exitoso consultar las calificaciones de una materia del alumno', (done) => {
        chai.request(server).get('/consultarCalificacionesMateria/' + "47776955").query({ materia: 'Geografía' }).end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.calificacionesMateria).to.have.own.property('calificaciones');
            done();
        });



    });
    //####################
    //###### TEST 8 ######
    //####################

    it('deberia ser exitoso consultar la info familiar de un alumno', (done) => {
        chai.request(server).get('/consultarInfoFamiliar/' + "47776955").end((err, res) => {
            expect(res).to.have.status(200);
            expect(res.body.familia).to.have.own.property('responsable');
            expect(res.body.familia).to.have.own.property('padres');
            expect(res.body.familia).to.have.own.property('hermanos');
            done();
        });



    });




})