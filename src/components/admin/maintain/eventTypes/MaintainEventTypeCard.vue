<script setup>
import { ref } from "vue";
import EventTypeDialogBody from "./EventTypeDialogBody.vue";
import EventTypeDataService from "../../../../services/EventTypeDataService.js";

const emits = defineEmits(["closeEventTypeDialog", "refreshEventTypesEvent"]);

defineProps({
  eventTypeData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeEventTypeDialog() {
  createOrEditDialog.value = false;
}

async function disableEventType(eventTypeId) {
  await EventTypeDataService.update({ id: eventTypeId, status: "Disabled" })
    .then(() => {
      emits("refreshEventTypesEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableEventType(eventTypeId) {
  await EventTypeDataService.update({ id: eventTypeId, status: "Active" })
    .then(() => {
      emits("refreshEventTypesEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-0">
        <v-col cols="6" class="pl-0">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ eventTypeData.type }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 text-blue pb-0">
            {{ eventTypeData.description }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="eventTypeData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ eventTypeData.status === "Active" ? "Active" : "Disabled" }}
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
    <v-card-actions>
      <v-row class="pb-5 pl-2 pt-2">
        <v-col cols="auto" class="pb-0 pr-0">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-semi-bold bg-darkBlue text-none flatChipBorder"
          >
            {{ eventTypeData.instrumentType }}
          </v-chip>
        </v-col>
        <v-col cols="auto" class="pb-0 pr-0">
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-blue text-none flatChipBorder"
          >
            {{ eventTypeData.slotType }}
          </v-chip>
        </v-col>
        <v-col cols="auto" class="pb-0 pr-0">
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-orange text-none text-white flatChipBorder"
          >
            {{ eventTypeData.defaultSlotDuration }} mins
          </v-chip>
        </v-col>
        <v-col cols="auto" class="pb-0 pr-0" v-if="eventTypeData.isPrivate">
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-maroon text-none text-white flatChipBorder"
          >
            Private
          </v-chip>
        </v-col>
      </v-row>
    </v-card-actions>
    <v-dialog v-model="createOrEditDialog" persistent max-width="600">
      <EventTypeDialogBody
        :is-edit="true"
        :event-type-data="eventTypeData"
        @closeEventTypeDialogEvent="closeEventTypeDialog"
        @updateEventTypeSuccessEvent="
          closeEventTypeDialog(), emits('refreshEventTypesEvent')
        "
        @disableEventTypeEvent="
          closeEventTypeDialog(), disableEventType(eventTypeData.id)
        "
        @enableEventTypeEvent="
          closeEventTypeDialog(), enableEventType(eventTypeData.id)
        "
      ></EventTypeDialogBody>
    </v-dialog>
  </v-card>
</template>
