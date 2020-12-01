'use strict'
const app = require('../server');
const chai = require('chai');
const chaiHttp = require('chai-http');
const expect = require('chai').expect;

chai.use(chaiHttp);
const url = 'http://localhost:5000';
const requester = chai.request(url);

const { crearAlumno, crearPersona, crearPersonaRol, eliminarAlumnoOID, eliminarPersonaOID, eliminarPersonaDNI } = require('./generadores/inscribir-alumno');
const { alumno, alumnoEsperado, oidResponsable } = require('./datos/datosInscribirAlumno');
const { personaPadre, datosPadre, padreCompleto, padreEsperado, personaHermano, datosHermano, hermanoEsperado, hermanoCompleto
} = require('./datos/datosCompletarFamilia');

before(async function () {
    let espera = new Promise((res, req) => {
        setTimeout(() => res('success'), 5000)
    })
    await espera.then((res) => console.log("Base lista: ", res));
})

describe('Completar Familia', function () {

    //Camino 1
    it('Debería Fallar Alumno Lista Vacía', (done) => {
        requester
            .get('/completar-familia/alumno/' + alumno.dni)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done();
            });
    }).timeout(0);

    //Camino 2
    it('Debería Fallar al Asociar Padre con Alumno', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);

                    //Busco un padre que existe, para eso lo creo
                    const dniPadre = personaPadre.dni;
                    crearPersonaRol(personaPadre, 'padre', datosPadre).then(padre => {
                        requester
                            .get('/completar-familia/padre/' + dniPadre)
                            .end(function (err, res) {
                                expect(res.body.padre).to.deep.include(padreEsperado);
                                expect(res).to.have.status(200);
                                const oidPadre = res.body.padre._id;

                                //Intento asociar alumno con padre, pero envío oidAlumno erróneo
                                requester
                                    .put('/completar-familia/asociar-padre/' + oidPadre)
                                    .query({ oidAlumno: oidResponsable })
                                    .end(function (err, res) {
                                        expect(res).to.have.status(404);

                                        Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(padre._id)])
                                            .then(resp => {
                                                console.log("Recursos Eliminados");
                                                done();
                                            });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //Camino 3
    it('Debería Asociar Padre y Hermano con Alumno', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que existe, para eso lo creo
                    const dniPadre = personaPadre.dni;
                    crearPersonaRol(personaPadre, 'padre', datosPadre).then(padre => {
                        requester
                            .get('/completar-familia/padre/' + dniPadre)
                            .end(function (err, res) {
                                expect(res.body.padre).to.deep.include(padreEsperado);
                                expect(res).to.have.status(200);
                                const oidPadre = res.body.padre._id;

                                //Asocio alumno con padre, envío oidAlumno válido
                                requester
                                    .put('/completar-familia/asociar-padre/' + oidPadre)
                                    .query({ oidAlumno })
                                    .end(function (err, res) {
                                        expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                        expect(res).to.have.status(200);

                                        //Busco un hermano que existe, para eso lo creo
                                        const dniHermano = personaHermano.dni;
                                        crearPersonaRol(personaHermano, 'hermano', datosHermano).then(hermano => {
                                            requester
                                                .get('/completar-familia/hermano/' + dniHermano)
                                                .end(function (err, res) {
                                                    expect(res.body.hermano).to.deep.include(hermanoEsperado);
                                                    expect(res).to.have.status(200);
                                                    const oidHermano = res.body.hermano._id;

                                                    //Asocio alumno con hermano, envío oidAlumno válido
                                                    requester
                                                        .put('/completar-familia/asociar-hermano/' + oidHermano)
                                                        .query({ oidAlumno })
                                                        .end(function (err, res) {
                                                            expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                            expect(res).to.have.status(200);

                                                            //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                                            //Verifica que el alumno este correctamente asociado con el padre y hermano
                                                            requester
                                                                .get('/completar-familia/alumno/dni/' + alumno.dni)
                                                                .end(function (err, res) {
                                                                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                                    expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                                    expect(res.body.alumno).to.have.property('hermanos').to.include.members([oidHermano])
                                                                    expect(res).to.have.status(200);

                                                                    Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(padre._id),
                                                                    eliminarPersonaOID(hermano._id)])
                                                                        .then(resp => {
                                                                            console.log("Recursos Eliminados");
                                                                            done();
                                                                        });
                                                                });
                                                        });
                                                });
                                        });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //TODO: Camino 4 Debería Asociar Padre y Fallar al Asociar Hermano

    //Camino 5
    it('Debería Asociar Padre y Agregar Hermano Completo', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que existe, para eso lo creo
                    const dniPadre = personaPadre.dni;
                    crearPersonaRol(personaPadre, 'padre', datosPadre).then(padre => {
                        requester
                            .get('/completar-familia/padre/' + dniPadre)
                            .end(function (err, res) {
                                expect(res.body.padre).to.deep.include(padreEsperado);
                                expect(res).to.have.status(200);
                                const oidPadre = res.body.padre._id;

                                //Asocio alumno con padre, envío oidAlumno válido
                                requester
                                    .put('/completar-familia/asociar-padre/' + oidPadre)
                                    .query({ oidAlumno })
                                    .end(function (err, res) {
                                        expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                        expect(res).to.have.status(200);

                                        //Busco un hermano que no existe
                                        const dniHermano = personaHermano.dni;
                                        requester
                                            .get('/completar-familia/hermano/' + dniHermano)
                                            .end(function (err, res) {
                                                expect(res).to.have.status(404);

                                                //Busco una persona que no existe
                                                requester
                                                    .get('/completar-familia/persona/' + dniHermano)
                                                    .end(function (err, res) {
                                                        expect(res).to.have.status(404);

                                                        //Envío datos de persona - hermano válidos
                                                        requester
                                                            .post('/completar-familia/hermano')
                                                            .send({ hermano: hermanoCompleto, oidAlumno })
                                                            .end(function (err, res) {
                                                                expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                                expect(res.body.response).to.have.property('hermano');
                                                                expect(res.body.response.hermano).to.deep.include(hermanoEsperado)
                                                                expect(res).to.have.status(200)
                                                                const oidHermano = res.body.response.hermano._id;

                                                                //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                                                //Verifica que el alumno este correctamente asociado con el padre y hermano
                                                                requester
                                                                    .get('/completar-familia/alumno/dni/' + alumno.dni)
                                                                    .end(function (err, res) {
                                                                        expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                                        expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                                        expect(res.body.alumno).to.have.property('hermanos').to.include.members([oidHermano])
                                                                        expect(res).to.have.status(200);

                                                                        Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(padre._id),
                                                                        eliminarPersonaOID(oidHermano)])
                                                                            .then(resp => {
                                                                                console.log("Recursos Eliminados");
                                                                                done();
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //TODO: Camino 6 Debería Asociar Padre y Registrar Hermano Completo

    //Camino 7
    it('Debería Asociar Padre y Agregar rol Hermano', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que existe, para eso lo creo
                    const dniPadre = personaPadre.dni;
                    crearPersonaRol(personaPadre, 'padre', datosPadre).then(padre => {
                        requester
                            .get('/completar-familia/padre/' + dniPadre)
                            .end(function (err, res) {
                                expect(res.body.padre).to.deep.include(padreEsperado);
                                expect(res).to.have.status(200);
                                const oidPadre = res.body.padre._id;

                                //Asocio alumno con padre, envío oidAlumno válido
                                requester
                                    .put('/completar-familia/asociar-padre/' + oidPadre)
                                    .query({ oidAlumno })
                                    .end(function (err, res) {
                                        expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                        expect(res).to.have.status(200);

                                        //Busco un hermano que no existe
                                        const dniHermano = personaHermano.dni;
                                        requester
                                            .get('/completar-familia/hermano/' + dniHermano)
                                            .end(function (err, res) {
                                                expect(res).to.have.status(404);

                                                //Busco una persona que si existe, para eso la creo
                                                crearPersona(personaHermano).then(personaDB => {
                                                    requester
                                                        .get('/completar-familia/persona/' + dniHermano)
                                                        .end(function (err, res) {
                                                            expect(res.body.persona).to.deep.include(personaHermano);
                                                            expect(res).to.have.status(200);
                                                            const oidHermano = res.body.persona._id;

                                                            //Envío datos de rol hermano válidos
                                                            const oidPersona = res.body.persona._id;
                                                            requester
                                                                .put('/completar-familia/hermano/persona/' + oidPersona)
                                                                .send({ hermano: datosHermano, oidAlumno })
                                                                .end(function (err, res) {
                                                                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                                    expect(res.body.response).to.have.property('hermano');
                                                                    expect(res.body.response.hermano).to.deep.include(hermanoEsperado)
                                                                    expect(res).to.have.status(200)

                                                                    //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                                                    //Verifica que el alumno este correctamente asociado con el padre y hermano
                                                                    requester
                                                                        .get('/completar-familia/alumno/dni/' + alumno.dni)
                                                                        .end(function (err, res) {
                                                                            expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                                            expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                                            expect(res.body.alumno).to.have.property('hermanos').to.include.members([oidHermano])
                                                                            expect(res).to.have.status(200);

                                                                            Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(padre._id),
                                                                            eliminarPersonaOID(personaDB._id)])
                                                                                .then(resp => {
                                                                                    console.log("Recursos Eliminados");
                                                                                    done();
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });
                                            });
                                    });
                            });
                    });
                });
        });
    }).timeout(0);

    //TODO: Camino 8 Debería Asociar Padre y Fallar al Agregar rol Hermano

    //Camino 9
    it('Debería Fallar al Agregar rol Padre', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que no existe
                    const dniPadre = personaPadre.dni;
                    requester
                        .get('/completar-familia/padre/' + dniPadre)
                        .end(function (err, res) {
                            expect(res).to.have.status(404);

                            //Busco una persona que si existe, para eso la creo
                            crearPersona(personaPadre).then(personaDB => {
                                requester
                                    .get('/completar-familia/persona/' + dniPadre)
                                    .end(function (err, res) {
                                        expect(res.body.persona).to.deep.include(personaPadre);
                                        expect(res).to.have.status(200);

                                        //Envío datos de rol padre erróneos
                                        const oidPersona = res.body.persona._id;
                                        requester
                                            .put('/completar-familia/padre/persona/' + oidPersona)
                                            .send({ padre: {}, oidAlumno })
                                            .end(function (err, res) {
                                                expect(res).to.have.status(400)

                                                Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(personaDB._id)])
                                                    .then(resp => {
                                                        console.log("Recursos Eliminados");
                                                        done();
                                                    });
                                            });
                                    });
                            });
                        });
                });
        });
    }).timeout(0);

    //Camino 10
    it('Debería Fallar al Crear una Persona Padre', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que no existe
                    const dniPadre = personaPadre.dni;
                    requester
                        .get('/completar-familia/padre/' + dniPadre)
                        .end(function (err, res) {
                            expect(res).to.have.status(404);

                            //Busco una persona que no existe
                            requester
                                .get('/completar-familia/persona/' + dniPadre)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Envío datos de persona - responsable erróneos
                                    requester
                                        .post('/completar-familia/padre')
                                        .send({ padre: {}, oidAlumno })
                                        .end(function (err, res) {
                                            expect(res).to.have.status(400)

                                            Promise.all([eliminarAlumnoOID(alumnoDB._id)])
                                                .then(resp => {
                                                    console.log("Recursos Eliminados");
                                                    done();
                                                });
                                        });
                                });
                        });
                });
        });
    }).timeout(0);

    //Camino 11
    it('Debería Agregar rol Padre y Asociar Hermano con Alumno', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que no existe
                    const dniPadre = personaPadre.dni;
                    requester
                        .get('/completar-familia/padre/' + dniPadre)
                        .end(function (err, res) {
                            expect(res).to.have.status(404);

                            //Busco una persona que si existe, para eso la creo
                            crearPersona(personaPadre).then(personaDB => {
                                requester
                                    .get('/completar-familia/persona/' + dniPadre)
                                    .end(function (err, res) {
                                        expect(res.body.persona).to.deep.include(personaPadre);
                                        expect(res).to.have.status(200);
                                        const oidPadre = res.body.persona._id;

                                        //Envío datos de rol padre válidos
                                        const oidPersona = res.body.persona._id;
                                        requester
                                            .put('/completar-familia/padre/persona/' + oidPersona)
                                            .send({ padre: datosPadre, oidAlumno })
                                            .end(function (err, res) {
                                                expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                expect(res.body.response).to.have.property('padre');
                                                expect(res.body.response.padre).to.deep.include(padreEsperado)
                                                expect(res).to.have.status(200)

                                                //Busco un hermano que existe, para eso lo creo
                                                const dniHermano = personaHermano.dni;
                                                crearPersonaRol(personaHermano, 'hermano', datosHermano).then(hermano => {
                                                    requester
                                                        .get('/completar-familia/hermano/' + dniHermano)
                                                        .end(function (err, res) {
                                                            expect(res.body.hermano).to.deep.include(hermanoEsperado);
                                                            expect(res).to.have.status(200);
                                                            const oidHermano = res.body.hermano._id;

                                                            //Asocio alumno con hermano, envío oidAlumno válido
                                                            requester
                                                                .put('/completar-familia/asociar-hermano/' + oidHermano)
                                                                .query({ oidAlumno })
                                                                .end(function (err, res) {
                                                                    expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                                    expect(res).to.have.status(200);

                                                                    //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                                                    //Verifica que el alumno este correctamente asociado con el padre y hermano
                                                                    requester
                                                                        .get('/completar-familia/alumno/dni/' + alumno.dni)
                                                                        .end(function (err, res) {
                                                                            expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                                            expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                                            expect(res.body.alumno).to.have.property('hermanos').to.include.members([oidHermano])
                                                                            expect(res).to.have.status(200);

                                                                            Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(personaDB._id),
                                                                            eliminarPersonaOID(hermano._id)])
                                                                                .then(resp => {
                                                                                    console.log("Recursos Eliminados");
                                                                                    done();
                                                                                });
                                                                        });
                                                                });
                                                        });
                                                });

                                            });
                                    });
                            });
                        });
                });
        });
    }).timeout(0);

    //Agregar rol padre con variantes positivas y negativas de agregar el hermano
    //TODO: Camino 12 Fallar Asociar Hermano
    //TODO: Camino 13 Agregar Hermano Completo
    //TODO: Camino 14 Falla Agregar Hermano Completo
    //TODO: Camino 15 Agregar rol Hermano
    //TODO: Camino 16 Falla al Agregar rol Hermano

    //Camino 17 //TODO: completar asociando hermano
    it('Debería Agregar un Padre Completo y Asociar Hermano con Alumno', (done) => {

        //Busco un alumno que existe, para eso lo creo
        alumno.legajo = '7';
        alumno.estadoInscripcion = 'Inscripto';
        crearAlumno(alumno, oidResponsable).then(alumnoDB => {
            requester
                .get('/completar-familia/alumno/dni/' + alumno.dni)
                .end(function (err, res) {
                    expect(res.body.alumno).to.deep.include(alumnoEsperado);
                    expect(res).to.have.status(200);
                    const oidAlumno = res.body.alumno._id;

                    //Busco un padre que no existe
                    const dniPadre = personaPadre.dni;
                    requester
                        .get('/completar-familia/padre/' + dniPadre)
                        .end(function (err, res) {
                            expect(res).to.have.status(404);

                            //Busco una persona que no existe
                            requester
                                .get('/completar-familia/persona/' + dniPadre)
                                .end(function (err, res) {
                                    expect(res).to.have.status(404);

                                    //Envío datos de persona - padre válidos
                                    requester
                                        .post('/completar-familia/padre')
                                        .send({ padre: padreCompleto, oidAlumno })
                                        .end(function (err, res) {
                                            expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                            expect(res.body.response).to.have.property('padre');
                                            expect(res.body.response.padre).to.deep.include(padreEsperado)
                                            expect(res).to.have.status(200)
                                            const oidPadre = res.body.response.padre._id;

                                            //Busco un hermano que existe, para eso lo creo
                                            const dniHermano = personaHermano.dni;
                                            crearPersonaRol(personaHermano, 'hermano', datosHermano).then(hermano => {
                                                requester
                                                    .get('/completar-familia/hermano/' + dniHermano)
                                                    .end(function (err, res) {
                                                        expect(res.body.hermano).to.deep.include(hermanoEsperado);
                                                        expect(res).to.have.status(200);
                                                        const oidHermano = res.body.hermano._id;

                                                        //Asocio alumno con hermano, envío oidAlumno válido
                                                        requester
                                                            .put('/completar-familia/asociar-hermano/' + oidHermano)
                                                            .query({ oidAlumno })
                                                            .end(function (err, res) {
                                                                expect(res.body.response).to.have.property('valido').to.be.equal(true);
                                                                expect(res).to.have.status(200);

                                                                //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                                                //Verifica que el alumno este correctamente asociado con el padre y hermano
                                                                requester
                                                                    .get('/completar-familia/alumno/dni/' + alumno.dni)
                                                                    .end(function (err, res) {
                                                                        expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                                        expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                                        expect(res.body.alumno).to.have.property('hermanos').to.include.members([oidHermano])
                                                                        expect(res).to.have.status(200);

                                                                        Promise.all([eliminarAlumnoOID(alumnoDB._id), eliminarPersonaOID(oidPadre),
                                                                        eliminarPersonaOID(hermano._id)])
                                                                            .then(resp => {
                                                                                console.log("Recursos Eliminados");
                                                                                done();
                                                                            });
                                                                    });
                                                            });
                                                    });
                                            });
                                        });
                                });
                        });
                });
        });
    }).timeout(0);


    //Agregar padre completo con variantes positivas y negativas de agregar el hermano
    //TODO: Camino 18 Fallar Asociar Hermano
    //TODO: Camino 19 Agregar Hermano Completo
    //TODO: Camino 20 Falla Agregar Hermano Completo
    //TODO: Camino 21 Agregar rol Hermano
    //TODO: Camino 22 Falla al Agregar rol Hermano

})