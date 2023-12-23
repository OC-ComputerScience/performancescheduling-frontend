<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import AvailabilityDialogBody from "./AvailabilityDialogBody.vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const router = useRouter();

const props = defineProps({
  eventData: { type: [Object], required: true },
  availabilityData: { type: [Object], required: true },
  signUpCount: { type: [Number], required: true },
  eventType: { type: [Object], required: true },
});

const emits = defineEmits(["refreshAvailabilitiesEvent"]);

const addAvailabilityDialog = ref(false);
const openAvailabilityDialog = ref(false);

function closeAvailabilityDialog() {
  addAvailabilityDialog.value = false;
  openAvailabilityDialog.value = false;
}

function openCritique(eventId) {
  router.push({ path: "facultyCreateCritique", query: { eventId: eventId } });
}
function okToCritique(eventDate) {
  if (new Date(eventDate) <= new Date()) return true;
  else return false;
}

onMounted(async () => {});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title class="pb-0 mb-0">
      <v-row>
        <v-col class="pl-0">
          <v-row class="pa-0 ma-0">
            <v-col cols="auto" class="pa-0 ma-0">
              <!-- Event Name -->
              <v-card-title class="font-weight-bold text-maroon text-h5">
                {{ eventData.name }}
              </v-card-title>

              <v-card-subtitle
                class="pt-0 mt-0 font-weight-semi-bold text-maroon"
              >
                {{
                  eventType.instrumentType === "Both"
                    ? "Vocal & Instrumental"
                    : eventType.instrumentType === "Vocal"
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
                <v-card-subtitle class="font-weight-semi-bold">
                  {{ signUpCount }}
                  People Signed Up
                </v-card-subtitle>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-row>
      <v-col cols="7">
        <!-- Event Date -->
        <v-card-subtitle class="ml-1 mt-2 font-weight-semi-bold text-maroon">
          {{ formatDate(eventData.date) }}
        </v-card-subtitle>
        <!-- Event Time -->
        <v-card-subtitle class="ml-1 font-weight-semi-bold text-maroon">
          {{ get12HourTimeStringFromString(eventData.startTime) }} -
          {{ get12HourTimeStringFromString(eventData.endTime) }}
        </v-card-subtitle>
        <!-- Event Location (room name) -->
        <v-card-subtitle
          class="ml-1 mb-0 pb-0 font-weight-semi-bold text-maroon"
        >
          {{ eventData.location.roomName }}
        </v-card-subtitle>
      </v-col>

      <!-- Event Availability Times -->
      <v-col cols="5">
        <v-card-subtitle class="font-weight-bold text-black">
          Availability
        </v-card-subtitle>
        <!-- If there is more than one availability for the same event -->
        <div v-if="availabilityData.length > 1">
          <v-card-subtitle
            v-for="availability in availabilityData"
            :key="availability.id"
            class="font-weight-semi-bold text-maroon"
          >
            {{ get12HourTimeStringFromString(availability.startTime) }} -
            {{ get12HourTimeStringFromString(availability.endTime) }}
          </v-card-subtitle>
        </div>
        <div v-else>
          <v-card-subtitle class="font-weight-semi-bold text-maroonls">
            {{ get12HourTimeStringFromString(availabilityData.startTime) }} -
            {{ get12HourTimeStringFromString(availabilityData.endTime) }}
          </v-card-subtitle>
        </div>
      </v-col>
    </v-row>
    <v-card-actions class="pt-0 mt-2">
      <!-- Add Critique Button -->
      <v-spacer></v-spacer>
      <v-btn
        v-if="
          okToCritique(eventData.date) && currentRole.role.role == 'Faculty'
        "
        flat
        size="small"
        class="font-weight-semi-bold mr-2 ml-auto bg-blue text-none"
        @click="openCritique(eventData.id)"
      >
        Critique
      </v-btn>
      <!-- Add Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-auto bg-blue text-none"
        @click="(addAvailabilityDialog = true), (openAvailabilityDialog = true)"
      >
        Add availability
      </v-btn>
      <!-- Edit Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold mr-2 bg-blue text-none"
        @click="openAvailabilityDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>

  <!--Availability Data only gets the current availability to display on the dialog box. Therefore, if I have to add
  an availability to an event that already has previous availabilities there, I won't be able to check them in that
  add dialog, so I cannot check if that availability was conflicting with previous ones. That is why we have
  complete-availability-data-->
  <v-dialog v-model="openAvailabilityDialog" persistent max-width="600px">
    <AvailabilityDialogBody
      :is-edit="addAvailabilityDialog ? false : true"
      :availability-data="
        addAvailabilityDialog
          ? { startTime: null, endTime: null }
          : availabilityData
      "
      :complete-availability-data="availabilityData"
      :event-data="eventData"
      @updateAvailabilityEvent="
        closeAvailabilityDialog(), emits('refreshAvailabilitiesEvent')
      "
      @addAvailabilityEvent="
        closeAvailabilityDialog(), emits('refreshAvailabilitiesEvent')
      "
      @deleteAvailabilityEvent="
        closeAvailabilityDialog(), emits('refreshAvailabilitiesEvent')
      "
      @closeAvailabilityDialogEvent="closeAvailabilityDialog()"
    ></AvailabilityDialogBody>
  </v-dialog>
</template>
