<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch } from "vue";


import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import EventDataService from "../../services/EventDataService.js";
import AvailabilityDataService from "../../services/AvailabilityDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import NotificationItem from "../NotificationItem.vue";
import CurrentStudentsItem from "./CurrentStudentsItem.vue";
import EventAvailabilityItem from "./EventAvailabilityItem.vue";
import EventSignupAndAvailabilityItem from "../EventSignupAndAvailabilityItem.vue";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const notifications = ref([]);
const students = ref([]);
const availabilities = ref([]);
const upcomingEvents = ref([]);

async function retrieveData() {
  console.log("loginStore", currentRole)
  await UserNotificationDataService.getByUserRole(currentRole.value.id)
  .then((response) => {
      console.log("notifications", response.data)
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
  
  if (currentRole.value.role.role == 'Faculty'){
    await StudentInstrumentDataService.getStudentsForInstructorId(currentRole.value.id)
    .then((response) => {
      students.value = response.data;
      console.log("students", students)
    })
    .catch((e) => {
      console.log(e);
    });
  }

  if (currentRole.value.role.role == 'Accompanist'){
    await StudentInstrumentDataService.getStudentsForAccompanistId(currentRole.value.id)
    .then((response) => {
      students.value = response.data;
      console.log("students", students)
    })
    .catch((e) => {
      console.log(e);
    });
  }

  await AvailabilityDataService.getByUserRole(currentRole.value.id)
  .then((response) => {
    const groupedAvailabilities = {};
    
    //Iterate through list of availabilities to group them by eventId
    for (let i = 0; i < response.data.length; i++) {
      const availability = response.data[i];
      const eventId = availability.eventId;
      
      //Index will be the eventId value
      if (!groupedAvailabilities[eventId]) {
        groupedAvailabilities[eventId] = [availability];
      } else {
        groupedAvailabilities[eventId].push(availability);
      }
    }

    //Put the values of the loop list into an availabilities list with "normal" indexes
    availabilities.value = Object.values(groupedAvailabilities);

    //availabilities.value = response.data;
    console.log("availability", availabilities);
  })
  .catch((e) => {
    console.log(e);
  });

  await EventDataService.getGTEDateForFaculty(new Date())
    .then((response) => {
      upcomingEvents.value = response.data;
      console.log("upcoming", upcomingEvents)
    })
    .catch((e) => {
      console.log(e);
    });
}

watch(currentRole, async () => {
  await retrieveData(); 
});

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
              </v-row>
              <v-card-text>
                <CurrentStudentsItem
                  v-for="student of students"
                  :key="student.id"
                  :students-data="student"
                ></CurrentStudentsItem>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
      <v-col cols="12" lg="5" class="pa-0 ma-0 pa-4">
        <v-card class="fill-height mainCardBorder pa-2">
          <v-card-title>
            <v-row class="pa-2">
              <p class="font-weight-semi-bold text-darkBlue text-h5">
                Events I'm Available For
              </p>
            </v-row>
          </v-card-title>
          <v-card-text>
            <EventAvailabilityItem
              v-for="availability in availabilities"
              :key="availability[0].id"
              :event-data="availability[0].event"
              :availability-data="availability.length <= 1 ? availability[0] : availability"
            ></EventAvailabilityItem>
          </v-card-text>
          <!-- <v-card-text>
            <EventSignupAndAvailabilityItem
              v-for="availability of availabilities"
              :key="availability.id"
              :event-data="availability.event"
              :event-signup-data="availability"
              :is-signup="false"
            ></EventSignupAndAvailabilityItem>
          </v-card-text> -->
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
              :role-id="currentRole.roleId"
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
