<template>
  <div v-if="estaPrendido" class="d-flex justify-center">
    <v-card  rounded="xl" elevation="2" width="600px">
      <v-row class=" flex-row-reverse">
        <v-col class="d-flex justify-end ">
          <v-btn @click="volverInicio()" class=" mr-5 rounded-lg " small color="orange">
            <v-icon> mdi-arrow-left </v-icon>
          </v-btn></v-col
        >
      </v-row>

      <v-card-title class="justify-center">
        Seleccione los Datos de la Mesa
      </v-card-title>
      <v-form ref="form">
        <!-- AULA -->
        <v-row justify="center">
          <v-col cols="2" md="6">
            <v-select
              background-color="white"
              v-model="aula"
              :items="aulas"
              item-text="numero"
              outlined
              label="Aula"
              :rules="aulasRules"
              return-object
              required
            ></v-select>
          </v-col>
        </v-row>
        <!-- FECHA -->

        <v-row justify="center">
          <v-col cols="12" sm="6" md="6">
            <v-menu
              ref="menu"
              v-model="menu"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  label="Fecha"
                  prepend-inner-icon="mdi-calendar"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  outlined
                  background-color="white"
                ></v-text-field>
              </template>
              <v-date-picker v-model="date" no-title scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menu = false">
                  Cancel
                </v-btn>
                <v-btn text color="primary" @click="$refs.menu.save(date)">
                  OK
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
        </v-row>
        <!-- TIEMPO -->
        <v-row justify="center">
          <v-col cols="11" sm="6" md="6">
            <v-menu
              ref="menuTiempo"
              v-model="menu2"
              :close-on-content-click="false"
              :nudge-right="40"
              :return-value.sync="time"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="290px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="time"
                  label="Hora"
                  prepend-inner-icon="mdi-clock-time-four-outline"
                  readonly
                  outlined
                  v-bind="attrs"
                  v-on="on"
                  background-color="white"
                  :rules="tiempoRules"
                ></v-text-field>
              </template>
              <v-time-picker
                v-if="menu2"
                v-model="time"
                full-width
                @click:minute="$refs.menuTiempo.save(time)"
              ></v-time-picker>
            </v-menu>
          </v-col>
        </v-row>
        <!-- PROFE TITULAR -->
        <v-row justify="center">
          <v-col cols="2" md="6">
            <v-select
              background-color="white"
              v-model="profeTitularSeleccionado"
              :items="profesMateria"
              item-text="nombre"
              outlined
              label="Profesor Titular"
              :rules="profesRulesT"
              return-object
              required
            ></v-select>
          </v-col>
        </v-row>
        <!-- PROFE DOS -->
        <v-row justify="center"
          ><v-col cols="2" md="6">
            <v-select
              v-model="profeSegundoSeleccionado"
              background-color="white"
              :items="profes"
              item-text="nombre"
              outlined
              label="Segundo Profesor"
              :rules="profesRulesS"
              return-object
              required
            ></v-select> </v-col
        ></v-row>
        <!-- PROFE TRES -->
        <v-row justify="center"
          ><v-col cols="2" md="6">
            <v-select
              v-model="profeTerceroSeleccionado"
              background-color="white"
              :items="profes"
              item-text="nombre"
              outlined
              label="Tercer Profesor"
              :rules="profesRulesTe"
              return-object
              required
            ></v-select> </v-col
        ></v-row>

        <!-- PRECEPTOR UNO -->
        <v-row justify="center">
          <v-col cols="2" md="6">
            <v-select
              v-model="preceptorUnoSeleccionado"
              background-color="white"
              :items="preceptores"
              item-text="nombre"
              outlined
              label="Primer Preceptor"
              :rules="preceptorRulesU"
              return-object
              required
            ></v-select>
          </v-col>
        </v-row>
        <!-- PRECEPTOR DOS -->
        <v-row justify="center">
          <v-col cols="2" md="6">
            <v-select
              v-model="preceptorDosSeleccionado"
              background-color="white"
              :items="preceptores"
              item-text="nombre"
              outlined
              label="Segundo Preceptor"
              :rules="preceptorRulesD"
              return-object
              required
            ></v-select> </v-col
        ></v-row>
        <v-row justify="center" align="center">
          <v-col class="d-flex justify-center " cols="2" md="6">
            <v-btn
              class="rounded-lg"
              large
              color="primary"
              @click="validate"
              elevation="3"
            >
              Agregar Datos Mesa
            </v-btn>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <Confirmacion
      ref="miConfirmacion"
      v-on:confirmar-operacion="agregarDatosMesa"
    />

    <!-- <Exito ref="alertE" />
    <Error ref="alertEr" /> -->
  </div>
</template>


<script>
import axios from "axios";
import Confirmacion from "@/components/CartelConfirmacion";

import { ipBackend } from "../../../config/backend.config";

