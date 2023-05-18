<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["performance"]);

onMounted(() => {
  console.log("sub-event", props.performance);
});
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
              {{ props.performance.event.eventType.description }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.date }}
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.eventSignups[0].startTime }}
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.location.roomName }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <v-btn
              class="font-weight-bold"
              density="compact"
              size="small"
              color="darkBlue"
              :style="{ width: '85px', fontSize: '9px' }"
              >view details</v-btn
            >
          </v-row>
        </v-col>
        <!-- instrument/people -->
        <v-col>
          <v-row align="center">
            <v-col cols="3">
              <v-icon icon="mdi-music-box-multiple" color="darkBlue"></v-icon>
            </v-col>
            <v-col>
              <p class="text-darkBlue mb-0">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .studentInstrument.instrument.name
                }}
              </p>
              <p class="text-blue mt-0">Instrument</p>
            </v-col>
          </v-row>
          <v-row></v-row>
          <v-row></v-row>
        </v-col>
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
