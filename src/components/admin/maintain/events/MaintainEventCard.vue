<script setup>
import { ref } from "vue";
import EventDialogBody from "./EventDialogBody.vue";
import EventDataService from "../../../../services/EventDataService";
import { formatDate } from "../../../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../../../composables/timeFormatter";

const emits = defineEmits(["closeEventDialog", "refreshEventsEvent"]);

defineProps({
  eventData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeEventDialog() {
  createOrEditDialog.value = false;
}

async function readyEvent(event) {
  event.isReady = true;
  await EventDataService.update(event)
    .then(() => {
      emits("refreshEventsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function unreadyEvent(event) {
  event.isReady = false;
  await EventDataService.update(event)
    .then(() => {
      emits("refreshEventsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="9" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ eventData.name }}
          </v-card-subtitle>
          <v-card-subtitle class="text-weight-semi-bold text-blue pt-1 pb-0">
            {{ formatDate(eventData.date) }}
            ({{ get12HourTimeStringFromString(eventData.startTime) }}
            to
            {{ get12HourTimeStringFromString(eventData.endTime) }})
          </v-card-subtitle>
          <v-card-subtitle class="text-weight-semi-bold text-blue pt-1 pb-0">
            {{ eventData.location.roomName }}
          </v-card-subtitle>
        </v-col>
        <v-col cols="3" class="text-right">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="eventData.isReady ? 'bg-teal' : 'bg-maroon'"
          >
            {{ eventData.isReady ? "Ready" : "Not Ready" }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 ml-4 text-none text-blue bg-white flatChipBorder"
        @click="createOrEditDialog = true"
      >
        View Signups
      </v-btn>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 ml-4 mr-2 text-none text-blue bg-white flatChipBorder"
        @click="createOrEditDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <EventDialogBody
      :is-edit="true"
      :event-data="eventData"
      @closeEventDialogEvent="closeEventDialog"
      @updateEventSuccessEvent="closeEventDialog(), emits('refreshEventsEvent')"
      @readyEventEvent="closeEventDialog(), readyEvent(eventData)"
      @unreadyEventEvent="closeEventDialog(), unreadyEvent(eventData)"
    ></EventDialogBody>
  </v-dialog>
</template>
