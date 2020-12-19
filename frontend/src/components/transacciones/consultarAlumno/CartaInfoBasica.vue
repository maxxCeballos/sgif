<template>
  <div>
    <!-- PRIMERA FILA -->
    <v-row>
      <v-col>
        <indiv-carta-info :nombre="'D.N.I.'" :dato="alumno.dni" />
      </v-col>
      <v-col>
        <indiv-carta-info :nombre="'Sexo'" :dato="alumno.sexo" />
      </v-col>
      <v-col>
        <indiv-carta-info
          :nombre="'Fecha de Nacimiento'"
          :dato="alumno.fechaNacimiento"
        />
      </v-col>
      <v-col>
        <indiv-carta-info :nombre="'Lugar'" :dato="alumno.lugar" />
      </v-col>
    </v-row>
    <!-- SEGUNDA FILA -->
    <v-row>
      <v-col>
        <indiv-carta-info
          :nombre="'Fecha de Ingreso'"
          :dato="alumno.fechaIngreso"
        />
      </v-col>
      <v-col>
        <indiv-carta-info :nombre="'Escuela Anterior'" :dato="alumno.escuela" />
      </v-col>
      <v-col>
        <indiv-carta-info
          :nombre="'Estado Inscripción'"
          :dato="alumno.estadoInscripcion"
        />
      </v-col>
    </v-row>
  </div>
</template>

<script>
import IndivCartaInfo from "./Indiv/IndivCartaInfo";

export default {
  name: "CartaInfoBasica",
  props: ["alumno"],
  components: {
    IndivCartaInfo,
  },
};
</script>