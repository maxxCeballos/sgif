'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';

describe('Inscribir Alumno', function () {

    /*it('Debería responder fecha inválida', (done) => {
        chai.request(url)
            .get('/insc-alumno/validar-fecha')
            .end(function (err, res) {
                console.log(res.body)
                expect(res.body).to.have.property('valido').to.be.equal(false);
                expect(res).to.have.status(200);
                done();
            });
    }).timeout(0);*/
    
    it('Debería responder fecha inválida', (done) => {
        chai.request(url)
            .get('/insc-alumno/validar-fecha')
            .end(function (err, res) {
                console.log(res.body)
                expect(res.body.response).to.have.property('valido').to.be.equal(false);
                expect(res).to.have.status(200);
                done();
            });
    }).timeout(0);

});