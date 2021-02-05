const app =require('../server.js');
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
        const materia = "Civica", anio = 4;
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

        chai.request(server).get('/agregarDatosMesaExamen/obtenerPreceptores').end((err, res) => {
          //Busco preceptores
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
      const materia = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.nombre;
      const anio = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.anio;
      const idMesa = mesasSolicitadas.body.mesasConDictados[1]._id;

      chai.request(server).get('//agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada

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
                "fechaHora": "10/12/2020",
                "profesores": [profeTitular, profe2, profe3],
                "preceptores": [preceptor1, preceptor2],
                "aula": 1
              }
              ).end((err, mesaActualizada) => {
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



  //####################
  //###### TEST 6 ######
  //####################

  it('deberia fallar porque no encuentra profesores que puedan dictar la materia de la mesa solicitada elegida', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, mesasSolicitadas) => {
      //Busco las mesas en estado solicitada
      const materia = mesasSolicitadas.body.mesasConDictados[0].dictado.materia.nombre;
      const anio = mesasSolicitadas.body.mesasConDictados[0].dictado.materia.anio;
      const idMesa = mesasSolicitadas.body.mesasConDictados[0].mesa._id;
      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, mesas) => {
        //Busco las mesas que se pueden compartir
        //Simbolizo la eleccion de una mesa compartida
        
        const padre = mesas.body.mesasConDictados[0]._id;
        const esPadre = mesas.body.mesasConDictados[0].esPadre;
        const profesores = mesas.body.mesasConDictados[0].profesores;
        const preceptores = mesas.body.mesasConDictados[0].preceptores;
        const fechaHora = mesas.body.mesasConDictados[0].fechaHora;
        const aula = mesas.body.mesasConDictados[0].aula;
        chai.request(server).put('/agregarDatosMesaExamen/registrarCompartida/').send(
          {
            oidIndividual: idMesa,
            padre: padre,
            esPadre: esPadre,
            materia: materia,
            anio: anio,
            profesores: profesores,
            preceptores: preceptores,
            fechaHora: fechaHora,
            aula: aula,

          }
        ).end((err, mesaActualizada) => {
      
          expect(mesaActualizada).to.have.status(200);
          expect(mesaActualizada.body.respClient).to.have.own.property('message');
          expect(mesaActualizada.body.respClient.message).to.equal("Ninguno de los profesores de la mesa compartida pueden dictar la materia de ese año");
          done()
        });
      });
    });
  })

  //####################
  //###### TEST 7 ######
  //####################
it('deberia ser exitoso crear una mesa como individual', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, mesasSolicitadas) => {
      //Busco las mesas en estado solicitada
      
      const materia = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.nombre;
      const anio = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.anio;
      const idMesa = mesasSolicitadas.body.mesasConDictados[1].mesa._id;

      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, res) => {
        //Busco las mesas que se pueden compartir
        //Simboliza los datos de la mesa seleccionada

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
                "fechaHora": "6/12/2020",
                "profesores": [profeTitular, profe2, profe3],
                "preceptores": [preceptor1, preceptor2],
                "aula": 1
              }
              ).end((err, mesaActualizada) => {
                expect(mesaActualizada).to.have.status(200);
                expect(mesaActualizada.body.respClient).to.have.own.property('message');
                expect(mesaActualizada.body.respClient).to.have.own.property('mesa');
                expect(mesaActualizada.body.respClient.message).to.equal("Se actualizo la mesa con éxito");
                expect(mesaActualizada.body.respClient.mesa.estado).to.equal("Completada");
                done();
              });
            });
          });
        });
      });
    });
  })



  //####################
  //###### TEST 8 ######
  //####################
  it('deberia ser exitoso crear una mesa como compartida', (done) => {

    chai.request(server).get('/agregarDatosMesaExamen/mesasSolicitadas').end((err, mesasSolicitadas) => {
      //Busco las mesas en estado solicitada
      console.log(mesasSolicitadas.body);
      const materia = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.nombre;
      const anio = mesasSolicitadas.body.mesasConDictados[1].dictado.materia.anio;
      const idMesa = mesasSolicitadas.body.mesasConDictados[1].mesa._id;
      chai.request(server).get('/agregarDatosMesaExamen/mesasParaCompartir').end((err, mesas) => {
        //Busco las mesas que se pueden compartir
        //Simbolizo la eleccion de una mesa compartida
        
        const padre = mesas.body.mesasConDictados[0].idMesa;
        const esPadre = mesas.body.mesasConDictados[0].esPadre;
        const profesores = mesas.body.mesasConDictados[0].profesores;
        const preceptores = mesas.body.mesasConDictados[0].preceptores;
        const fechaHora = mesas.body.mesasConDictados[0].fechaHora;
        const aula = mesas.body.mesasConDictados[0].aula;
        chai.request(server).put('/agregarDatosMesaExamen/registrarCompartida/').send(
          {
            oidIndividual: idMesa,
            padre: padre,
            esPadre: esPadre,
            materia: materia,
            anio: anio,
            profesores: profesores,
            preceptores: preceptores,
            fechaHora: fechaHora,
            aula: aula,

          }
        ).end((err, mesaActualizada) => {
          const mesaIndividualUpdate=mesaActualizada.body.respClient.mesaIndividualUpdate; //mesa que se convirtio en compartida
          const mesaPadre=mesaActualizada.body.respClient.mesaCompartidaUpdate; //mesa padre
          
          expect(mesaActualizada).to.have.status(200);
          expect(mesaActualizada.body.respClient).to.have.own.property('message');
          expect(mesaActualizada.body.respClient).to.have.own.property('mesaIndividualUpdate');
          expect(mesaActualizada.body.respClient).to.have.own.property('mesaCompartidaUpdate');
          expect(mesaActualizada.body.respClient.message).to.equal("Se registro la mesa con exito");

          //Mesa que individual actualizada
          expect(mesaIndividualUpdate.estado).to.equal("Completada");
          expect(mesaIndividualUpdate.esCompartida).to.equal(true);
          expect(mesaIndividualUpdate.esPadre).to.equal(false);
          expect(mesaIndividualUpdate.asociadas[0]).to.equal(mesaPadre._id);

          //Mesa padre
          expect(mesaPadre.esPadre).to.equal(true);
          expect(mesaPadre.esCompartida).to.equal(true);
          const ultima=mesaPadre.asociadas.length-1;
          expect(mesaPadre.asociadas[ultima]).to.equal(mesaIndividualUpdate._id);
          done()
        });
      });
    });
  })
});