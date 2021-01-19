<template>
  <div>
    <tabla-mesas-cerrar v-bind:mesas="mesas" v-on:select-mesa="selectMesa" />

    <loading ref="cartelLoading" />

    <!-- v-on:confirmar-operacion="confirmarExito" -->
    <cartel-exito ref="cartelExito" />

    <cartel-error ref="cartelError" />

    <tabla-carga-notas
      v-bind:mesa="mesaSeleccionada"
      v-bind:show="mostrarCargaNotas"
      v-on:error-operacion="handleErrorNotas"
      v-on:confirmar-operacion="handleSubmit"
    />
  </div>
</template>

<script>
import CartelError from "../components/CartelError.vue";
import CartelExito from "../components/CartelExito.vue";
import Loading from "../components/Loading.vue";
import TablaCargaNotas from "../components/transacciones/cerrarMesa/TablaCargaNotas.vue";
import TablaMesasCerrar from "../components/transacciones/cerrarMesa/TablaMesasCerrar.vue";

export default {
  name: "CerrarMesa",
  components: {
    TablaMesasCerrar,
    TablaCargaNotas,
    CartelExito,
    CartelError,
    Loading,
  },
  data() {
    return {
      mesas: [],
      mesaSeleccionada: {},
      mostrarCargaNotas: false,
    };
  },
  beforeMount: function () {
    this.mesas = [
      {
        acta: 1601,
        fechaHora: new Date(),
        nombreMateria: "Matematicas",
        anioMateria: 3,
        cicloLectivo: 2020,
        aula: 4,
      },
      {
        acta: 1602,
        fechaHora: new Date(),
        nombreMateria: "Lengua",
        anioMateria: 2,
        cicloLectivo: 2019,
        aula: 5,
      },
      {
        acta: 1603,
        fechaHora: new Date(),
        nombreMateria: "Biología",
        anioMateria: 2,
        cicloLectivo: 2019,
        aula: 2,
      },
    ];

    let nuevasMesas = [];
    this.mesas.forEach((mesa) => {
      let dia = mesa.fechaHora.getDate();
      let mes = mesa.fechaHora.getMonth();
      let año = mesa.fechaHora.getFullYear();
      let hora = mesa.fechaHora.getHours();
      let minuto = mesa.fechaHora.getMinutes();
      let nuevaMesa = {
        ...mesa,
        fecha: `${dia}/${mes}/${año}`,
        hora: `${hora}:${minuto}`,
      };
      nuevasMesas.push(nuevaMesa);
    });
    this.mesas = nuevasMesas;
  },
  methods: {
    selectMesa(actaMesa) {
      this.mesaSeleccionada = this.mesas.find((mesa) => mesa.acta === actaMesa);

      let alumnos = [
        {
          legajo: 1234,
          nombre: "Guido1",
          apellido: "Canevello1",
        },
        {
          legajo: 1235,
          nombre: "Guido2",
          apellido: "Canevello2",
        },
        {
          legajo: 1236,
          nombre: "Guido3",
          apellido: "Canevello3",
        },
      ];
      this.mesaSeleccionada = {
        ...this.mesaSeleccionada,
        alumnos,
      };

      //Agregar campo de nota y condicion
      let nuevosAlumnos = [];
      this.mesaSeleccionada.alumnos.forEach((alumno) => {
        let nuevoAlumno = {
          ...alumno,
          nota: 0,
          condicion: "",
        };
        nuevosAlumnos.push(nuevoAlumno);
      });
      this.mesaSeleccionada.alumnos = nuevosAlumnos;
      this.mostrarCargaNotas = true;
    },

    handleErrorNotas(mensaje) {
      this.$refs.cartelError.abrirCartel(mensaje);
    },

    handleSubmit() {
      console.log("Submiteado");
    },
  },
};
</script>