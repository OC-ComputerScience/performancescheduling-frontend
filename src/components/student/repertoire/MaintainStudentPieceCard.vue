<script setup>
import { ref } from "vue";
import StudentPieceDialogBody from "./StudentPieceDialogBody.vue";
import StudentPieceDataService from "./../../../services/StudentPieceDataService.js";

const emits = defineEmits([
  "closeStudentPieceDialog",
  "refreshStudentPiecesEvent",
]);

defineProps({
  studentpieceData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeStudentPieceDialog() {
  createOrEditDialog.value = false;
}

async function disableStudentPiece(studentpiece) {
  studentpiece.status = "Disabled";
  await StudentPieceDataService.update(studentpiece)
    .then(() => {
      emits("refreshStudentPiecesEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableStudentPiece(studentpiece) {
  studentpiece.status = "Active";
  await StudentPieceDataService.update(studentpiece)
    .then(() => {
      emits("refreshStudentPiecesEvent");
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
            {{ studentpieceData.piece.title }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
            {{ studentpieceData.piece.composer.lastName }},
            {{ studentpieceData.piece.composer.firstName }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="
              studentpieceData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
            "
          >
            {{ studentpieceData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-actions>
      <v-row class="pb-5 pl-2 pt-2">
        <v-col cols="auto" class="pb-0 pr-0">
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-maroon text-none text-white flatChipBorder"
          >
            {{ studentpieceData.semester.name }}
          </v-chip>
        </v-col>
        <v-col cols="auto" class="pb-0 pr-0">
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-maroon text-none text-white flatChipBorder"
          >
            {{ studentpieceData.studentInstrument.instrument.name }}
          </v-chip>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pb-0 pr-5">
          <v-btn
            flat
            size="small"
            class="font-weight-bold mt-0 mr-2 text-none text-blue bg-white flatChipBorder"
            @click="createOrEditDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <StudentPieceDialogBody
      :is-edit="true"
      :studentpiece-data="studentpieceData"
      :student-id="studentpieceData.studentId"
      @closeStudentPieceDialogEvent="closeStudentPieceDialog"
      @updateStudentPieceSuccessEvent="
        closeStudentPieceDialog(), emits('refreshStudentPiecesEvent')
      "
      @disableStudentPieceEvent="
        closeStudentPieceDialog(), disableStudentPiece(studentpieceData)
      "
      @enableStudentPieceEvent="
        closeStudentPieceDialog(), enableStudentPiece(studentpieceData)
      "
    ></StudentPieceDialogBody>
  </v-dialog>
</template>
