<script setup>
import { ref, onMounted } from "vue";

onMounted(() => {});
</script>
<template>
  <v-card color="lightMaroon" class="pa-2">
    <v-card-text>
      <v-row>
        <!-- event details -->
        <v-col cols="3">
          <v-row>
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '20px' }"
            >
              Recital Hearing
            </p>
          </v-row>
          <v-row class="mt-4">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              05/08/2023
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              10:05 am
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              Adams Recital Hall
            </p>
          </v-row>
          <v-row class="mt-4">
            <v-btn
              density="compact"
              size="small"
              color="darkBlue"
              :style="{ width: '85px', fontSize: '10px' }"
              >view details</v-btn
            >
          </v-row>
        </v-col>
        <!-- instrument/people -->
        <v-col> 2</v-col>
        <!-- pieces -->
        <v-col> 3</v-col>
        <!-- jurors -->
        <v-col> 4</v-col>
        <!-- buttons -->
        <v-col> 5</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style></style>
