'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

const { deleteCurso } = require('../controllers/curso');

describe("ALTA CURSO", () => {

    it('Año especificado incorrecto', (done) => {
        requester
            .post('/alta-curso?anio=0')
            .end( (err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.ok).to.be.false;
                done();
            });
    }).timeout(0);

    it('Existen 3 divisiones del año especificado', (done) => {
        requester
            .post('/alta-curso?anio=1')
            .end( (err, res) => {
                expect(res).to.have.status(400);
                expect(res.body.ok).to.be.false;
                done();
            });
    }).timeout(0);

    it('No exiten Materias para el año especificado', (done) => {
        requester
            .post('/alta-curso?anio=4')
            .end( (err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                done();
            });
    }).timeout(0);

    it('Alta curso exitoso. Fail send Materia', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end(  (err, resCurso) => {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

            requester
            .get('/alta-curso/profesor?materia=Quimicaa')
            .end( async (err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                expect(res.body.message).to.equal('Error: La materia Quimicaa no pertenece a la planilla de materias');
                
                await deleteCurso(resCurso.body.response.curso._id);

                done();
            });
        });
    }).timeout(0);

    it('Alta curso exitoso. Fail response Profesor', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end( (err, resCurso) => {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

            requester
            .get('/alta-curso/profesor?materia=Quimica')
            .end(async (err, res) => {
                expect(res).to.have.status(404);
                expect(res.body.ok).to.be.false;
                expect(res.body.message).to.equal('Error: No existen profesores para dar la materia Quimica');
                
                await deleteCurso(resCurso.body.response.curso._id);

                done();
            });
        });
    }).timeout(0);


    it('Alta curso exitoso. Fail send Profesor', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end( (err, resCurso) => {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

                requester
                .get('/alta-curso/profesor?materia=Biologia')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response[0].nombre).to.equal('Martin');
                    expect(res.body.response[0].apellido).to.equal('Otamendi');

                    requester
                    .post('/alta-curso/dictado')
                    .send({ dictado: {
                        "idProfesor" : "000067b5e46bd85ae46d0990"
                    }})
                    .end(async (err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body.ok).to.be.false;
                        expect(res.body.message).to.equal('Error: No existe profesor');

                        await deleteCurso(resCurso.body.response.curso._id);

                        done();
                    });

                });
        });
    }).timeout(0);

    it('Alta curso exitoso. Fail send Horarios', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end( (err, resCurso) => {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

                requester
                .get('/alta-curso/profesor?materia=Biologia')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response[0].nombre).to.equal('Martin');
                    expect(res.body.response[0].apellido).to.equal('Otamendi');

                    requester
                    .post('/alta-curso/dictado')
                    .send({ dictado: {
                        "idProfesor": res.body.response[0]._id,
                        "horarios" : "000bdb087d60576e3f2e2000"
                    }})
                    .end( async (err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body.ok).to.be.false;
                        expect(res.body.message).to.equal('Error: No se encontró horario');

                        await deleteCurso(resCurso.body.response.curso._id);

                        done();
                    });

                });

            });
    }).timeout(0);

    it('Alta curso exitoso. Fail send Curso', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end( (err, resCurso) => {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

                requester
                .get('/alta-curso/profesor?materia=Biologia')
                .end( (err, res) => {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response[0].nombre).to.equal('Martin');
                    expect(res.body.response[0].apellido).to.equal('Otamendi');

                    requester
                    .post('/alta-curso/dictado')
                    .send({ dictado: {
                        "idProfesor": res.body.response[0]._id,
                        "horarios" : resCurso.body.response.horarios[0]._id,
                        "idCurso": "0005076a4c816f138a4a7000"
                    }})
                    .end( async (err, res) => {
                        expect(res).to.have.status(404);
                        expect(res.body.ok).to.be.false;
                        expect(res.body.message).to.equal('Error: No se encontró el curso solicitado');

                        await deleteCurso(resCurso.body.response.curso._id);

                        done();
                    });
                });
            });
    }).timeout(0);

    it('Alta curso exitoso', (done) => {
        requester
        .post('/alta-curso?anio=5')
        .end(function (err, resCurso) {
            expect(resCurso).to.have.status(200);
            expect(resCurso.body.ok).to.be.true;

                requester
                .get(`/alta-curso/profesor?materia=${resCurso.body.response.materias[0].nombre}`)
                .end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body.ok).to.be.true;
                    expect(res.body.response[0].nombre).to.equal('Martin');
                    expect(res.body.response[0].apellido).to.equal('Otamendi');

                    requester
                    .post('/alta-curso/dictado')
                    .send({ dictado: {
                        "cicloLectivo": resCurso.body.response.curso.cicloLectivo,
                        "programa": "programaBiologia2020.pdf",
                        "idProfesor": res.body.response[0]._id,
                        "nombreMateria": resCurso.body.response.materias[0].nombre,
                        "anioMateria": 1,
                        "horarios": `${resCurso.body.response.horarios[0]._id},${resCurso.body.response.horarios[1]._id}`,
                        "idCurso": resCurso.body.response.curso._id,
                        "idPreceptor": "5fad78049f5219346048117e"
                    }})
                    .end( async (err, res) =>  {
                        expect(res).to.have.status(200);
                        expect(res.body.ok).to.be.true;

                        await deleteCurso(resCurso.body.response.curso._id);

                        done();
                    });
                });
            });
    }).timeout(0);

});