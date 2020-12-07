<template>

  <div v-if="estaPrendido">
   
    
    <v-form ref="form">
       <v-row justify="center">
           <v-col
      cols="11"
      sm="6"
      md="2"
    >
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
            label="Seleccione la hora de la mesa"
            prepend-inner-icon="mdi-clock-time-four-outline"
            readonly
            filled
            v-bind="attrs"
            v-on="on"
             background-color="white"
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
      <v-row justify="center">
        <v-col cols="12" sm="6" md="2">
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
                label="Seleccione la fecha de la mesa"
                prepend-inner-icon="mdi-calendar"
                readonly
                v-bind="attrs"
                v-on="on"
                filled
                 background-color="white"
              ></v-text-field>
            </template>
            <v-date-picker v-model="date" no-title scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="menu = false"> Cancel </v-btn>
              <v-btn text color="primary" @click="$refs.menu.save(date)">
                OK
              </v-btn>
            </v-date-picker>
          </v-menu>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            background-color="white"
            v-model="aula"
            :items="aulas"
            item-text="numero"
            filled
            label="Seleccione el aula"
            :rules="aulasRules"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            background-color="white"
            v-model="profeTitularSeleccionado"
            :items="profesMateria"
            item-text="nombre"
            filled
            label="Seleccione el profesor Titular"
            :rules="profesRulesT"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            v-model="profeSegundoSeleccionado"
            background-color="white"
            :items="profes"
            item-text="nombre"
            filled
            label="Seleccione el segundo profesor"
            :rules="profesRulesS"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            v-model="profeTerceroSeleccionado"
            background-color="white"
            :items="profes"
            item-text="nombre"
            filled
            label="Seleccione el tercer profesor"
            :rules="profesRulesTe"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            v-model="preceptorUnoSeleccionado"
            background-color="white"
            :items="preceptores"
            item-text="nombre"
            filled
            label="Seleccione el primer preceptor"
            :rules="preceptorRulesU"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-col cols="2">
          <v-select
            v-model="preceptorDosSeleccionado"
            background-color="white"
            :items="preceptores"
            item-text="nombre"
            filled
            label="Seleccione el segundo preceptor"
            :rules="preceptorRulesD"
            return-object
            required
          ></v-select>
        </v-col>
      </v-row>
      <v-row justify="center">
        <v-btn color="warning" @click="validate"> Agregar Datos Mesa </v-btn>
      </v-row>
    </v-form>
  </div>
</template>


<script>
import axios from "axios";

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
      aulas: [{ numero: 1 }, { numero: 2 }, { numero: 3 }, { numero: 4 }],
      profeTitularSeleccionado: "",
      profeSegundoSeleccionado: "",
      profeTerceroSeleccionado: "",
      preceptorUnoSeleccionado: "",
      preceptorDosSeleccionado: "",
      mesas: [],
      profesMateria: [],
      profes: [],
      preceptores: [],
      aula: 0,
      date: new Date().toISOString().substr(0, 10),
      menu: false,
      time: null,
      menu2: false,
      modal2: false,
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
    obtenerInformacion: function () {
      axios
        .get(
          "http://localhost:3000/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa?materia=" +
            this.materiaMesaElegida +
            "&anio=" +
            this.anioMateriaMesaElegida
        )
        .then((res) => {
          console.log(res.data);
          this.profesMateria = res.data.response;
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
        .get("http://localhost:3000/agregarDatosMesaExamen/obtenerProfesores")
        .then((res) => {
          console.log(res.data);
          this.profes = res.data.response;
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
        .get("http://localhost:3000/agregarDatosMesaExamen/obtenerPreceptores")
        .then((res) => {
          console.log(res.data);
          this.preceptores = res.data.response;
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

    validate: function () {
      this.$refs.form.validate();
      alert(this.date)
    },
  },
};
</script>

<style >
</style>