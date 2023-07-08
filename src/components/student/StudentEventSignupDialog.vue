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
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-orange text-none"
          @click="handleClick"
        >
          Cancel
        </v-btn>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-orange text-none"
          @click="handleClick"
        >
          Signup
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
