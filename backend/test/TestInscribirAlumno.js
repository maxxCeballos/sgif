'use strict'
const app = require('../server')
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

const { crearCicloLectivo, eliminarCicloLectivo, crearAlumno, crearPersona,
    crearPersonaRol, eliminarPersonaOID, eliminarAlumnoOID, eliminarPersonaDNI } = require('./generadores/inscribir-alumno');

const { cicloValido, alumno, oidResponsable, personaResponsable, datosResponsable,
    responsableEsperado, responsableCompleto, personaAlumno, datosAlumno, alumnoEsperado } = require('./datos/datosInscribirAlumno');

before(async function () {
    let espera = new Promise((res, req) => {
        setTimeout(() => res('success'), 5000)
    })
    await espera.then((res) => console.log("Base lista: ", res));
})

describe('Inscribir Alumno', function () {

    //Camino 1
    it('Debería Responder fecha inválida', (done) => {

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
    it('Debería Fallar alumno Inscripto, Reinscripto o Egresado', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    alumno.estadoInscripcion = "Inscripto";
                    crearAlumno(alumno, oidResponsable).then(alumnoDB => {
                        //Verifico que el alumno Exista y no se pueda reinscribir                    
                        requester
                            .get('/insc-alumno/alumno/' + alumno.dni)
                            .end(function (err, res) {
                                expect(res.body.response).to.have.property('valido').to.be.equal(false);
                                expect(res).to.have.status(200);
                                //Elimino Recursos
                                Promise.all([eliminarCicloLectivo(), eliminarAlumnoOID(alumnoDB._id)])
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
    it('Debería Fallar al reinscribir alumno', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
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
                                        Promise.all([eliminarCicloLectivo(), eliminarAlumnoOID(alumnoDB._id)])
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

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    //Busco un alumno que existe, para eso lo creo
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
                                        Promise.all([eliminarCicloLectivo(), eliminarAlumnoOID(alumnoDB._id)])
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

    //Camino 5
    it('Debería Reinscribir Alumno y Fallar al completar Familia', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    //Busco un alumno que existe, para eso lo creo
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

                                        //Hago una llamada inválida a Completar Familia, envío un oid que no es de un alumno                                      
                                        console.log('oidResp enviado', oidResponsable)
                                        requester
                                            .get('/completar-familia/alumno/oid/' + oidResponsable)
                                            .end(function (err, res) {
                                                expect(res).to.have.status(404);

                                                //Elimino Recursos
                                                Promise.all([eliminarCicloLectivo(), eliminarAlumnoOID(alumnoDB._id)])
                                                    .then(resp => {
                                                        console.log("Recursos eliminados")
                                                        done();
                                                    });
                                            })
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //TODO: Camino 6 llamada correcta a completar familia, asocio hermano y padre
    //AUTOCONTENIDO EN EL OTRO TEST

    //Camino 7
    it('Debería Fallar al agregar rol Responsable', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que no existe
                            const dni = personaResponsable.dni
                            requester
                                .get('/insc-alumno/responsable/' + dni)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Busco una persona que si existe, para eso la creo
                                    crearPersona(personaResponsable).then(personaDB => {
                                        requester
                                            .get('/insc-alumno/persona/' + dni)
                                            .end(function (err, res) {
                                                expect(res.body.persona).to.deep.include(personaResponsable);
                                                expect(res).to.have.status(200);

                                                //Envío datos de rol responsable erróneos
                                                const oidPersona = res.body.persona._id;
                                                requester
                                                    .put('/insc-alumno/responsable/persona/' + oidPersona)
                                                    .send({ responsable: {} })
                                                    .end(function (err, res) {
                                                        expect(res).to.have.status(400)

                                                        //Elimino Recursos
                                                        Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(personaDB._id)])
                                                            .then(resp => {
                                                                console.log("Recursos eliminados")
                                                                done();
                                                            });
                                                    });
                                            })
                                    });
                                })
                        });
                });
        });
    }).timeout(0);

    //Camino 8
    it('Debería Fallar al Crear una Persona Responsable', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que no existe
                            const dni = personaResponsable.dni;
                            requester
                                .get('/insc-alumno/responsable/' + dni)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Busco una persona que no existe
                                    requester
                                        .get('/insc-alumno/persona/' + dni)
                                        .end(function (err, res) {
                                            expect(res).to.have.status(404);

                                            //Envío datos de persona - responsable erróneos                                            
                                            requester
                                                .post('/insc-alumno/responsable')
                                                .send({ responsable: {} })
                                                .end(function (err, res) {
                                                    expect(res).to.have.status(400)

                                                    //Elimino Recursos
                                                    Promise.all([eliminarCicloLectivo()])
                                                        .then(resp => {
                                                            console.log("Recursos eliminados")
                                                            done();
                                                        });
                                                });
                                        })
                                })
                        });
                });
        });
    }).timeout(0);

    //Camino 9    
    it('Debería Fallar al agregar rol Alumno', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que existe, para eso lo creo
                            const dniResponsable = personaResponsable.dni;
                            datosResponsable.legajo = responsableEsperado.responsable.legajo;
                            crearPersonaRol(personaResponsable, 'responsable', datosResponsable).then(responsable => {
                                requester
                                    .get('/insc-alumno/responsable/' + dniResponsable)
                                    .end(function (err, res) {
                                        expect(res.body.responsable).to.deep.include(responsableEsperado);
                                        expect(res).to.have.status(200);
                                        const oidResponsable = res.body.responsable._id;

                                        //Busco una persona que existe, entonces la creo                                        
                                        crearPersona(personaAlumno).then(personaDB => {
                                            requester
                                                .get('/insc-alumno/persona/' + alumno.dni)
                                                .end(function (err, res) {
                                                    expect(res.body.persona).to.deep.include(personaAlumno);
                                                    expect(res).to.have.status(200);

                                                    //Envío datos de rol alumno erróneos
                                                    const oidPersona = res.body.persona._id;
                                                    requester
                                                        .put('/insc-alumno/alumno/persona/' + oidPersona)
                                                        .send({ alumno: {}, oidResponsable })
                                                        .end(function (err, res) {
                                                            expect(res).to.have.status(400);

                                                            //Elimino Recursos                                                            
                                                            Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(responsable._id),
                                                            eliminarPersonaOID(personaDB._id)])
                                                                .then(resp => {
                                                                    console.log("Recursos eliminados")
                                                                    done();
                                                                })
                                                        });
                                                });
                                        });
                                    });
                            });
                        });
                });
        });
    }).timeout(0);

    //Camino 10
    it('Debería Agregar rol Alumno', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que existe, para eso lo creo
                            const dniResponsable = personaResponsable.dni;
                            datosResponsable.legajo = responsableEsperado.responsable.legajo;
                            crearPersonaRol(personaResponsable, 'responsable', datosResponsable).then(responsable => {
                                requester
                                    .get('/insc-alumno/responsable/' + dniResponsable)
                                    .end(function (err, res) {
                                        expect(res.body.responsable).to.deep.include(responsableEsperado);
                                        expect(res).to.have.status(200);
                                        const oidResponsable = res.body.responsable._id;

                                        //Busco una persona que existe, entonces la creo                                        
                                        crearPersona(personaAlumno).then(personaDB => {
                                            requester
                                                .get('/insc-alumno/persona/' + alumno.dni)
                                                .end(function (err, res) {
                                                    expect(res.body.persona).to.deep.include(personaAlumno);
                                                    expect(res).to.have.status(200);

                                                    //Envío datos de rol alumno validos
                                                    const oidPersona = res.body.persona._id;
                                                    alumnoEsperado.responsable = oidResponsable;
                                                    requester
                                                        .put('/insc-alumno/alumno/persona/' + oidPersona)
                                                        .send({ alumno: datosAlumno, oidResponsable })
                                                        .end(function (err, res) {
                                                            expect(res.body.response).to.have.property('alumno')
                                                            expect(res.body.response.alumno).to.deep.include(alumnoEsperado);
                                                            expect(res).to.have.status(200);

                                                            //Elimino Recursos                                                            
                                                            Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(responsable._id),
                                                            eliminarPersonaOID(personaDB._id), eliminarAlumnoOID(res.body.response.alumno._id)])
                                                                .then(resp => {
                                                                    console.log("Recursos eliminados")
                                                                    done();
                                                                })
                                                        });
                                                });
                                        });
                                    });
                            });
                        });
                });
        });
    }).timeout(0);

    //Camino 11
    it('Debería Fallar al Crear una Persona Alumno', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que existe, para eso lo creo
                            const dniResponsable = personaResponsable.dni;
                            datosResponsable.legajo = responsableEsperado.responsable.legajo;
                            crearPersonaRol(personaResponsable, 'responsable', datosResponsable).then(responsable => {
                                requester
                                    .get('/insc-alumno/responsable/' + dniResponsable)
                                    .end(function (err, res) {
                                        expect(res.body.responsable).to.deep.include(responsableEsperado);
                                        expect(res).to.have.status(200);
                                        const oidResponsable = res.body.responsable._id;

                                        //Busco una persona que no existe
                                        const dniAlumno = personaAlumno.dni
                                        requester
                                            .get('/insc-alumno/persona/' + dniAlumno)
                                            .end(function (err, res) {
                                                expect(res).to.have.status(404);

                                                //Envío datos de persona - responsable erróneos                                            
                                                requester
                                                    .post('/insc-alumno/alumno')
                                                    .send({ alumno: {}, oidResponsable })
                                                    .end(function (err, res) {
                                                        expect(res).to.have.status(400)

                                                        //Elimino Recursos
                                                        Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(responsable._id)])
                                                            .then(resp => {
                                                                console.log("Recursos eliminados")
                                                                done();
                                                            });
                                                    });
                                            })
                                    })
                            });
                        });
                });
        });
    }).timeout(0);

    //Camino 12
    it('Debería Agregar un Alumno Completo', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que existe, para eso lo creo
                            const dniResponsable = personaResponsable.dni;
                            datosResponsable.legajo = responsableEsperado.responsable.legajo;
                            crearPersonaRol(personaResponsable, 'responsable', datosResponsable).then(responsable => {
                                requester
                                    .get('/insc-alumno/responsable/' + dniResponsable)
                                    .end(function (err, res) {
                                        expect(res.body.responsable).to.deep.include(responsableEsperado);
                                        expect(res).to.have.status(200);
                                        const oidResponsable = res.body.responsable._id;

                                        //Busco una persona que no existe
                                        const dniAlumno = personaAlumno.dni
                                        requester
                                            .get('/insc-alumno/persona/' + dniAlumno)
                                            .end(function (err, res) {
                                                expect(res).to.have.status(404);

                                                //Envío datos de persona - alumno válidos                                                
                                                alumnoEsperado.responsable = oidResponsable;
                                                requester
                                                    .post('/insc-alumno/alumno')
                                                    .send({ alumno, oidResponsable })
                                                    .end(function (err, res) {
                                                        expect(res.body.response).to.have.property('alumno')
                                                        expect(res.body.response.alumno).to.deep.include(alumnoEsperado);
                                                        expect(res).to.have.status(200)
                                                        const alumnoRecibido = res.body.response.alumno;

                                                        //Elimino Recursos
                                                        Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(responsable._id),
                                                        eliminarPersonaDNI(alumnoRecibido.dni), eliminarAlumnoOID(alumnoRecibido._id)])
                                                            .then(resp => {
                                                                console.log("Recursos eliminados")
                                                                done();
                                                            });
                                                    });
                                            });
                                    });
                            });
                        });
                });
        });
    }).timeout(0);

    //Agregar rol responsable con variantes positivas y negativas de crear alumno
    //Camino 13 //TODO: completar creando alumno completo
    it('Debería Agregar rol Responsable y un Alumno Completo', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que no existe
                            const dni = personaResponsable.dni
                            requester
                                .get('/insc-alumno/responsable/' + dni)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Busco una persona que si existe, para eso la creo
                                    crearPersona(personaResponsable).then(personaDB => {
                                        requester
                                            .get('/insc-alumno/persona/' + dni)
                                            .end(function (err, res) {
                                                expect(res.body.persona).to.deep.include(personaResponsable);
                                                expect(res).to.have.status(200);

                                                //Envío datos de rol responsable válidos
                                                const oidPersona = res.body.persona._id;
                                                requester
                                                    .put('/insc-alumno/responsable/persona/' + oidPersona)
                                                    .send({ responsable: datosResponsable })
                                                    .end(function (err, res) {
                                                        expect(res.body.response).to.deep.include(responsableEsperado)
                                                        expect(res).to.have.status(200)
                                                        const oidResponsable = res.body.response._id;

                                                        //Busco una persona que no existe
                                                        const dniAlumno = personaAlumno.dni
                                                        requester
                                                            .get('/insc-alumno/persona/' + dniAlumno)
                                                            .end(function (err, res) {
                                                                expect(res).to.have.status(404);

                                                                //Envío datos de persona - alumno válidos                                                
                                                                alumnoEsperado.responsable = oidResponsable;
                                                                requester
                                                                    .post('/insc-alumno/alumno')
                                                                    .send({ alumno, oidResponsable })
                                                                    .end(function (err, res) {
                                                                        expect(res.body.response).to.have.property('alumno')
                                                                        expect(res.body.response.alumno).to.deep.include(alumnoEsperado);
                                                                        expect(res).to.have.status(200)
                                                                        const alumnoRecibido = res.body.response.alumno;

                                                                        //Elimino Recursos
                                                                        Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(personaDB._id),
                                                                        eliminarPersonaDNI(alumnoRecibido.dni), eliminarAlumnoOID(alumnoRecibido._id)])
                                                                            .then(resp => {
                                                                                console.log("Recursos eliminados")
                                                                                done();
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            })
                                    });
                                })
                        });
                });
        });
    }).timeout(0);

    //TODO: Camino 14
    //TODO: Camino 15
    //TODO: Camino 16    

    //Agregar responsable completo con variantes positivas y negativas de crear alumno
    //Camino 17 //TODO: completar creando alumno completo
    it('Debería Agregar Responsable y Alumno Completos', (done) => {

        crearCicloLectivo(cicloValido).then(cicloLectivo => {
            requester
                .get('/insc-alumno/validar-fecha')
                .end(function (err, res) {
                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                    expect(res).to.have.status(200);

                    requester
                        .get('/insc-alumno/alumno/' + alumno.dni)
                        .end(function (err, res) {
                            expect(res.body.response).to.include({
                                valido: true,
                                operacion: "Inscribir"
                            })
                            expect(res).to.have.status(200);

                            //Busco un responsable que no existe
                            const dni = personaResponsable.dni;
                            requester
                                .get('/insc-alumno/responsable/' + dni)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Busco una persona que no existe
                                    requester
                                        .get('/insc-alumno/persona/' + dni)
                                        .end(function (err, res) {
                                            expect(res).to.have.status(404);

                                            //Envío datos de persona - responsable válidos                                                                                       
                                            requester
                                                .post('/insc-alumno/responsable')
                                                .send(responsableCompleto)
                                                .end(function (err, res) {
                                                    expect(res.body.response).to.deep.include(responsableEsperado);
                                                    expect(res).to.have.status(200)
                                                    const oidResponsable = res.body.response._id;

                                                    //Busco una persona que no existe
                                                    const dniAlumno = personaAlumno.dni
                                                    requester
                                                        .get('/insc-alumno/persona/' + dniAlumno)
                                                        .end(function (err, res) {
                                                            expect(res).to.have.status(404);

                                                            //Envío datos de persona - alumno válidos                                                
                                                            alumnoEsperado.responsable = oidResponsable;
                                                            requester
                                                                .post('/insc-alumno/alumno')
                                                                .send({ alumno, oidResponsable })
                                                                .end(function (err, res) {
                                                                    expect(res.body.response).to.have.property('alumno')
                                                                    expect(res.body.response.alumno).to.deep.include(alumnoEsperado);
                                                                    expect(res).to.have.status(200)
                                                                    const alumnoRecibido = res.body.response.alumno;

                                                                    //Elimino Recursos
                                                                    Promise.all([eliminarCicloLectivo(), eliminarPersonaOID(oidResponsable),
                                                                    eliminarPersonaDNI(alumnoRecibido.dni), eliminarAlumnoOID(alumnoRecibido._id)])
                                                                        .then(resp => {
                                                                            console.log("Recursos eliminados")
                                                                            done();
                                                                        });
                                                                });
                                                        });
                                                });
                                        })
                                })
                        });
                });
        });
    }).timeout(0);

    //TODO: Camino 18
    //TODO: Camino 19
    //TODO: Camino 20    

});