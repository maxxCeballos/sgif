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
          Porfavor espere un momento
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
    
    },
    desactivar: function () {
      this.dialog = false;      
    }
    }
  }
</script>
