<script setup>
import FacultyPendingItemCard from "./FacultyPendingItemCard.vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";


import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import EventDataService from "../../services/EventDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import NotificationItem from "../NotificationItem.vue";
import CurrentStudentsItem from "./CurrentStudentsItem.vue";

const loginStore = useLoginStore();

const notifications = ref([]);
const students = ref([]);
const pendingItems = ref([]);
const upcomingEvents = ref([]);

async function retrieveData() {
  console.log("loginStore", loginStore.currentRole.id)
  await UserNotificationDataService.getByUserRole(loginStore.currentRole.id)
  .then((response) => {
      console.log("notifications", response.data)
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
  
  await StudentInstrumentDataService.getStudentsForInstructorId(loginStore.currentRole.id)
    .then((response) => {
      students.value = response.data;
      console.log("students", students)
    })
    .catch((e) => {
      console.log(e);
    });

  await EventDataService.getGTEDateForFaculty(new Date())
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
                    Current Students
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
                <CurrentStudentsItem
                  v-for="student of students"
                  :key="student.id"
                  :student-data="student.student"
                ></CurrentStudentsItem>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <!-- <v-col cols="12" lg="3" class="ma-0 pa-4">
        <h1 class="text-maroon">Home</h1>
        <v-row class="fill-height ma-0">
          <v-col cols="12" class="pa-0 ma-0 pt-6 pb-4">
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
        </v-col> -->
      <v-col cols="12" lg="5" class="pa-0 ma-0 pa-4">
        <v-card class="fill-height mainCardBorder pa-2">
          <v-card-title>
            <v-row class="pa-2">
              <p class="font-weight-semi-bold text-darkBlue text-h5">
                Events I'm Available for
              </p>
              <v-spacer> </v-spacer>
              <v-sheet class="bg-lightDarkBlue px-2" rounded>
                <span class="text-darkBlue">{{ 1 }}</span>
              </v-sheet>
            </v-row>
          </v-card-title>
          <v-card-text>
            <FacultyPendingItemCard
              v-for="pendingItem in pendingItems"
              :item-count="pendingItem.count"
              :text="pendingItem.text"
              :link="pendingItem.link"
            ></FacultyPendingItemCard>
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
              :role-id="loginStore.currentRole.roleId"
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
