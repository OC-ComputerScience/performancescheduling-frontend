<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";

import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import EventDataService from "../../services/EventDataService.js";
import EventSignupAndAvailabilityItem from "../EventSignupAndAvailabilityItem.vue";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import InstrumentItem from "./InstrumentItem.vue";
import NotificationItem from "../NotificationItem.vue";

const loginStore = useLoginStore();

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
    loginStore.currentRole.id,
    new Date()
  )
    .then((response) => {
      signups.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  await EventDataService.getGTEDate(new Date())
    .then((response) => {
      upcomingEvents.value = response.data;
      // TODO(@ethanimooney): Make it check the actual event types that the student needs once that is implemented.
      relevantUpcomingEvents.value.concat(
        upcomingEvents.value.filter((e) => e.eventTypeId === 2)
      );
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
      <v-col cols="12" lg="3" class="ma-0 pa-4">
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
      <v-col cols="12" lg="4" class="pa-0 ma-0 pa-4">
        <v-card class="fill-height mainCardBorder pa-2">
          <v-card-title class="font-weight-semi-bold text-orange text-h5">
            Upcoming Events
          </v-card-title>
          <v-card-text>
            <UpcomingEventItem
              v-for="event of upcomingEvents"
              :key="event.id"
              :event-data="event"
              :is-signup="true"
            ></UpcomingEventItem>
          </v-card-text>
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
