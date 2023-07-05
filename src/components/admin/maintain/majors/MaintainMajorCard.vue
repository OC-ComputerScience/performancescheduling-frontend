<script setup>
import { ref } from "vue";
import MajorDialogBody from "./MajorDialogBody.vue";
import MajorDataService from "../../../../services/MajorDataService.js";

const emits = defineEmits(["closeMajorDialog", "refreshMajorsEvent"]);

defineProps({
  majorData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeMajorDialog() {
  createOrEditDialog.value = false;
}

async function disableMajor(major) {
  major.status = "Disabled";
  await MajorDataService.update(major)
    .then(() => {
      emits("refreshMajorsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableMajor(major) {
  major.status = "Active";
  await MajorDataService.update(major)
    .then(() => {
      emits("refreshMajorsEvent");
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
        <v-col cols="7" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ majorData.name }}
          </v-card-subtitle>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="majorData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ majorData.status }}
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
      <v-row class="pt-0 mt-0 pl-1">
        <v-col cols="6" class="pl-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="majorData.isMusicMajor ? 'bg-green' : 'bg-darkBlue'"
          >
            {{ majorData.isMusicMajor ? "Music" : "Non Music" }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="1200px">
      <MajorDialogBody
        :is-edit="true"
        :major-data="majorData"
        @closeMajorDialogEvent="closeMajorDialog"
        @updateMajorSuccessEvent="
          closeMajorDialog(), emits('refreshMajorsEvent')
        "
        @disableMajorEvent="closeMajorDialog(), disableMajor(majorData)"
        @enableMajorEvent="closeMajorDialog(), enableMajor(majorData)"
      ></MajorDialogBody>
    </v-dialog>
  </v-card>
</template>
