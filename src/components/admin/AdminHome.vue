<script setup>
import AdminPendingItemCard from "./AdminPendingItemCard.vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";

import EventDataService from "../../services/EventDataService.js";
import ComposerDataService from "../../services/ComposerDataService";
import InstrumentDataService from "../../services/InstrumentDataService";
import MajorDataService from "../../services/MajorDataService";
import PieceDataService from "../../services/PieceDataService";
import UpcomingEventItem from "../UpcomingEventItem.vue";
import NotificationItem from "../NotificationItem.vue";
import UserNotificationDataService from "../../services/UserNotificationDataService.js";

const loginStore = useLoginStore();
const pendingItemCount = ref(0);
const pendingItems = ref([]);
const upcomingEvents = ref([]);
const notifications = ref([]);

async function retrieveData() {
  pendingItemCount.value = 0;
  pendingItems.value = [];
  await EventDataService.getGTEDateForAdmins(new Date(), "date,startTime")
    .then((response) => {
      upcomingEvents.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
  await UserNotificationDataService.getByUserRole(loginStore.currentRole.id)
    .then((response) => {
      notifications.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
  await ComposerDataService.getAllByStatus("Pending")
    .then((response) => {
      if (response.data.length > 0) {
        pendingItems.value.push({
          count: response.data.length,
          text: "Pending Composers",
          link: "adminComposers",
        });
        pendingItemCount.value += response.data.length;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  await InstrumentDataService.getAllByStatus("Pending")
    .then((response) => {
      if (response.data.length > 0) {
        pendingItems.value.push({
          count: response.data.length,
          text: "Pending Instruments",
          link: "adminInstruments",
        });
        pendingItemCount.value += response.data.length;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  await MajorDataService.getAllByStatus("Pending")
    .then((response) => {
      if (response.data.length > 0) {
        pendingItems.value.push({
          count: response.data.length,
          text: "Pending Majors",
          link: "adminMajors",
        });
        pendingItemCount.value += response.data.length;
      }
    })
    .catch((e) => {
      console.log(e);
    });

  await PieceDataService.getAllByStatus("Pending")
    .then((response) => {
      if (response.data.length > 0) {
        pendingItems.value.push({
          count: response.data.length,
          text: "Pending Pieces",
          link: "adminPieces",
        });
        pendingItemCount.value += response.data.length;
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

async function refreshEvents() {
  await retrieveData();
}

onMounted(async () => {
  await retrieveData();
});
</script>

<template>
  <div>
    <v-container fluid class="fill-height bg-lightGray pa-4">
      <v-row class="fill-height pa-0 ma-0">
        <v-col cols="6" lg="5" class="pa-0 ml-8 ma-2">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 200px; min-height: 200px"
          >
            <v-card-title>
              <v-row class="pa-2">
                <p class="font-weight-semi-bold text-darkBlue text-h5">
                  Pending Items
                </p>
                <v-spacer> </v-spacer>
                <v-sheet class="bg-lightDarkBlue px-2" rounded>
                  <span class="text-darkBlue">{{ pendingItemCount }}</span>
                </v-sheet>
              </v-row>
            </v-card-title>
            <v-card-text>
              <AdminPendingItemCard
                v-for="pendingItem in pendingItems"
                :item-count="pendingItem.count"
                :text="pendingItem.text"
                :link="pendingItem.link"
                :key="pendingItem.id"
              ></AdminPendingItemCard>
            </v-card-text>
          </v-card>

          <v-card
            class="fill-height mainCardBorder pa-2 mt-5"
            style="overflow-y: auto; max-height: 400px; min-height: 400px"
          >
            <v-card-title class="font-weight-semi-bold text-blue text-h5 pb-0">
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
        <v-col cols="6" lg="6" class="pa-0 ml-8 ma-2">
          <v-card
            class="fill-height mainCardBorder pa-2"
            style="overflow-y: auto; max-height: 740px; min-height: 740px"
          >
            <v-card-title class="font-weight-semi-bold text-orange text-h5">
              Upcoming Events
            </v-card-title>
            <v-card-text>
              <UpcomingEventItem
                v-for="event of upcomingEvents"
                :key="event.id"
                :event-data="event"
                :role-id="loginStore.currentRole.roleId"
                :fromEmail="loginStore.user.email"
                @refreshEvents="refreshEvents()"
                @refreshAvailabilitiesEvent="refreshEvents()"
              ></UpcomingEventItem>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>
