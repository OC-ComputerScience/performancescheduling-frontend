<script setup>
const props = defineProps({
  instrumentData: { type: [Object], required: true },
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightDarkBlue mt-4">
    <v-card-title class="font-weight-semi-bold text-darkBlue">
      {{ props.instrumentData.name }}
    </v-card-title>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
