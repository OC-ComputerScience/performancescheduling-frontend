<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import AvailabilityDialogBody from "./AvailabilityDialogBody.vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import ViewSignupsDialog from "../admin/maintain/events/ViewSignupsDialog.vue";
import EventDataService from "../../services/EventDataService";
import AvailabilityDataService from "../../services/AvailabilityDataService";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const router = useRouter();

const props = defineProps({
  eventData: { type: [Object], required: true },
  availabilityData: { type: [Object], required: true },
});

const emits = defineEmits(["refreshAvailabilitiesEvent"]);

const addAvailabilityDialog = ref(false);
const openAvailabilityDialog = ref(false);
const viewSignupsDialog = ref(false);
const eventAvailabilityData = ref([]);
const studentSignupData = ref([]);

function closeAvailabilityDialog() {
  addAvailabilityDialog.value = false;
  openAvailabilityDialog.value = false;
}
function closeSignupsDialog() {
  viewSignupsDialog.value = false;
}
function openCritique(eventId) {
  router.push({ path: "facultyCreateCritique", query: { eventId: eventId } });
}
function okToCritique(eventDate) {
  if (new Date(eventDate) <= new Date()) return true;
  else return false;
}
async function getDialogData() {
  await AvailabilityDataService.getAllByEventId(props.eventData.id)
    .then((response) => {
      eventAvailabilityData.value = response.data;
    })
    .catch((err) => {
      console.log(err.message);
    });

  await EventDataService.getById(props.eventData.id)
    .then((response) => {
      studentSignupData.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  viewSignupsDialog.value = true;
}

onMounted(async () => {});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title>
      <!-- Event Name -->
      <v-card-title class="font-weight-bold text-maroon text-h5">
        {{ eventData.name }}
      </v-card-title>
      <v-row>
        <!-- Event Date -->
        <v-col cols="auto pt-4 mr-11">
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ formatDate(eventData.date) }}
          </v-card-subtitle>
          <!-- Event Time -->
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ get12HourTimeStringFromString(eventData.startTime) }} -
            {{ get12HourTimeStringFromString(eventData.endTime) }}
          </v-card-subtitle>
        </v-col>

        <!-- Event Time and Availability Time -->
        <v-col cols="auto pt-4">
          <v-card-subtitle class="font-weight-bold text-maroon">
            Availability
          </v-card-subtitle>
          <!-- If there is more than one availability for the same event -->
          <div v-if="availabilityData.length > 1">
            <v-card-subtitle
              v-for="availability in availabilityData"
              :key="availability.id"
              class="font-weight-semi-bold text-darkBlue"
            >
              {{ get12HourTimeStringFromString(availability.startTime) }} -
              {{ get12HourTimeStringFromString(availability.endTime) }}
            </v-card-subtitle>
          </div>
          <div v-else>
            <v-card-subtitle class="font-weight-semi-bold text-darkBlue">
              {{ get12HourTimeStringFromString(availabilityData.startTime) }} -
              {{ get12HourTimeStringFromString(availabilityData.endTime) }}
            </v-card-subtitle>
          </div>
        </v-col>
      </v-row>
    </v-card-title>

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
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 mr-4 text-none text-white bg-blue flatChipBorder"
        @click="getDialogData"
      >
        View Signups
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
  <v-dialog v-model="viewSignupsDialog" persistent max-width="800px">
    <ViewSignupsDialog
      :event-data="eventData"
      :avail-data="eventAvailabilityData"
      :student-signup-data="studentSignupData"
      @closeSignupsDialog="closeSignupsDialog"
    ></ViewSignupsDialog>
  </v-dialog>
</template>
