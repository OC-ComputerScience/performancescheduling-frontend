<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

const loginStore = useLoginStore();

const props = defineProps({
  instrumentData: { type: [Object], required: true },
});

onMounted(() => {
  console.log(props.instrumentData);
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightDarkBlue mt-4">
    <v-card-title class="font-weight-semi-bold text-darkBlue">
      {{ instrumentData.name }}
    </v-card-title>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
