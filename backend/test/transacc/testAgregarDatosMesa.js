'use strict';
const assert = require('chai').assert;
const chai = require('chai');
const chaiHttp = require('chai-http');
const jsonSchema = require('chai-json-schema');
const server = 'http://localhost:3000'
const expect = chai.expect;
chai.use(chaiHttp);
chai.use(jsonSchema);



describe('Agregar Datos Mesa de Examen', function () {

  //####################
  //###### TEST 1 ######
  //####################
  it('deberia devolver una lista de mesas vacia', (done) => {
    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, res) => {
      //Busco las mesas en estado solicitada
      //expect(res.body).to.have.a('object');
      expect(res).to.have.status(204);
      done();
    });

  })


  //####################
  //###### TEST 2 ######
  //####################

  it('deberia fallar porque no encuentra profesores que puedan dictar la materia de la mesa solicitada elegida', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, res) => {
      //Busco las mesas en estado solicitada
      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada
        const materia = "Biologia", anio = 4;
        chai.request(server).get('/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa?materia=' + materia + '&anio=' + anio).end((err, res) => {
          //Busco profesores que puedan dar la materia de la mesa elegida
          //expect(res.body).to.have.a('object');
          expect(res).to.have.status(204);
          done();
        });
      });
    });
  })

  //####################
  //###### TEST 3 ######
  //####################

  it('deberia fallar porque no encuentra profesores en la base de datos', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, res) => {
      //Busco las mesas en estado solicitada
      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada
        const materia = "Biologia", anio = 4;
        chai.request(server).get('/agregarDatosMesaExamen/obtenerProfesores').end((err, res) => {
          //Busco profesores 
          //expect(res.body).to.have.a('object');
          expect(res).to.have.status(204);
          done();
        });
      });
    });
  })


  //####################
  //###### TEST 4 ######
  //####################

  it('deberia fallar porque no encuentra preceptores en la base de datos', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, res) => {
      //Busco las mesas en estado solicitada
      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada
        const materia = "Biologia", anio = 4;
        chai.request(server).get('/agregarDatosMesaExamen/obtenerPreceptores').end((err, res) => {
          //Busco preceptores
          //expect(res.body).to.have.a('object');
          expect(res).to.have.status(204);
          done();
        });
      });
    });
  })

  //####################
  //###### TEST 5 ######
  //####################

  it('deberia fallar porque  algún preceptor o profesor están en una mesa en la misma fecha y hora', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, mesasSolicitadas) => {
      //Busco las mesas en estado solicitada
      const materia = mesasSolicitadas.body.mesasConDictados[0].dictado.materia.nombre;
      const anio = mesasSolicitadas.body.mesasConDictados[0].dictado.materia.anio;
      const idMesa= mesasSolicitadas.body.mesasConDictados[0]._id;
      
      chai.request(server).get('//agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada
        console.log(materia+anio);
        chai.request(server).get('/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa?materia=' + materia + '&anio=' + anio).end((err, profesTitulares) => {
          //Busco profesores que puedan dictar la materia de la mesa solicitada
          
          const profeTitular = profesTitulares.body.response[0]._id;
          chai.request(server).get('/agregarDatosMesaExamen/obtenerProfesores').end((err, profes) => {
            //Busco profesores
            const profe2 = profes.body.response[0]._id;
            const profe3 = profes.body.response[1]._id;
            chai.request(server).get('/agregarDatosMesaExamen/obtenerPreceptores').end((err, preceptores) => {
              //Busco preceptores
              const preceptor1 = preceptores.body.response[0]._id;
              const preceptor2 = preceptores.body.response[1]._id;
              chai.request(server).put('/agregarDatosMesaExamen/mesaIndividual/agregarDatos').send({
                 
                  "mesa": idMesa,
                  "fechaHora":"10/12/2020",
                  "profesores":[profeTitular,profe2,profe3],
                  "preceptores":[preceptor1,preceptor2],
                  "aula":1
                }
              ).end((err, mesaActualizada) => {
                console.log(mesaActualizada);
                expect(mesaActualizada).to.have.status(200);
                expect(mesaActualizada.body).to.have.own.property('message');
                expect(mesaActualizada.body.message).to.equal("No es posible completar la Mesa porque un profesor o preceptor se encuentran asignados a otra en la misma fecha y hora");
                done();
              });
            });
          });
        });
      });
    });
  })


});