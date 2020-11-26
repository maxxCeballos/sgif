<template>
  <v-container fluid>
    <v-row align="center">
      <v-col cols="6" >
        <v-select :items= "profesMateria"  item-text="nombre"  filled label="Seleccione el profesor Titular"  return-object></v-select>
      </v-col>
      <v-col cols="6" >
        <v-select :items= "profes"  item-text="nombre"  filled label="Seleccione el segundo profesor"  return-object></v-select>
      </v-col>
      
    </v-row>
    
  </v-container>
</template>


<script>


import axios from "axios";

export default {
  name: "TagregarDMI",
  props: {
    oidMesaElegida: { type: String, required: true },
    materiaMesaElegida: { type: String, required: true },
    anioMateriaMesaElegida: { type: Number, required: true },
  },
  data: function () {
    return {
      mesas: [],
      profesMateria:[],
      profes:[]
    };
  },
  methods: {
    gg: function (mensaje) {
      alert(mensaje);
    },
  },
  mounted() {
    axios
      .get("http://localhost:3000/agregarDatosMesaExamen/obtenerProfesoresMateria/mesa?materia="+this.materiaMesaElegida+"&anio="+this.anioMateriaMesaElegida)
      .then((res) => {console.log(res.data);this.profesMateria = res.data.response})
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
      .then((res) => {console.log(res.data);this.profes = res.data.response})
      .catch((error) => {
        if (!error.response) {
          // network error
          this.errorStatus = "Error: Network Error";
        } else {
          this.errorStatus = error.response.data.message;
        }
      });},
};
</script>
/agregarDatosMesaExamen/obtenerProfesores

<style >

</style>