<script setup>
import { ref, onMounted } from "vue";

const props = defineProps({
  notificationData: { type: [Object], required: true },
});

onMounted(() => {
  console.log(props.notificationData);
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightGray mt-4">
    <v-card-title class="font-weight-semi-bold pb-0 text-blue">
      {{ notificationData.title }}
    </v-card-title>
    <v-card-text class="pb-0">
      {{ notificationData.body }}
    </v-card-text>
    <v-card-actions class="pt-0">
      <!-- TODO: Add notificationData.link to this -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-2 bg-blue text-none py-0"
      >
        View {{ notificationData.type }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
