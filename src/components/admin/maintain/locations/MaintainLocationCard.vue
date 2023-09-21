<script setup>
import { ref } from "vue";
import LocationDialogBody from "./LocationDialogBody.vue";
import LocationDataService from "../../../../services/LocationDataService.js";

const emits = defineEmits(["closeLocationDialog", "refreshLocationsEvent"]);

defineProps({
  locationData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeLocationDialog() {
  createOrEditDialog.value = false;
}

async function disableLocation(location) {
  location.status = "Disabled";
  await LocationDataService.update(location)
    .then(() => {
      emits("refreshLocationsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableLocation(location) {
  location.status = "Active";
  await LocationDataService.update(location)
    .then(() => {
      emits("refreshLocationsEvent");
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
        <v-col cols="7" class="pl-0">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ locationData.roomName }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 text-blue pb-0">
            {{ locationData.roomNumber }} {{ locationData.building }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="locationData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ locationData.status }}
          </v-chip>
        </v-col>
      </v-row>
      <v-row class="pt-0 mt-0 pl-0">
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-btn
            flat
            size="small"
            class="font-weight-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
            @click="createOrEditDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
      <LocationDialogBody
        :is-edit="true"
        :location-data="locationData"
        @closeLocationDialogEvent="closeLocationDialog"
        @updateLocationSuccessEvent="
          closeLocationDialog(), emits('refreshLocationsEvent')
        "
        @disableLocationEvent="
          closeLocationDialog(), disableLocation(locationData)
        "
        @enableLocationEvent="
          closeLocationDialog(), enableLocation(locationData)
        "
      ></LocationDialogBody>
    </v-dialog>
  </v-card>
</template>
