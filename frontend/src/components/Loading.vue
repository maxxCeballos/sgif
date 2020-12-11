<template>
<v-dialog
      v-model="dialog"
      hide-overlay
      persistent
      width="300"
    >
      <v-card
        color="primary"
        dark
      >
        <v-card-text>
          Porfavor
          <v-progress-linear
            indeterminate
            color="white"
            class="mb-0"
          ></v-progress-linear>
        </v-card-text>
      </v-card>
    </v-dialog>
</template>


<script>
  export default {
    data () {
      return {
        dialog: false,
      }
    },
    methods:{
    activar: function () {
      this.dialog = true;
      setTimeout(() => (this.fin()), 4000)
    },
    fin: function () {
      this.dialog = false;
      this.$emit('cargaFinalizada');
    }
    }
  }
</script>
