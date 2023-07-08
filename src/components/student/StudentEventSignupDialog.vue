<script setup>
import { useRouter } from "vue-router";

const props = defineProps({
  eventData: { type: [Object], required: true },
});

const router = useRouter();
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-text class="pt-0">
        <v-row class="pt-0 mt-0"> </v-row>
      </v-card-text>
      <v-card-actions> </v-card-actions>
    </v-form>
  </v-card>
</template>
