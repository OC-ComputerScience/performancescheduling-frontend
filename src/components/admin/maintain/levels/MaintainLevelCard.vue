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

async function disableLevel(levelId) {
  await LevelDataService.disable(levelId)
    .then(() => {
      emits("refreshLevelsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableLevel(levelId) {
  await LevelDataService.enable(levelId)
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
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="6" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ levelData.name }} - {{ levelData.creditHours }} Hour(s)
          </v-card-subtitle>

          <v-card-text class="text-weight-semi-bold w-75">
            {{ levelData.description.slice(0, 50) + "..." }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="levelData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ levelData.status }}
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
      <LevelDialogBody
        :is-edit="true"
        :levelData="levelData"
        @closeLevelDialogEvent="closeLevelDialog"
        @updateLevelSuccessEvent="
          closeLevelDialog(), emits('refreshLevelsEvent')
        "
        @disableLevelEvent="closeLevelDialog(), disableLevel(levelData.id)"
        @enableLevelEvent="closeLevelDialog(), enableLevel(levelData.id)"
      ></LevelDialogBody>
    </v-dialog>
  </v-card>
</template>
