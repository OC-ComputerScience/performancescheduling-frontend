<script setup>
import { ref } from "vue";
import MajorDataService from "../../../../services/MajorDataService";

const emits = defineEmits([
  "addMajorSuccessEvent",
  "closeAddMajorDialogEvent",
  "closeMajorDialogEvent",
  "updateMajorSuccessEvent",
  "disableMajorEvent",
  "enableMajorEvent",
]);

const props = defineProps({
  majorData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedMajorData = ref(Object.assign({}, props.majorData));
const form = ref(null);

//add Major
async function addMajor() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await MajorDataService.create(editedMajorData.value)
        .then(async () => {
          emits("addMajorSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the major's roles

async function updateMajor() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedMajorData.value["createdAt"];
      delete editedMajorData.value["updatedAt"];

      await MajorDataService.update(editedMajorData.value)
        .then(() => {
          emits("updateMajorSuccessEvent");
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
            {{ props.isEdit ? "Edit" : "Add" }} Major
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
              :class="majorData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
            >
              {{ editedMajorData.status }}
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
              Major Name
            </v-card-subtitle>
            <v-text-field
              placeholder="Music"
              v-model="editedMajorData.name"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () => !!editedMajorData.name || 'This field is required',
              ]"
            ></v-text-field>

            <v-checkbox
              v-model="editedMajorData.isMusicMajor"
              label="Music Major?"
              class="text-blue font-weight-bold py-0 my-0 mb-4"
            ></v-checkbox>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer/>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-4 text-none text-white flatChipBorder"
          :class="
            props.majorData.status === 'Disabled' ? 'bg-darkBlue' : 'bg-maroon'
          "
          @click="
            props.majorData.status === 'Disabled'
              ? emits('enableMajorEvent')
              : emits('disableMajorEvent')
          "
        >
          {{ props.majorData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>

        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateMajor() : addMajor()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>

        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeMajorDialogEvent')
              : emits('closeAddMajorDialogEvent')
          "
        >
          Cancel
        </v-btn>

      </v-card-actions>
    </v-form>
  </v-card>
</template>
