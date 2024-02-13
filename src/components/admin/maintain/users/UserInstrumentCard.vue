<script setup>
import { ref, onMounted } from "vue";
import UserInstrumentDialogBody from "./UserInstrumentDialogBody.vue";
import EvalDialogBody from "./EvalDialogBody.vue";
import StudentInstrumentDataService from "../../../../services/StudentInstrumentDataService.js";
import { useLoginStore } from "../../../../stores/LoginStore.js";

const emits = defineEmits(["refreshStudentInstrumentsEvent"]);

const addOrEditInstrumentDialog = ref(false);
const viewOrEditStudentInstrumentEval = ref(false);
const isInstructor = ref(false);
const loginStore = useLoginStore();

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
  isStudent: { type: [Boolean], required: true },
});
function closeUserInstrumentDialog() {
  addOrEditInstrumentDialog.value = false;
}

function setIsInstructor() {
  isInstructor.value =
    props.studentInstrumentData.instructorRole == loginStore.currentRole.roleId;
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

onMounted(async () => {
  setIsInstructor();
});
</script>

<template>
  <v-card class="bg-lightBlue pa-2 innerFlatCardBorder">
    <v-card-title class="font-weight-bold text-darkBlue pa-0 ma-0">
      <v-row class="">
        <v-col cols="auto">
          {{ props.studentInstrumentData.instrument.name }}
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">
          <v-chip
            v-if="studentInstrumentData.status === 'Active'"
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-teal mr-2"
          >
            Active
          </v-chip>
          <v-chip
            v-if="studentInstrumentData.status === 'Disabled'"
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-maroon mr-2"
          >
            Disabled
          </v-chip>
        </v-col>
      </v-row>
      <v-row class="pa-1">
        <v-col cols="auto" align-self="center">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-darkBlue mr-2"
          >
            {{ studentInstrumentData.semester.name }}
          </v-chip>
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
            v-if="studentInstrumentData.endingLevel"
            label
            flat
            size="small"
            class="font-weight-semi-bold text-none text-white flatChipBorder bg-darkBlue mr-2"
          >
            Ending Level: {{ studentInstrumentData.endingLevel.name }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pl-3">
      <v-row class="pa-0 ma-0">
        <v-col cols="5">
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

        <v-col cols="5" v-if="studentInstrumentData.accompanistRole">
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
      <v-row class="pa-0 ma-0">
        <v-spacer> </v-spacer>
        <v-col cols="auto">
          <v-btn
            flat
            size="small"
            class="mr-2 font-weight-semi-bold text-none text-white bg-blue flatChipBorder"
            @click="viewOrEditStudentInstrumentEval = true"
          >
            Eval
          </v-btn>
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
    </v-card-text>
  </v-card>
  <v-dialog v-model="addOrEditInstrumentDialog" persistent max-width="600px">
    <UserInstrumentDialogBody
      :is-edit="true"
      :is-student="props.isStudent"
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
  <v-dialog
    v-model="viewOrEditStudentInstrumentEval"
    persistent
    max-width="600px"
  >
    <EvalDialogBody
      :is-instructor="isInstructor"
      :student-instrument-data="studentInstrumentData"
      @closeEvalDialog="viewOrEditStudentInstrumentEval = false"
    ></EvalDialogBody>
  </v-dialog>
</template>
