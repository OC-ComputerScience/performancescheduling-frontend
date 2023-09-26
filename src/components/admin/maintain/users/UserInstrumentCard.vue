<script setup>
import { ref, onMounted } from "vue";
import UserInstrumentDialogBody from "./UserInstrumentDialogBody.vue";
import StudentInstrumentDataService from "../../../../services/StudentInstrumentDataService.js";

const emits = defineEmits(["refreshStudentInstrumentsEvent"]);

const addOrEditInstrumentDialog = ref(false);

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
});

function closeUserInstrumentDialog() {
  addOrEditInstrumentDialog.value = false;
}

async function disableStudentInstrument(studentInstrument) {
  studentInstrument.status = "Disabled";
  await StudentInstrumentDataService.update(studentInstrument)
    .then(() => {
      emits("refreshStudentInstrumentsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableStudentInstrument(studentInstrument) {
  studentInstrument.status = "Active";
  await StudentInstrumentDataService.update(studentInstrument)
    .then(() => {
      emits("refreshStudentInstrumentsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {});
</script>

<template>
  <v-card class="bg-lightBlue pa-2 innerFlatCardBorder mb-4">
    <v-card-subtitle class="font-weight-bold text-darkBlue pa-0 ma-0">
      <v-row class="pa-0 ma-0">
        <v-col cols="auto" align-self="center">
          {{ props.studentInstrumentData.instrument.name }}
        </v-col>
        <v-col cols="auto" align-self="center">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-darkBlue mr-2"
          >
            Hours: {{ studentInstrumentData.privateHours }}
          </v-chip>
          <v-chip
            v-if="studentInstrumentData.level"
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-darkBlue mr-2"
          >
            Level: {{ studentInstrumentData.level.name }}
          </v-chip>
          <v-chip
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder"
            :class="
              studentInstrumentData.status === 'Active'
                ? 'bg-teal'
                : 'bg-maroon'
            "
          >
            {{ studentInstrumentData.status }}
          </v-chip>
        </v-col>
        <v-spacer> </v-spacer>
        <v-col cols="auto" align-self="center">
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white bg-blue flatChipBorder"
            @click="addOrEditInstrumentDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text class="pl-3">
      <v-row class="pa-0 ma-0">
        <v-col cols="6" class="pa-0 ma-0">
          <v-card-subtitle
            class="pa-0 ma-0 font-weight-semi-bold text-darkBlue"
          >
            Instructor
          </v-card-subtitle>
          <v-card-text class="pa-0 ma-0 font-weight-medium text-blue">
            {{
              studentInstrumentData.instructorRole.user.firstName +
              " " +
              studentInstrumentData.instructorRole.user.lastName
            }}
          </v-card-text>
        </v-col>

        <v-col
          cols="6"
          class="pa-0 ma-0"
          v-if="studentInstrumentData.accompanistRole"
        >
          <v-card-subtitle
            class="pa-0 ma-0 font-weight-semi-bold text-darkBlue"
          >
            Accompanist
          </v-card-subtitle>
          <v-card-text class="pa-0 ma-0 font-weight-medium text-blue">
            {{
              studentInstrumentData.accompanistRole.user.firstName +
              " " +
              studentInstrumentData.accompanistRole.user.lastName
            }}
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="addOrEditInstrumentDialog" persistent max-width="600px">
    <UserInstrumentDialogBody
      :is-edit="true"
      :student-instrument-data="studentInstrumentData"
      @updateInstrumentSuccessEvent="
        closeUserInstrumentDialog(), emits('refreshStudentInstrumentsEvent')
      "
      @closeUserInstrumentDialogEvent="closeUserInstrumentDialog"
      @disableStudentInstrumentEvent="
        closeUserInstrumentDialog(),
          disableStudentInstrument(studentInstrumentData)
      "
      @enableStudentInstrumentEvent="
        closeUserInstrumentDialog(),
          enableStudentInstrument(studentInstrumentData)
      "
    ></UserInstrumentDialogBody>
  </v-dialog>
</template>
