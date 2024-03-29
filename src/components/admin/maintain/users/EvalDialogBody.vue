<script setup>
import { onBeforeMount, ref } from "vue";

import LevelDataService from "./../../../../services/LevelDataService.js";
import StudentInstrumentEvaluationDataService from "./../../../../services/StudentInstrumentEvaluationDataService.js";
import { useLoginStore } from "../../../../stores/LoginStore.js";

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
});

const tab = ref(1);
const loginStore = useLoginStore();
const isInstructor = ref(
  loginStore.currentRole.id === props.studentInstrumentData.instructorRoleId
    ? true
    : false
);
const isAdmin = ref(loginStore.currentRole.roleId === 3 ? true : false);

const emits = defineEmits(["closeEvalDialog"]);

const editedStudentInstrumentEvaluationData = ref(
  Object.assign({}, props.studentInstrumentData)
);
const form = ref(null);
const levelOptions = ref([]);
const isEdit = ref(true);

async function getEval() {
  await StudentInstrumentEvaluationDataService.getByStudentInstrumentId(
    props.studentInstrumentData.id
  )
    .then((results) => {
      if (results.data.length === 0) {
        isEdit.value = false;
        editedStudentInstrumentEvaluationData.value = {
          id: null,
          type: "Eval",
          courseName: "Private lessons",
          comments: " ",
          semesterId: props.studentInstrumentData.semesterId,
          studentInstrumentId: props.studentInstrumentData.id,
          instructorRoleId: props.studentInstrumentData.instructorRoleId,
          beginningGreatestStrengths: "",
          beginningTargetedImprovement: "",
          beginningPerformanceLevelGoal: null,
          intermediateGreatestStrengths: "",
          intermediateTargetedImprovement: "",
          intermediatePerformanceLevelGoal: null,
          advancedGreatestStrengths: "",
          advancedTargetedImprovement: "",
          advancedPerformanceLevelGoal: null,
          expertGreatestStrengths: "",
          expertTargetedImprovement: "",
          expertPerformanceLevelGoal: null,
        };
      } else {
        editedStudentInstrumentEvaluationData.value = results.data[0];
      }
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateEval() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await StudentInstrumentEvaluationDataService.update(
        editedStudentInstrumentEvaluationData.value
      )
        .then(() => {
          emits("closeEvalDialog");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
async function addEval() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await StudentInstrumentEvaluationDataService.create(
        editedStudentInstrumentEvaluationData.value
      )
        .then(() => {
          emits("closeEvalDialog");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
async function getLevels() {
  await LevelDataService.getAll()
    .then((response) => {
      levelOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
onBeforeMount(async () => {
  await getLevels();
  await getEval();
});
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-title>
        <v-row class="pt-0 mt-0 text-maroon font-weight-bold text-h4">
          Edit Evaluation
        </v-row>
        <v-row class="pt-0 mt-2 text-maroon text-h6">
          {{ props.studentInstrumentData.instrument.name }}
          {{ props.studentInstrumentData.semester.name }}
        </v-row>
      </v-card-title>
      <v-tabs v-model="tab" color="maroon-accent-4" align-tabs="center">
        <v-tab :value="1">Beginning</v-tab>
        <v-tab :value="2">Mid-Term</v-tab>
        <v-tab :value="3">Final</v-tab>
      </v-tabs>
      <v-window v-model="tab">
        <v-window-item :key="1" :value="1">
          <v-row class="mt-2">
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Beginning Greatest Strengths
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.beginningGreatestStrengths
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Beginning Targeted Improvement
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.beginningTargetedImprovement
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Beginning Performance Level Goal
              </v-card-subtitle>
              <v-select
                :readonly="!isInstructor && !isAdmin"
                color="darkBlue"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
                v-model="
                  editedStudentInstrumentEvaluationData.beginningPerformanceLevelGoal
                "
                :items="levelOptions"
                :item-title="(item) => item.name"
                item-value="name"
                :rules="[(v) => !!v || 'This field is required']"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item :key="2" :value="2">
          <v-row class="mt-2">
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Mid-Term Attendance
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.midtermAttendance
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Mid-Term Preparation
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.midtermPreparation
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Mid-Term Goal Progress
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.midtermGoalProgress
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Mid-Term Attitude
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="editedStudentInstrumentEvaluationData.midtermAttitude"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Mid-term Grade
              </v-card-subtitle>
              <v-select
                :readonly="!isInstructor && !isAdmin"
                color="darkBlue"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
                v-model="editedStudentInstrumentEvaluationData.midtermGrade"
                :items="['A', 'B', 'C', 'D', 'F']"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-window-item>

        <v-window-item :key="3" :value="3">
          <v-row class="mt-2">
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Final Attendance
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="editedStudentInstrumentEvaluationData.finalAttendance"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Final Preparation
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="editedStudentInstrumentEvaluationData.finalPreparation"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Final Goal Progress
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="
                  editedStudentInstrumentEvaluationData.finalGoalProgress
                "
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Final Attitude
              </v-card-subtitle>
              <v-text-field
                :readonly="!isInstructor && !isAdmin"
                v-model="editedStudentInstrumentEvaluationData.finalAttitude"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
              ></v-text-field>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Final Grade
              </v-card-subtitle>
              <v-select
                :readonly="!isInstructor && !isAdmin"
                color="darkBlue"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-2"
                v-model="editedStudentInstrumentEvaluationData.finalGrade"
                :items="['A', 'B', 'C', 'D', 'F']"
              >
              </v-select>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="isInstructor || isAdmin"
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="isEdit ? updateEval() : addEval()"
        >
          Save
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          @click="emits('closeEvalDialog')"
        >
          {{ !isInstructor ? "Close" : "Cancel" }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
