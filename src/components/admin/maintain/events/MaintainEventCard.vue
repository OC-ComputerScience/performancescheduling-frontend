<script setup>
import { ref } from "vue";
import EventDialogBody from "./EventDialogBody.vue";
import EventDataService from "../../../../services/EventDataService";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits(["closeEventDialog", "refreshEventsEvent"]);

defineProps({
  eventData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeEventDialog() {
  createOrEditDialog.value = false;
}

// Creates role labels for each role, and if Student, gets StudentInstrument data.

async function disableEvent(eventId) {
  // await SemesterDataService.disable(semesterId)
  //   .then(() => {
  //     emits("refreshSemestersEvent");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

async function enableEvent(eventId) {
  // await SemesterDataService.enable(semesterId)
  //   .then(() => {
  //     emits("refreshSemestersEvent");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="1" align-self="center"> </v-col>
        <v-col cols="6" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ eventData.name }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
            {{ formatDate(eventData.startDate) }}
            to
            {{ formatDate(eventData.endDate) }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="eventData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ eventData.status === "Active" ? "Active" : "Disabled" }}
          </v-chip>
          <v-btn
            flat
            size="small"
            class="font-weight-bold mt-0 ml-4 text-none text-blue bg-white flatChipBorder"
            @click="createOrEditDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
      <EventDialogBody
        :is-edit="true"
        :event-data="eventData"
        @closeEventDialogEvent="closeEventDialog"
        @updateEventSuccessEvent="
          closeEventDialog(), emits('refreshEventEvent')
        "
        @disableEventEvent="closeEventDialog(), disableEvent(eventData.id)"
        @enableEventEvent="closeEventDialog(), enableEvent(eventData.id)"
      ></EventDialogBody>
    </v-dialog>
  </v-card>
</template>
