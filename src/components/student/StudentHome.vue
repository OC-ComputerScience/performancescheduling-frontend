<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import StudentInstrumentSignupDataService from "../../services/StudentInstrumentSignupDataService.js";
import UserInstrumentDialogBody from "../admin/maintain/users/UserInstrumentDialogBody.vue";
import EventDataService from "../../services/EventDataService.js";
import EventSignupItem from "./EventSignupItem.vue";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import InstrumentItem from "./InstrumentItem.vue";
import NotificationItem from "../NotificationItem.vue";
import UserDataService from "../../services/UserDataService";
import UserRoleDataService from "../../services/UserRoleDataService";

const loginStore = useLoginStore();
const studentRoleId = loginStore.currentRole.id;

const notifications = ref([]);
const instruments = ref([]);
const signups = ref([]);
const upcomingEvents = ref([]);
const relevantUpcomingEvents = ref([]);
const addInstrumentDialog = ref(false);
const activateStudent = ref(false);

async function retrieveData() {
  await UserNotificationDataService.getByUserRole(loginStore.currentRole.id)
    .then((response) => {
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await StudentInstrumentDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      instruments.value = response.data.filter(
        (data) => data.status === "Active"
      );
    })
    .catch((e) => {
      console.log(e);
    });

  await StudentInstrumentSignupDataService.getByUserRoleId(
    loginStore.currentRole.id,
    new Date(),
    "GTE",
    "asc"
  )
    .then((response) => {
      signups.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await EventDataService.getGTEDateForStudents(new Date(), "date,startTime")
    .then((response) => {
      upcomingEvents.value = response.data;
      relevantUpcomingEvents.value = upcomingEvents.value.filter((e) => {
        if (
          e.eventType.isPrivate === true &&
          e.privateUserRoleId === studentRoleId
        )
          return true;
        else if (
          !e.eventType.isPrivate &&
          e.eventType.instrumentType === "Both"
        )
          return true;
        else if (
          !e.eventType.isPrivate &&
          e.eventType.instrumentType === "Instrument" &&
          hasInstrument("Instrument")
        )
          return true;
        else if (
          !e.eventType.isPrivate &&
          e.eventType.instrumentType === "Vocal" &&
          hasInstrument("Vocal")
        )
          return true;
        else {
          return false;
        }
      });
    })
    .catch((e) => {
      console.log(e);
    });
}

async function activateUser() {
  await UserDataService.update({
    id: loginStore.user.userId,
    status: "Active",
  })
    .then(() => {
      activateStudent.value = false;
      addInstrumentDialog.value = true;
      loginStore.user.status = "Active";
    })
    .catch((e) => {
      console.log(e);
    });
  await UserRoleDataService.update({
    id: loginStore.currentRole.id,
    studentSemesters: loginStore.currentRole.studentSemesters + 1,
  })
    .then(loginStore.currentRole.studentSemesters++)
    .catch((e) => {
      console.log(e);
    });
}

function hasInstrument(instrumentType) {
  var found = false;
  instruments.value.forEach((instrument) => {
    if (
      instrument.instrument.type === instrumentType &&
      instrument.status === "Active"
    ) {
      found = true;
    }
  });
  return found;
}

function addInstrument() {
  addInstrumentDialog.value = true;
}
function closeAddInstrumentDialog() {
  addInstrumentDialog.value = false;
}
async function getInstruments() {
  await StudentInstrumentDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      instruments.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

onMounted(async () => {
  await retrieveData();
  if (loginStore.user.status === "Disabled") {
    activateStudent.value = true;
  }
});
</script>

<template>
  <div>
    <v-container fluid class="fill-height bg-lightGray pa-4">
      <v-row class="fill-height pa-0 ma-0">
        <v-col cols="12" lg="3" class="ma-0 pa-4">
          <v-row class="fill-height ma-0">
            <v-col cols="12" class="pa-0 ma-0 pb-4">
              <v-card
                class="fill-height mainCardBorder pa-2"
                style="overflow-y: auto; max-height: 400px; min-height: 400px"
              >
                <v-card-title
                  class="font-weight-semi-bold text-blue text-h5 pb-0"
                >
                  {{ notifications.length }} Notification{{
                    notifications.length > 0
                      ? notifications.length > 1
                        ? "s"
                        : ""
                      : "s"
                  }}
                </v-card-title>
                <v-card-text class="pt-0">
                  <NotificationItem
                    v-for="notification of notifications"
                    :key="notification.id"
                    :notification-data="notification"
                    @refreshNotices="retrieveData"
                  ></NotificationItem>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0 pt-4">
              <v-card
                class="fill-height mainCardBorder pa-2"
                style="overflow-y: auto; max-height: 300px; min-height: 300px"
              >
                <v-row>
                  <v-col cols="auto">
                    <v-card-title
                      class="font-weight-semi-bold text-darkBlue text-h5"
                    >
                      My Instruments
                    </v-card-title>
                  </v-col>
                  <v-spacer></v-spacer>

                  <v-btn class="mt-2" flat icon @click="addInstrument">
                    <v-icon
                      class="text-darkBlue"
                      icon="mdi-plus-circle"
                      size="large"
                    >
                    </v-icon>
                  </v-btn>
                </v-row>

                <v-card-text>
                  <InstrumentItem
                    v-for="instrument of instruments"
                    :key="instrument.id"
                    :instrument-data="instrument.instrument"
                  ></InstrumentItem>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="5" class="pa-0 ma-0 pa-4">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 740px; min-height: 740px"
          >
            <v-card-title class="font-weight-semi-bold text-maroon text-h5">
              Events I'm Signed up For
            </v-card-title>
            <v-card-text
              v-for="studentInstrumentSignup in signups"
              :key="studentInstrumentSignup.id"
            >
              <EventSignupItem
                :key="studentInstrumentSignup.id"
                :event-data="studentInstrumentSignup.eventSignup.event"
                :event-signup-data="studentInstrumentSignup.eventSignup"
                :student-instrument-signup-data="studentInstrumentSignup"
                :is-signup="true"
                @refreshEvents="retrieveData"
              >
              </EventSignupItem>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="4" class="pa-0 ma-0 pa-4">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 740px; min-height: 740px"
          >
            <v-card-title class="font-weight-semi-bold text-orange text-h5">
              Upcoming Events
            </v-card-title>
            <v-card-text>
              <UpcomingEventItem
                v-for="event of relevantUpcomingEvents"
                :key="event.id"
                :event-data="event"
                :role-id="loginStore.currentRole.roleId"
                @refreshEvents="retrieveData()"
              ></UpcomingEventItem>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="addInstrumentDialog" persistent max-width="600px">
      <UserInstrumentDialogBody
        :is-edit="false"
        :is-student="true"
        :student-instrument-data="{
          id: null,
          status: 'Active',
          levelId: null,
          studentRoleId: loginStore.currentRole.id,
          instructorRoleId: null,
          accompanistRoleId: null,
          instrumentId: null,
          instructorRole: null,
          accompanistRole: null,
          instrument: null,
          level: null,
        }"
        @addInstrumentSuccessEvent="
          closeAddInstrumentDialog(), getInstruments()
        "
        @closeUserInstrumentDialogEvent="closeAddInstrumentDialog"
      ></UserInstrumentDialogBody>
    </v-dialog>
    <v-dialog v-model="activateStudent" persistent max-width="600px">
      <v-card class="pa-2 bg-lightBlue flatCardBorder">
        <v-row class="pt-0 mt-0 text-darkblue font-weight-bold text-h4">
          <v-card-title>
            Welcome to the Performance Scheduling System!
          </v-card-title>
        </v-row>
        <v-row>
          <v-card-text>
            Please activate your account as a Music Student for this semester by
            clicking Activate and adding an instrument otherwise click Don't
            Activate.
          </v-card-text>
          <v-card-text>
            Once you Activate you will also need to:
            <ul class="ml-5">
              <li>Add any additional Instruments for this semester.</li>
              <li>
                Update your profile information, by clicking Student in Menu Bar
                and selecting User Settings.
              </li>
              <li>
                Add your Pieces for this semester for each Instrument by
                clicking Piece in Menu Bar.
              </li>
            </ul>
          </v-card-text>
        </v-row>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder bg-darkBlue"
            @click="activateUser()"
          >
            Activate
          </v-btn>
          <v-btn
            flat
            class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
            @click="activateStudent = false"
          >
            Don't Activate
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>
