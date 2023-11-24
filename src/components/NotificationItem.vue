<script setup>
import { defineProps, defineEmits, ref, onMounted } from "vue";
import UserNotificationDataService from "../services/UserNotificationDataService.js";
import EventDataService from "../services/EventDataService.js";
const emits = defineEmits(["refreshNotices"]);
const props = defineProps({
  notificationData: { type: [Object], required: true },
});

const eventData = ref();
const eventId = props.notificationData.data.slice(8);
const editedNotificationData = ref(Object.assign({}, props.notificationData));
const eventName = ref("");

async function getEvent() {
  await EventDataService.getById(eventId)
    .then((response) => {
      eventData.value = response.data;
      eventName.value = eventData.value.name;
    })
    .catch((e) => {
      console.log(e);
    });
  console.log(eventData.value);
}
async function clearNotification() {
  editedNotificationData.value.isCompleted = true;
  await UserNotificationDataService.update(editedNotificationData.value).catch(
    (e) => {
      console.log(e);
    }
  );
  emits("refreshNotices");
}

getEvent();
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightGray mt-4">
    <v-card-title class="font-weight-semi-bold pb-0 text-blue">
      {{ props.notificationData.notification.type }}
    </v-card-title>
    <v-card-text class="pb-0">
      {{ props.notificationData.text }}
    </v-card-text>
    <v-card-actions class="pt-0">
      <!-- TODO: Add notficcatin actin link to this 
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-2 bg-blue text-none py-0"
      >
        View {{ props.notificationData.data }}
      </v-btn> -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-2 bg-blue text-none py-0"
        @click="clearNotification()"
      >
        Clear
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
