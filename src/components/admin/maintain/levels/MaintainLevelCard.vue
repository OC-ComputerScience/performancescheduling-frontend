<script setup>
import { ref } from "vue";
import LevelDialogBody from "./LevelDialogBody.vue";
import LevelDataService from "../../../../services/LevelDataService.js";

const emits = defineEmits(["closeLevelDialog", "refreshLevelsEvent"]);

defineProps({
  levelData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeLevelDialog() {
  createOrEditDialog.value = false;
}

async function disableLevel(level) {
  level.status = "Disabled";
  await LevelDataService.update(level)
    .then(() => {
      emits("refreshLevelsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableLevel(level) {
  level.status = "Active";
  await LevelDataService.update(level)
    .then(() => {
      emits("refreshLevelsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title class="mb-0">
      <v-row class="pt-0 mt-0 pb-0">
        <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
          {{ levelData.name }} - {{ levelData.creditHours }} Hour(s)
        </v-card-subtitle>
      </v-row>
    </v-card-title>
    <v-card-actions class="mt-0">
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        @click="createOrEditDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <LevelDialogBody
      :is-edit="true"
      :levelData="levelData"
      @closeLevelDialogEvent="closeLevelDialog"
      @updateLevelSuccessEvent="closeLevelDialog(), emits('refreshLevelsEvent')"
      @disableLevelEvent="closeLevelDialog(), disableLevel(levelData)"
      @enableLevelEvent="closeLevelDialog(), enableLevel(levelData)"
    ></LevelDialogBody>
  </v-dialog>
</template>
