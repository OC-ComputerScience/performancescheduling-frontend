<script setup>
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
const emits = defineEmits(["closeDialogEvent"]);

const props = defineProps({
  eventData: { type: [Object], required: true },
});
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-text class="pt-0">
        <v-row class="pt-0 mt-0">
          <v-card-title class="font-weight-bold text-maroon text-h4">
            {{ eventData.name }}
          </v-card-title>
          <v-card color="lightMaroon">
            <v-card-text>
              <v-row class="pt-0 mt-0">
                <div class="text-maroon mx-2 mb-2 text-h7">
                  <v-icon icon="mdi-information"></v-icon>
                  {{ eventData.eventType.instrumentType + " Type" }}
                </div>
                <div class="text-maroon mx-2 text-h7">
                  <v-icon icon="mdi-calendar"></v-icon>
                  {{ formatDate(eventData.date) }}
                </div>
                <div class="text-maroon mx-2 text-h7">
                  <v-icon icon="mdi-clock"></v-icon>
                  {{
                    get12HourTimeStringFromString(eventData.startTime) +
                    " - " +
                    get12HourTimeStringFromString(eventData.endTime)
                  }}
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>
        <v-row class="pt-0 mt-0"> </v-row>
        <v-row class="pt-0 mt-0"> </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-lightMaroon text-maroon"
          @click="emits('closeDialogEvent')"
        >
          Cancel
        </v-btn>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          @click="emits('closeDialogEvent')"
        >
          Signup
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
