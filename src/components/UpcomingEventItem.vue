<script setup>
import { onMounted } from "vue";
import { formatDate } from "../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../composables/timeFormatter";

const props = defineProps({
  eventData: { type: [Object], required: true },
  isSignup: { type: [Boolean], required: true },
});

onMounted(() => {
  console.log(props.eventData);
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title class="pb-0 mb-0">
      <v-row>
        <v-col class="pl-0">
          <v-row class="pa-0 ma-0">
            <v-col cols="auto" class="pa-0 ma-0">
              <!-- Event Name -->
              <v-card-title class="font-weight-bold text-orange text-h4">
                {{ eventData.name }}
              </v-card-title>
              <!-- Event Instrument Type -->
              <!-- TODO(@ethanimooney): Make this actually work -->
              <v-card-subtitle
                class="pt-0 mt-0 font-weight-semi-bold text-darkBlue"
              >
                Vocal Event
              </v-card-subtitle>
            </v-col>
            <v-spacer></v-spacer>
            <!-- Number of People Signed Up -->
            <v-col cols="auto" class="mt-0 pt-2 mr-0 pr-0">
              <v-card
                flat
                rounded="md"
                class="bg-darkBlue py-2 px-0 text-white mt-0"
              >
                <v-card-subtitle class="font-weight-semi-bold">
                  {{ eventData.eventSignups.length }} People Signed Up
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <!-- Event Date -->
    <v-card-subtitle class="ml-1 mt-2 font-weight-semi-bold text-orange">
      {{ formatDate(eventData.date) }}
    </v-card-subtitle>
    <!-- Event Time -->
    <v-card-subtitle class="ml-1 font-weight-semi-bold text-orange">
      {{ get12HourTimeStringFromString(eventData.startTime) }} -
      {{ get12HourTimeStringFromString(eventData.endTime) }}
    </v-card-subtitle>
    <!-- Event Location (room name) -->
    <v-card-subtitle class="ml-1 mb-0 pb-0 font-weight-semi-bold text-orange">
      {{ eventData.location.roomName }}
    </v-card-subtitle>
    <v-card-actions class="pt-0 mt-0">
      <!-- Signup/Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-auto mr-2 bg-orange text-none"
      >
        {{ isSignup ? "Signup" : "Add availability" }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
