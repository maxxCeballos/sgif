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
      mensajeExito: "Resultados enviados correctamente",
    };
  },
  beforeMount: function () {
    // TODO: reemplazar por consulta
    this.mesas = [
      {
        oidMesa: 0,
        acta: 1601,
        fechaHora: new Date(),
        nombreMateria: "Matematicas",
        anioMateria: 3,
        cicloLectivoMateria: 2020,
        aula: 4,
      },
      {
        oidMesa: 1,
        acta: 1602,
        fechaHora: new Date(),
        nombreMateria: "Lengua",
        anioMateria: 2,
        cicloLectivoMateria: 2019,
        aula: 5,
      },
      {
        oidMesa: 2,
        acta: 1603,
        fechaHora: new Date(),
        nombreMateria: "Biología",
        anioMateria: 2,
        cicloLectivoMateria: 2019,
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

      // TODO: reemplazar por consulta
      let alumnos = [
        {
          oidResultado: 0,
          oidAlumno: 0,
          legajo: 1234,
          nombre: "Guido1",
          apellido: "Canevello1",
        },
        {
          oidResultado: 1,
          oidAlumno: 1,
          legajo: 1235,
          nombre: "Guido2",
          apellido: "Canevello2",
        },
        {
          oidResultado: 2,
          oidAlumno: 2,
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
          nota: "0",
          condicion: "",
        };
        nuevosAlumnos.push(nuevoAlumno);
      });
      this.mesaSeleccionada.alumnos = nuevosAlumnos;
      this.mostrarCargaNotas = true;
    },

    handleErrorNotas(mensaje) {
      this.$refs.cartelExito.cerrarCartel();
      this.$refs.cartelError.abrirCartel(mensaje);
    },

    handleSubmit() {
      this.$refs.cartelError.cerrarCartel();
      this.$refs.cartelLoading.activar();

      let resultados = [];

      for (const resultado of this.mesaSeleccionada.alumnos) {
        resultados.push({
          oidResultado: resultado.oidResultado,
          oidAlumno: resultado.oidAlumno,
          nota: resultado.nota,
          condicion: resultado.condicion,
        });
      }

      // TODO: reemplazar por consulta
      setTimeout(() => {
        this.$refs.cartelLoading.desactivar();
        this.$refs.cartelExito.abrirCartel(this.mensajeExito);
        console.log("para la mesa de oid", this.mesaSeleccionada.oidMesa);
        console.log("los resultados son:", resultados);
      }, 2000);
    },
  },
};
</script>