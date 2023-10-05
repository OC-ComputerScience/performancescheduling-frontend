<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import EventDataService from "../../services/EventDataService.js";
import EventSignupItem from "./EventSignupItem.vue";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import InstrumentItem from "./InstrumentItem.vue";
import NotificationItem from "../NotificationItem.vue";

const loginStore = useLoginStore();
const studentRoleId = loginStore.currentRole.id;

const notifications = ref([]);
const instruments = ref([]);
const signups = ref([]);
const upcomingEvents = ref([]);
const relevantUpcomingEvents = ref([]);

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
      instruments.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await StudentInstrumentDataService.getStudentInstrumentSignupsByUserRoleId(
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

  await EventDataService.getGTEDateForStudents(new Date())
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

onMounted(async () => {
  await retrieveData();
});
</script>

<template>
  <div>
    <v-container fluid class="fill-height bg-lightGray pa-4">
      <v-row class="fill-height pa-0 ma-0">
        <v-col cols="12" lg="3" class="ma-0 pa-4">
          <v-row class="fill-height ma-0">
            <v-col cols="12" class="pa-0 ma-0 pb-4">
              <v-card class="fill-height mainCardBorder pa-2">
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
                  ></NotificationItem>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col cols="12" class="pa-0 ma-0 pt-4">
              <v-card class="fill-height mainCardBorder pa-2">
                <v-row>
                  <v-col cols="auto">
                    <v-card-title
                      class="font-weight-semi-bold text-darkBlue text-h5"
                    >
                      My Instruments
                    </v-card-title>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="auto">
                    <v-btn flat icon>
                      <v-icon class="text-darkBlue" icon="mdi-plus-circle">
                      </v-icon>
                    </v-btn>
                  </v-col>
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
          <v-card class="fill-height mainCardBorder pa-2">
            <v-card-title class="font-weight-semi-bold text-maroon text-h5">
              Events I'm Signed up For
            </v-card-title>
            <v-card-text
              v-for="studentInstrument in signups"
              :key="studentInstrument.id"
            >
              <EventSignupItem
                v-for="studentInstrumentSignup in studentInstrument.studentInstrumentSignups"
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
          <v-card class="fill-height mainCardBorder pa-2">
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
  </div>
</template>
