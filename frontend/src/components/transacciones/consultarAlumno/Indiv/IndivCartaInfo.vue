<template>
  <div>
    <v-card flat width="auto">
      <v-card-title class="subheading justify-center">
        {{ nombre }}
      </v-card-title>
      <v-card-text class="text-center font-weight-black">
        <div v-if="dato">
          {{ dato }}
        </div>
        <div v-else>{{ "-" }}</div>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  name: "IndivCartaInfo",
  props: ["nombre", "dato"],
};
</script>