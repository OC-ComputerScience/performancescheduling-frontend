<script setup>
import { ref, onBeforeUpdate } from "vue";

import { formatDate } from "../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../composables/timeFormatter";
import StudentEventSignupDialog from "./student/StudentEventSignupDialog.vue";
import AvailabilityDialogBody from "./faculty/AvailabilityDialogBody.vue";
import ViewSignupsDialog from "./admin/maintain/events/ViewSignupsDialog.vue";
import EventDialogBody from "./admin/maintain/events/EventDialogBody.vue";
import EventDataService from "../services/EventDataService";
import AvailabilityDataService from "../services/AvailabilityDataService";
import EventReport from "../reports/eventReport.js";

const dialog = ref(false);
const createOrEditDialog = ref(false);

const props = defineProps({
  eventData: { type: [Object], required: true },
  roleId: { type: [Number], required: true },
  fromEmail: { type: [String], required: true },
  availabilityData: { type: [Object], required: false },
});

const emits = defineEmits([
  "refreshAvailabilitiesEvent",
  "refreshEvents",
  "readyEventEvent",
  "unreadyEventEvent",
]);

const addOrEditAvailabilityDialog = ref(false);
const signupCount = ref(0);
const availabilityCount = ref(0);
const viewSignupsDialog = ref(false);
const eventAvailabilityData = ref([]);
const studentSignupData = ref([]);
const isEdit = ref(false);
const emailNoticeSent = ref(false);
const emailReminderSent = ref(false);

EventDataService.getById(props.eventData.id)
  .then((response) => {
    studentSignupData.value = response.data;
    studentSignupData.value.eventSignups.sort((a, b) => {
      return a.startTime > b.startTime ? 1 : -1;
    });
  })
  .catch((err) => {
    console.log(err);
  });

function closeAvailabilityDialog() {
  addOrEditAvailabilityDialog.value = false;
}
function closeEventDialog() {
  createOrEditDialog.value = false;
}
function closeSignupsDialog() {
  viewSignupsDialog.value = false;
}

