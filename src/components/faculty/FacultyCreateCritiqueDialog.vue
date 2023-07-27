<script setup>
import { ref, onMounted, watch } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

onMounted(async () => {});
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input"> </v-form>
  </v-card>
</template>
