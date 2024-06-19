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
import EventReport from "../../reports/eventReport.js";

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
  let date = new Date().toLocaleDateString().split("/");
  date[1] = ("0" + date[1]).slice(-2);
  date[0] = ("0" + date[0]).slice(-2);
  let today = `${date[2]}-${date[0]}-${date[1]}`;

  if (eventDate <= today) return true;
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
async function generateEventReport() {
  await EventDataService.getById(props.eventData.id)
    .then((response) => {
      studentSignupData.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  EventReport.generateEventReport(props.eventData, studentSignupData.value);
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
        <div>
          <v-card-subtitle
            v-for="availability in availabilityData"
            :key="availability.id"
            class="font-weight-semi-bold text-maroon"
          >
            {{ get12HourTimeStringFromString(availability.startTime) }} -
            {{ get12HourTimeStringFromString(availability.endTime) }}
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
        class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
        @click="openCritique(eventData.id)"
      >
        Critique
      </v-btn>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 mr-1 ml-0 text-none text-white bg-blue flatChipBorder"
        @click="generateEventReport()"
      >
        Event Report
      </v-btn>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 mr-1 ml-0 text-none text-white bg-blue flatChipBorder"
        @click="getDialogData"
      >
        View Signups
      </v-btn>
      <!-- Add Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
        @click="(addAvailabilityDialog = true), (openAvailabilityDialog = true)"
      >
        Add Avail
      </v-btn>
      <!-- Edit Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
        @click="openAvailabilityDialog = true"
      >
        Edit Avail
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
      @deleteAvailabilityEvent="emits('refreshAvailabilitiesEvent')"
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
