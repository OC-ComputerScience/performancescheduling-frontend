<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import EventDataService from "../../services/EventDataService.js";
import EventSignupAndAvailabilityItem from "../EventSignupAndAvailabilityItem.vue";
import InstrumentItem from "./InstrumentItem.vue";
import NotificationItem from "../NotificationItem.vue";

const loginStore = useLoginStore();

const notifications = ref([]);
const instruments = ref([]);
const signups = ref([]);
const upcomingEvents = ref([]);

async function retrieveData() {
  await UserNotificationDataService.getByUserRole(loginStore.currentRole.id)
    .then((response) => {
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  // Only for test. @ethanimooney Remove once real data is added.
  notifications.value = [
    {
      title: "New Event Open!",
      body: "A new event is open for signup.",
      type: "event",
      action: "link",
    },
  ];

  await StudentInstrumentDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      instruments.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await StudentInstrumentDataService.getStudentInstrumentSignupsByUserRoleId(
    loginStore.currentRole.id
  )
    .then((response) => {
      signups.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await EventDataService.getAll()
    .then((response) => {
      upcomingEvents.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

onMounted(async () => {
  await retrieveData();
});
</script>

<template>
  <v-container fluid class="fill-height bg-lightGray pa-4">
    <v-row class="fill-height pa-0 ma-0">
      <v-col cols="3" class="ma-0 pa-4">
        <v-row class="fill-height ma-0">
          <v-col cols="12" class="pa-0 ma-0 pb-4">
            <v-card class="fill-height mainCardBorder pa-2">
              <v-card-title
                class="font-weight-semi-bold text-blue text-h5 pb-0"
              >
                {{ notifications.length }} Notification
                {{
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
              <v-card-title class="font-weight-semi-bold text-darkBlue text-h5">
                My Instruments
              </v-card-title>
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
      <v-col cols="5" class="pa-0 ma-0 pa-4">
        <v-card class="fill-height mainCardBorder pa-2">
          <v-card-title class="font-weight-semi-bold text-maroon text-h5">
            Events I'm Signed up For
          </v-card-title>
          <v-card-text>
            <EventSignupAndAvailabilityItem
              v-for="signup of signups"
              :key="signup.id"
              :event-data="signup.studentInstrumentSignups[0].eventSignup.event"
              :event-signup-data="
                signup.studentInstrumentSignups[0].eventSignup
              "
              :student-instrument-signup-data="
                signup.studentInstrumentSignups[0]
              "
              :is-signup="true"
            ></EventSignupAndAvailabilityItem>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4" class="pa-0 ma-0 pa-4">
        <v-card class="fill-height mainCardBorder pa-2">
          <v-card-title class="font-weight-semi-bold text-orange text-h5">
            Upcoming Events
          </v-card-title>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