export default {
  name: "TagregarDMI",
  props: [
    "oidMesaElegida",
    "materiaMesaElegida",
    "anioMateriaMesaElegida",
    "estaPrendido",
  ],
  data: function () {
    return {
      profesRulesT: [
        (v) => !!v || "Se requiere el profesor titular",
        (v) =>
          (v &&
            v.idProfe != this.profeSegundoSeleccionado.idProfe &&
            v.idProfe != this.profeTerceroSeleccionado.idProfe) ||
          "Debe seleccionar otro profesor",
      ],
      profesRulesS: [
        (v) => !!v || "Se requiere el segundo profesor",
        (v) =>
          (v &&
            v.idProfe != this.profeTitularSeleccionado.idProfe &&
            v.idProfe != this.profeTerceroSeleccionado.idProfe) ||
          "Debe seleccionar otro profesor",
      ],
      profesRulesTe: [
        (v) => !!v || "Se requiere el tecer profesor",
        (v) =>
          (v &&
            v.idProfe != this.profeTitularSeleccionado.idProfe &&
            v.idProfe != this.profeSegundoSeleccionado.idProfe) ||
          "Debe seleccionar otro profesor",
      ],
      preceptorRulesU: [
        (v) => !!v || "Se requiere el primer preceptor",
        (v) =>
          (v && v.idPrecep != this.preceptorDosSeleccionado.idPrecep) ||
          "Debe seleccionar otro preceptor",
      ],
      preceptorRulesD: [
        (v) => !!v || "Se requiere el preceptor",
        (v) =>
          (v && v.idPrecep != this.preceptorUnoSeleccionado.idPrecep) ||
          "Debe seleccionar otro preceptor",
      ],
      aulasRules: [(v) => !!v || "Se requiere el aula"],
      tiempoRules: [(v) => !!v || "Se requiere el tiempo"],
      fechaRules: [(v) => !!v || "Se requiere la fecha"],
      aulas: [{ numero: 1 }, { numero: 2 }, { numero: 3 }, { numero: 4 }],
      profeTitularSeleccionado: "",
      profeSegundoSeleccionado: "",
      profeTerceroSeleccionado: "",
      preceptorUnoSeleccionado: "",
      preceptorDosSeleccionado: "",
      mesas: [],
      validado: false,
      profesMateria: [],
      profes: [],
      preceptores: [],
      aula: 0,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      time: null,
      menu2: false,
      modal2: false,
      resultadoTransaccion: {
        message: "",
        status: false,
      },
    };
  },
  components: { Confirmacion },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
    obtenerInformacion() {
      axios
        .get(
          `${ipBackend}/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa?materia=` +
            this.materiaMesaElegida +
            "&anio=" +
            this.anioMateriaMesaElegida
        )
        .then((res) => {
          if (res.data.response == undefined) {
            const enviar = "No hay profesores titulares registrados";
            this.$emit("error", enviar);
            return true;
          } else {
            this.profesMateria = res.data.response;
          }
        })
        .catch((error) => {
          if (!error.response) {
            // network error
            this.errorStatus = "Error: Network Error";
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
      axios
        .get(`${ipBackend}/agregarDatosMesaExamen/obtenerProfesores`)
        .then((res) => {
          if (res.data.response == undefined) {
            const enviar = "No hay profesores registrados";
            this.$emit("error", enviar);
            return false;
          } else {
            this.profes = res.data.response;
          }
        })
        .catch((error) => {
          if (!error.response) {
            // network error
            this.errorStatus = "Error: Network Error";
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
      axios
        .get(`${ipBackend}/agregarDatosMesaExamen/obtenerPreceptores`)
        .then((res) => {
          if (res.data.response == undefined) {
            const enviar = "No hay preceptores registrados";
            this.$emit("error", enviar);
            return false;
          } else {
            this.preceptores = res.data.response;
          }
        })
        .catch((error) => {
          if (!error.response) {
            // network error
            this.errorStatus = "Error: Network Error";
          } else {
            this.errorStatus = error.response.data.message;
          }
        });
    },

    validate() {
      let resultado = this.$refs.form.validate();
      if (resultado) {
        this.$refs.miConfirmacion.abrirCartel("Agregar Datos Mesa");
        //alert(this.date);
      }
    },
    async agregarDatosMesa() {
      this.$emit("prenderCarga");
      //hacer funcion afuera y llamarla #TODO
      let fechaHora = new Date(this.date);
      fechaHora.setHours(
        parseInt(this.time.substring(0, 2)),
        parseInt(this.time.substring(3, 5))
      );
      let datosMesa = {
        mesa: this.oidMesaElegida,
        fechaHora: fechaHora,
        profesores: [
          this.profeTitularSeleccionado.idProfe,
          this.profeSegundoSeleccionado.idProfe,
          this.profeTerceroSeleccionado.idProfe,
        ],
        preceptores: [
          this.preceptorUnoSeleccionado.idPrecep,
          this.preceptorDosSeleccionado.idPrecep,
        ],
        aula: this.aula.numero,
      };
      let resultado = await axios.put(
        `${ipBackend}/agregarDatosMesaExamen/mesaIndividual/agregarDatos`,
        datosMesa
      );
      if (resultado.data.respClient == undefined) {
        this.resultadoTransaccion.message =
          "No es posible completar la Mesa porque un profesor o preceptor se encuentran asignados a otra en la misma fecha y hora";
      } else {
        this.resultadoTransaccion.message = resultado.data.respClient.message;
        this.resultadoTransaccion.status = true;
      }
      this.$emit("terminarTransaccion", this.resultadoTransaccion);
    },
    reiniciarDatos() {
      // this.oidMesaElegida="";
      // this.materiaMesaElegida="";
      // this.anioMateriaMesaElegida=0;
      // this.estaPrendido=false;
      this.profeTitularSeleccionado = "";
      this.profeSegundoSeleccionado = "";
      this.profeTerceroSeleccionado = "";
      this.preceptorUnoSeleccionado = "";
      this.preceptorDosSeleccionado = "";
      this.mesas = [];
      this.validado = false;
      this.profesMateria = [];
      this.profes = [];
      this.preceptores = [];
      this.aula = 0;
      this.date = new Date().toISOString().substr(0, 10);
      this.menu = false;
      this.time = null;
      this.menu2 = false;
      this.modal2 = false;
      this.resultadoTransaccion = {
        message: "",
        status: false,
      };
    },
    volverInicio(){
        this.$emit("volverInicio");
    }
  },
};
</script>

<style >
</style>