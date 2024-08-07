<script setup>
import { ref } from "vue";
import LocationDataService from "../../../../services/LocationDataService";

const emits = defineEmits([
  "addLocationSuccessEvent",
  "closeAddLocationDialogEvent",
  "closeLocationDialogEvent",
  "updateLocationSuccessEvent",
  "disableLocationEvent",
  "enableLocationEvent",
]);

const props = defineProps({
  locationData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedLocationData = ref(Object.assign({}, props.locationData));
const form = ref(null);

//add Location
async function addLocation() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await LocationDataService.create(editedLocationData.value)
        .then(async () => {
          emits("addLocationSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the location's roles

async function updateLocation() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await LocationDataService.update(editedLocationData.value)
        .then(() => {
          emits("updateLocationSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Location
          </v-col>
          <v-col
            v-if="props.isEdit"
            cols="auto"
            align-self="center"
            class="pt-0 mt-0"
          >
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold text-none text-white flatChipBorder"
              :class="
                locationData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ editedLocationData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0"> </v-row>
        <v-row :class="props.isEdit ? '' : 'mt-2'">
          <v-col>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Room Name
            </v-card-subtitle>
            <v-text-field
              placeholder="Judd Theatre"
              v-model="editedLocationData.roomName"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () => !!editedLocationData.roomName || 'This field is required',
              ]"
            ></v-text-field>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Room Number
            </v-card-subtitle>
            <v-text-field
              placeholder="GC-153"
              v-model="editedLocationData.roomNumber"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () =>
                  !!editedLocationData.roomNumber || 'This field is required',
              ]"
            ></v-text-field>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Building
            </v-card-subtitle>
            <v-text-field
              placeholder="Garvey Center"
              v-model="editedLocationData.building"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () => !!editedLocationData.building || 'This field is required',
              ]"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-maroon flatChipBorder"
          :class="
            props.locationData.status === 'Disabled'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="
            props.locationData.status === 'Disabled'
              ? emits('enableLocationEvent')
              : emits('disableLocationEvent')
          "
        >
          {{ props.locationData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateLocation() : addLocation()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeLocationDialogEvent')
              : emits('closeAddLocationDialogEvent')
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
