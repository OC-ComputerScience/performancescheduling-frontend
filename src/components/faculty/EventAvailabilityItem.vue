<script setup>
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";

const props = defineProps({
  eventData: { type: [Object], required: true },
  availabilityData: { type: [Object], required: true },
});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title>
      <v-row>
        <v-col class="pl-0">
          <v-row class="pa-0 ma-0">
            <v-col cols="auto" class="pa-0 ma-0">
              <!-- Event Name -->
              <v-card-title class="font-weight-bold text-maroon text-h4">
                {{ eventData.name }}
              </v-card-title>
              <v-row cols="auto" class="pt-1 ma-0">
              <!-- Event Date -->
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
                {{ formatDate(eventData.date) }}
              </v-card-subtitle>
              </v-row>
              <v-row cols="auto" class="pt-0 ma-0">
              <!-- Event Time (for loop) we currently don't handle more than one time for an event?-->
              <!--<div v-for="(event,index) of eventData"
              :key="index">-->
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
              {{ get12HourTimeStringFromString(eventData.startTime) }} -
              {{ get12HourTimeStringFromString(eventData.endTime) }}
              </v-card-subtitle>
            <!--</div>-->
            </v-row>
            </v-col>
            <v-col cols="auto" class="mt-0 pt-2 mr-0 pr-0">
              <v-row cols="auto" class="pt-12 pb-1">
                <!-- Availabilities (for loop)--> 
                <v-card-subtitle class="font-weight-semi-bold text-maroon">
                  Availability
                </v-card-subtitle>
                </v-row>
                <v-row cols="auto" class="pt-0">
                  <v-card-subtitle>
                    {{ get12HourTimeStringFromString(availabilityData.startTime) }} -
                    {{ get12HourTimeStringFromString(availabilityData.endTime) }}
                  </v-card-subtitle>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
   
    <v-card-actions class="pt-0 mt-0">
      <!-- Edit Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-2 bg-darkBlue text-none"
      >
        Edit availability
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