async function unreadyEvent(event) {
  event.isReady = false;
  await EventDataService.update(event)
    .then(() => {
      emits("refreshEvents");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function readyEvent(event) {
  event.isReady = true;
  await EventDataService.update(event)
    .then(() => {
      emits("refreshEvents");
    })
    .catch((err) => {
      console.log(err);
    });
}

function sendNotification() {
  EventDataService.emailActiveStudentsForEvent(props.eventData.id, {
    fromEmail: props.fromEmail,
  });

  EventDataService.emailActiveInstAccForEvent(props.eventData.id, {
    fromEmail: props.fromEmail,
  });
  emailNoticeSent.value = true;
}

function sendReminder() {
  EventDataService.emailSignedUpStudentsForEvent(props.eventData.id, {
    fromEmail: props.fromEmail,
  });

  EventDataService.emailAvailInstAccForEvent(props.eventData.id, {
    fromEmail: props.fromEmail,
  });

  emailReminderSent.value = true;
}

function countSignUps() {
  signupCount.value = props.eventData.eventSignups.length;
}
async function getDialogData() {
  await AvailabilityDataService.getAllByEventId(props.eventData.id)
    .then((response) => {
      eventAvailabilityData.value = response.data;
    })
    .catch((err) => {
      console.log(err.message);
    });

  viewSignupsDialog.value = true;
}

function countAvailabilities() {
  availabilityCount.value = 0;
  if (props.eventData.availabilities != null) {
    let sortAvailabilities = props.eventData.availabilities;
    sortAvailabilities.sort((a, b) => {
      return a.userRoleId > b.userRoleId ? 1 : -1;
    });
    let currentRoleId = 0;
    sortAvailabilities.forEach((availability) => {
      if (availability.userRoleId != currentRoleId) {
        currentRoleId = availability.userRoleId;
        availabilityCount.value++;
      }
    });
  }
}
function generateEventReport() {
  EventReport.generateEventReport(props.eventData, studentSignupData.value);
}

onBeforeUpdate(async () => {
  countSignUps();
  countAvailabilities();
});
</script>

<template>
  <div>
    <v-card flat class="flatCardBorder bg-lightBlue mt-4">
      <v-card-title class="pb-0 mb-0">
        <v-row>
          <v-col class="pl-0">
            <v-row class="pa-0 ma-0">
              <v-col cols="auto" class="pa-0 ma-0">
                <!-- Event Name -->
                <v-card-title class="font-weight-bold text-orange text-h5">
                  {{ eventData.name }}
                </v-card-title>
                <div v-if="roleId == 3">
                  <v-row class="ml-3 mt-4 mb-3">
                    <v-card-subtitle
                      class="mb-0 pb-0 font-weight-semi-bold text-h7"
                      :class="eventData.isReady ? 'text-green' : 'text-red'"
                    >
                      {{ eventData.isReady ? "Ready" : "Not Ready" }}
                    </v-card-subtitle>
                    <v-btn
                      flat
                      size="small"
                      class="font-weight-semi-bold ml-auto mr-4 text-none text-white flatChipBorder"
                      :class="props.eventData.isReady ? 'bg-maroon' : 'bg-blue'"
                      @click="
                        props.eventData.isReady
                          ? unreadyEvent(eventData)
                          : readyEvent(eventData)
                      "
                    >
                      {{
                        props.eventData.isReady ? "Make Unready" : "Make Ready"
                      }}
                    </v-btn>
                  </v-row>
                </div>
                <!-- Event Instrument Type -->
                <!-- TODO(@ethanimooney): Make this actually work -->
                <v-card-subtitle
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
                    v-if="
                      (roleId == 3 ||
                        roleId == 1 ||
                        roleId == 2 ||
                        roleId == 4) &&
                      eventData.isReady
                    "
                    class="font-weight-semi-bold"
                  >
                    {{ eventData.eventSignups == null ? "0" : signupCount }}
                    People Signed Up
                  </v-card-subtitle>
                  <!--<v-card-subtitle
                    size="small"
                    v-if="roleId == 2 || roleId == 4"
                    class="font-weight-semi-bold ml-auto mr-2 bg-darkBlue text-none"
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
                  -->
                  <v-card-subtitle
                    v-if="roleId == 3 || roleId == 2"
                    class="font-weight-semi-bold"
                  >
                    {{ availabilityCount }}
                    Staff Available
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
        <v-spacer></v-spacer>
        <!--Unready/Ready-->

        <v-btn
          v-if="roleId != 1"
          flat
          size="small"
          class="font-weight-bold mt-0 mr-1 ml-0 text-none text-white bg-blue flatChipBorder"
          @click="generateEventReport()"
        >
          Event Report
        </v-btn>
        <v-btn
          v-if="roleId != 1"
          flat
          size="small"
          class="font-weight-bold mt-0 mr-1 ml-0 text-none text-white bg-blue flatChipBorder"
          @click="getDialogData"
        >
          View Signups
        </v-btn>

        <v-btn
          v-if="roleId == 1"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="dialog = true"
        >
          Signup
        </v-btn>
        <v-btn
          v-if="roleId != 1"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="(isEdit = false), (addOrEditAvailabilityDialog = true)"
        >
          Add Avail
        </v-btn>
        <v-btn
          v-if="roleId == 3"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="(isEdit = true), (addOrEditAvailabilityDialog = true)"
        >
          Edit Avail
        </v-btn>
        <v-btn
          v-if="roleId == 3"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="sendNotification"
        >
          Notify
        </v-btn>
        <v-btn
          v-if="roleId == 3 && eventData.isReady"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="sendReminder"
        >
          Remind
        </v-btn>
        <v-btn
          v-if="roleId == 3"
          flat
          size="small"
          class="font-weight-semi-bold mr-1 ml-0 bg-blue text-none"
          @click="createOrEditDialog = true"
        >
          Edit Event
        </v-btn>
      </v-card-actions>
    </v-card>
    <v-dialog v-model="dialog" persistent max-width="1050px">
      <student-event-signup-dialog
        :eventData="eventData"
        @closeDialogEvent="dialog = false"
        @refreshEvents="emits('refreshEvents')"
      >
      </student-event-signup-dialog>
    </v-dialog>
    <v-dialog
      v-model="addOrEditAvailabilityDialog"
      persistent
      max-width="600px"
    >
      <AvailabilityDialogBody
        :is-edit="isEdit"
        :availability-data="
          availabilityData
            ? availabilityData
            : { startTime: null, endTime: null }
        "
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
    <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
      <EventDialogBody
        :is-edit="true"
        :event-data="eventData"
        @closeEventDialogEvent="closeEventDialog"
        @updateEventSuccessEvent="closeEventDialog(), emits('refreshEvents')"
        @readyEventEvent="closeEventDialog(), readyEvent(eventData)"
        @unreadyEventEvent="closeEventDialog(), unreadyEvent(eventData)"
      ></EventDialogBody>
    </v-dialog>
    <v-dialog v-model="viewSignupsDialog" persistent max-width="800px">
      <ViewSignupsDialog
        :event-data="eventData"
        :avail-data="eventAvailabilityData"
        :student-signup-data="studentSignupData"
        @closeSignupsDialog="closeSignupsDialog"
      ></ViewSignupsDialog>
    </v-dialog>
    <v-dialog v-model="emailNoticeSent" persistent max-width="500px">
      <v-card flat class="flatCardBorder bg-lightBlue mt-4">
        <v-card-title class="font-weight-bold text-orange text-h5">
          {{ eventData.name }}
        </v-card-title>
        <v-card-subtitle
          class="ml-1 mt-2 font-weight-semi-bold text-h7 text-maroon text-wrap text-center"
        >
          Email Notification Sent
          {{
            eventData.isReady
              ? "to Faculty, Accompanists  and Students"
              : "to Faculty and  Accompanists"
          }}
          that are active
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold ma-4 text-none text-white bg-blue"
            @click="emailNoticeSent = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="emailReminderSent" persistent max-width="500px">
      <v-card class="flatCardBorder bg-lightBlue mt-4">
        <v-card-title class="font-weight-bold text-orange text-h5">
          {{ eventData.name }}
        </v-card-title>
        <v-card-subtitle
          class="ml-1 mt-2 font-weight-semi-bold text-h7 text-maroon text-wrap text-center"
        >
          Email Reminder Sent to Faculty, Accompanists and Students signed up
          for the event
        </v-card-subtitle>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold ma-4 text-none text-white bg-blue"
            @click="emailReminderSent = false"
            >Close</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
