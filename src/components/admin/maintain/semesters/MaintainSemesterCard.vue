<script setup>
import { ref } from "vue";
import SemesterDialogBody from "./SemesterDialogBody.vue";
import SemesterDataService from "../../../../services/SemesterDataService.js";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits(["closeSemesterDialog", "refreshSemestersEvent"]);

const props = defineProps({
  semesterData: { type: [Object], required: true },
});

console.log(props.semesterData);
const createOrEditDialog = ref(false);

function closeSemesterDialog() {
  createOrEditDialog.value = false;
}

// Creates role labels for each role, and if Student, gets StudentInstrument data.

async function disableSemester(semesterId) {
  await SemesterDataService.disable(semesterId)
    .then(() => {
      emits("refreshSemestersEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableSemester(semesterId) {
  await SemesterDataService.enable(semesterId)
    .then(() => {
      emits("refreshSemestersEvent");
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
        <v-col cols="1" align-self="center"> </v-col>
        <v-col cols="6" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ semesterData.name }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
            {{ formatDate(semesterData.startDate) }}
            to
            {{ formatDate(semesterData.endDate) }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="semesterData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ semesterData.status === "Active" ? "Active" : "Disabled" }}
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
      <SemesterDialogBody
        :is-edit="true"
        :semester-data="semesterData"
        @closeSemesterDialogEvent="closeSemesterDialog"
        @updateSemesterSuccessEvent="
          closeSemesterDialog(), emits('refreshSemestersEvent')
        "
        @disableSemesterEvent="
          closeSemesterDialog(), disableSemester(semesterData.id)
        "
        @enableSemesterEvent="
          closeSemesterDialog(), enableSemester(semesterData.id)
        "
      ></SemesterDialogBody>
    </v-dialog>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
