<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { ref, onMounted, watch, computed } from "vue";

import UserNotificationDataService from "../../services/UserNotificationDataService.js";
import EventDataService from "../../services/EventDataService.js";
import AvailabilityDataService from "../../services/AvailabilityDataService.js";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import NotificationItem from "../NotificationItem.vue";
import CurrentStudentsItem from "./CurrentStudentsItem.vue";
import EventAvailabilityItem from "./EventAvailabilityItem.vue";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const notifications = ref([]);
const students = ref([]);
const availabilities = ref([]);
const groupedAvailabilities = ref([]);
const upcomingEvents = ref([]);

async function retrieveData() {
  await UserNotificationDataService.getByUserRole(currentRole.value.id)
    .then((response) => {
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  if (currentRole.value.role.role == "Faculty") {
    await StudentInstrumentDataService.getStudentsForInstructorId(
      currentRole.value.id
    )
      .then((response) => {
        students.value = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  if (currentRole.value.role.role == "Accompanist") {
    await StudentInstrumentDataService.getStudentsForAccompanistId(
      currentRole.value.id
    )
      .then((response) => {
        students.value = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  }

  refreshAvailability();

  await EventDataService.getGTEDateForFaculty(new Date(), "date,startTime")
    .then((response) => {
      upcomingEvents.value = response.data;
      console.log(upcomingEvents.value);
    })
    .catch((e) => {
      console.log(e);
    });
}

async function refreshAvailability() {
  await AvailabilityDataService.getByUserRole(currentRole.value.id)
    .then((response) => {
      groupedAvailabilities.value.length = 0;
      //Iterate through list of availabilities to group them by eventId
      for (let i = 0; i < response.data.length; i++) {
        const availability = response.data[i];
        const eventId = availability.eventId;

        //Index will be the eventId value
        if (!groupedAvailabilities.value[eventId]) {
          groupedAvailabilities.value[eventId] = [availability];
        } else {
          groupedAvailabilities.value[eventId].push(availability);
        }
      }

      // This cannot be sorted on the backend because it is reorganized in the code above
      groupedAvailabilities.value.sort(sortAvailabilities);
      groupedAvailabilities.value.forEach((avail) => {
        avail.sort(sortAvailabilityTimes);
      });

      //Put the values of the loop list into an availabilities list with "normal" indexes
      availabilities.value = Object.values(groupedAvailabilities.value);
    })
    .catch((e) => {
      console.log(e);
    });
}

function sortAvailabilities(a, b) {
  const aDate = new Date(a[0].event.date);
  const bDate = new Date(b[0].event.date);

  const dateCompare = aDate - bDate;
  if (dateCompare !== 0) {
    return dateCompare;
  }

  const aStartTime = a[0].event.startTime;
  const bStartTime = b[0].event.startTime;
  return aStartTime.localeCompare(bStartTime);
}

function sortAvailabilityTimes(a, b) {
  const aStartTime = a.startTime;
  const bStartTime = b.startTime;
  return aStartTime.localeCompare(bStartTime);
}

watch(currentRole, async () => {
  await retrieveData();
});

//Filter upcoming events without availability
const filteredEvents = computed(() => {
  return upcomingEvents.value.filter(
    (event) =>
      !groupedAvailabilities.value.some(
        (availability) => availability[0].event.id === event.id
      )
  );
});

function getSignups(eventID) {
  const count = upcomingEvents.value.find((event) => event.id === eventID)
    .eventSignups.length;
  return count;
}

function getEventType(eventID) {
  const eventType = upcomingEvents.value.find(
    (event) => event.id === eventID
  ).eventType;

  return eventType;
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
                style="overflow-y: auto; max-height: 400px; min-height: 400px"
              >
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
                    @refreshUsersEvent="retrieveData()"
                  ></CurrentStudentsItem>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
        <v-col cols="12" lg="4" class="pa-0 ma-0 pa-4">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 840px; min-height: 840px"
          >
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
                :availability-data="
                  availability.length <= 1 ? availability[0] : availability
                "
                :signUpCount="getSignups(availability[0].event.id)"
                :eventType="getEventType(availability[0].event.id)"
                @refreshAvailabilitiesEvent="refreshAvailability"
              ></EventAvailabilityItem>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" lg="5" class="pa-0 ma-0 pa-4">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 840px; min-height: 840px"
          >
            <v-card-title class="font-weight-semi-bold text-orange text-h5">
              Upcoming Events
            </v-card-title>
            <v-card-text>
              <UpcomingEventItem
                v-for="event of filteredEvents"
                :key="event.id"
                :event-data="event"
                :role-id="currentRole.roleId"
                :availability-data="groupedAvailabilities[event.id]"
                @refreshAvailabilitiesEvent="refreshAvailability"
              ></UpcomingEventItem>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
