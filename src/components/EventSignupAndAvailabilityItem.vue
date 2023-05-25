<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../stores/LoginStore.js";
import { formatDate } from "../composables/formatDate";
import { get12HourTimeStringFromString } from "../composables/get12HourTimeStringFromString";

const loginStore = useLoginStore();

const props = defineProps({
  eventData: { type: [Object], required: true },
  eventSignupData: { type: [Object], required: true },
  studentInstrumentSignupData: { type: [Object], required: true },
  isSignup: { type: [Boolean], required: true },
});

onMounted(() => {
  console.log(props.eventData);
  console.log(props.studentInstrumentSignupData);
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-container>
      <v-row>
        <!-- Event Data -->
        <v-col class="pl-0">
          <!-- Event Name -->
          <v-card-title class="font-weight-bold text-maroon text-h5 py-0">
            {{ eventData.name }}
          </v-card-title>
          <!-- Event Date (formatted to mm/dd/yyyy) -->
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ formatDate(eventData.date) }}
          </v-card-subtitle>
          <!-- Signup Time Data -->
          <v-card-subtitle
            v-if="isSignup"
            class="font-weight-semi-bold text-maroon"
          >
            {{ get12HourTimeStringFromString(eventSignupData.startTime) }}
          </v-card-subtitle>
          <!-- Event Times (for availability version) -->
          <v-card-subtitle v-if="!isSignup"></v-card-subtitle>
          <!-- Event Location -->
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ eventData.location.roomName }}
          </v-card-subtitle>
          <!-- Edit Signup/Availability Button -->
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold ml-4 bg-darkBlue text-none mt-1"
          >
            Edit {{ isSignup ? "signup" : "availability" }}
          </v-btn>
        </v-col>
        <!-- Signup Data -->
        <v-col v-if="props.isSignup">
          <v-row>
            <v-col cols="2" align-self="center">
              <v-avatar size="30" color="darkBlue"></v-avatar>
            </v-col>
            <v-col cols="10">
              <v-card-subtitle
                class="font-weight-semi-bold text-h6 text-darkBlue"
              >
                Soprano
              </v-card-subtitle>
              <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                Instrument
              </v-card-text>
            </v-col>
          </v-row>
          <v-row class="pt-0 mt-0">
            <v-col cols="2" align-self="center">
              <v-avatar size="30" color="darkBlue"></v-avatar>
            </v-col>
            <v-col cols="10">
              <v-card-subtitle
                class="font-weight-semi-bold text-h6 text-darkBlue"
              >
                John Doe
              </v-card-subtitle>
              <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                Private Instructor
              </v-card-text>
            </v-col>
          </v-row>
          <v-row class="pt-0 mt-0">
            <v-col cols="2" align-self="center">
              <v-avatar size="30" color="darkBlue"></v-avatar>
            </v-col>
            <v-col cols="10">
              <v-card-subtitle
                class="font-weight-semi-bold text-h6 text-darkBlue"
              >
                James Doe
              </v-card-subtitle>
              <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                Accompanist
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
        <!-- Availability Data -->
        <v-col v-if="!props.isSignup"></v-col>
        <!-- Musical Selection Data -->
        <v-col v-if="props.isSignup">
          <v-row>
            <v-card-title class="font-weight-semi-bold text-maroon">
              Musical Selection
            </v-card-title>
          </v-row>
          <v-row class="pt-0 mt-0">
            <v-col cols="2" align-self="center">
              <v-avatar size="30" color="darkBlue"></v-avatar>
            </v-col>
            <v-col cols="10">
              <v-card-subtitle
                class="font-weight-semi-bold text-h6 text-darkBlue"
              >
                James Doe
              </v-card-subtitle>
              <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                Accompanist
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
