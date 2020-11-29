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
const { personaPadre, datosPadre, padreEsperado } = require('./datos/datosCompletarFamilia');

before(async function () {
    let espera = new Promise((res, req) => {
        setTimeout(() => res('success'), 5000)
    })
    await espera.then((res) => console.log("Base lista: ", res));
})

describe('Completar Familia', function () {

    //Camino 1
    /*it('Debería fallar Alumno Lista Vacía', (done) => {
        requester
            .get('/completar-familia/alumno/' + alumno.dni)
            .end(function (err, res) {
                expect(res).to.have.status(404);
                done();
            });
    }).timeout(0);*/

    //Camino 2
    /*it('Debería fallar al Asociar Padre con Alumno', (done) => {

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
    }).timeout(0);*/

    //Camino 3
    /*it('Debería Asociar Padre con Alumno', (done) => {

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

                                        //SOLO PARA TEST, NO ES PARTE DEL CAMINO DEL USUARIO
                                        //Verifica que el alumno este correctamente asociado con el padre
                                        requester
                                            .get('/completar-familia/alumno/dni/' + alumno.dni)
                                            .end(function (err, res) {                                                
                                                expect(res.body.alumno).to.deep.include(alumnoEsperado);
                                                expect(res.body.alumno).to.have.property('padres').to.include.members([oidPadre])
                                                expect(res).to.have.status(200);

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
        });
    }).timeout(0);*/

    //Camino 4
    it('Debería Fallar al agregar rol Padre', (done) => {

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
})