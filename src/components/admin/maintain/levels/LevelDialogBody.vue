<script setup>
import { ref, onMounted } from "vue";

import LevelDataService from "../../../../services/LevelDataService";

const emits = defineEmits([
  "addLevelSuccessEvent",
  "closeAddLevelDialogEvent",
  "closeLevelDialogEvent",
  "updateLevelSuccessEvent",
  "disableLevelEvent",
  "enableLevelEvent",
]);

const form = ref(null);

const props = defineProps({
  levelData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedLevelData = ref(props.levelData);

// const editedLevelsRoles = ref(props.levelsRoles);

onMounted(() => {
  if (props.isEdit) {
    editedLevelData.value["id"] = props.levelData.id;
  }
});

async function addLevel() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await LevelDataService.create(editedLevelData.value)
        .then(async () => {
          emits("addLevelSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
async function updateLevel() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedLevelData.value["createdAt"];
      delete editedLevelData.value["updatedAt"];
      await LevelDataService.update(editedLevelData.value)
        .then(() => {
          emits("updateLevelSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
</script>

<template>
  <v-form ref="form" validate-on="input">
    <v-card class="pa-2 flatCardBorder">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Levels
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ levelData.name }}
            </v-card-title>
          </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="levelData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
            >
              {{ levelData.status === "Active" ? "Active" : "Disabled" }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions :class="props.isEdit ? '' : 'mt-2'">
        <v-card-text>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Name
          </v-card-subtitle>

          <v-text-field
            placeholder="name of level"
            v-model="editedLevelData.name"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[() => !!editedLevelData.name || 'This field is required']"
          ></v-text-field>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Description
          </v-card-subtitle>
          <v-textarea
            placeholder="description of level"
            autogrow
            rows="3"
            v-model="editedLevelData.description"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedLevelData.description || 'This field is required',
            ]"
          ></v-textarea>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Hours
          </v-card-subtitle>
          <v-text-field
            placeholder="1"
            v-model="editedLevelData.creditHours"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedLevelData.creditHours || 'This field is required',
              () =>
                /^\d$/.test(editedLevelData.creditHours) || 'Must be a number',
            ]"
          ></v-text-field>
        </v-card-text>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateLevel() : addLevel()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeLevelDialogEvent')
              : emits('closeAddLevelDialogEvent')
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
