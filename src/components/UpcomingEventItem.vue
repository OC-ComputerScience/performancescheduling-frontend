<script setup>
import { useRouter } from "vue-router";
import { formatDate } from "../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../composables/timeFormatter";

const router = useRouter();

const props = defineProps({
  eventData: { type: [Object], required: true },
  roleId: { type: [Number], required: true },
});

function handleClick() {
  if (props.roleId == 3) {
    router.push({ path: "adminEvents" });
  }
}
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
              <v-card-subtitle
                v-if="roleId == 3"
                class="mb-0 pb-0 font-weight-semi-bold"
                :class="eventData.isReady ? 'text-green' : 'text-red'"
              >
                {{ eventData.isReady ? "Ready" : "Not Ready" }}
              </v-card-subtitle>
              <!-- Event Instrument Type -->
              <!-- TODO(@ethanimooney): Make this actually work -->
              <v-card-subtitle
                v-if="roleId == 3 || roleId == 1"
                class="pt-0 mt-0 font-weight-semi-bold text-darkBlue"
              >
                {{
                  eventData.eventType.instrumentType === "Both"
                    ? "Vocal & Instrumental"
                    : eventData.eventType.instrumentType === "Vocal"
                    ? "Vocal"
                    : "Instrumental"
                }}
                Event
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
                <v-card-subtitle
                  v-if="(roleId == 3 || roleId == 1) && eventData.isReady"
                  class="font-weight-semi-bold"
                >
                  {{
                    eventData.eventSignups == null
                      ? "0"
                      : eventData.eventSignups.length
                  }}
                  People Signed Up
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="roleId == 2 || roleId == 4"
                  class="font-weight-semi-bold"
                >
                {{
                  eventData.eventType.instrumentType === "Both"
                    ? "Vocal & Instrumental"
                    : eventData.eventType.instrumentType === "Vocal"
                    ? "Vocal"
                    : "Instrumental"
                }}
                Event
                </v-card-subtitle>
                <v-card-subtitle
                  v-if="roleId == 3"
                  class="font-weight-semi-bold"
                >
                  {{
                    eventData.availabilities == null
                      ? "0"
                      : eventData.availabilities.length
                  }}
                  Availability Set
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
        @click="handleClick"
      >
        {{
          roleId == 1
            ? "Signup"
            : roleId == 3
            ? "Edit Event"
            : "Add Availability"
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
