<script setup>
import { ref } from "vue";
import SemesterDialogBody from "./SemesterDialogBody.vue";
import SemesterDataService from "../../../../services/SemesterDataService.js";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits(["closeSemesterDialog", "refreshSemestersEvent"]);

defineProps({
  semesterData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeSemesterDialog() {
  createOrEditDialog.value = false;
}

</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-0 pb-2">
        <v-col cols="6" class="pl-0">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ semesterData.name }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 text-blue pb-0">
            {{ formatDate(semesterData.startDate) }}
            to
            {{ formatDate(semesterData.endDate) }}
          </v-card-text>
        </v-col>

      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 mr-2 text-none text-white bg-blue flatChipBorder"
        @click="createOrEditDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <SemesterDialogBody
      :is-edit="true"
      :semester-data="semesterData"
      @closeSemesterDialogEvent="closeSemesterDialog"
      @updateSemesterSuccessEvent="
        closeSemesterDialog(), emits('refreshSemestersEvent')
      "
    ></SemesterDialogBody>
  </v-dialog>
</template>

<style scoped></style>
