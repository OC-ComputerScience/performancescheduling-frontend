<script setup>
import { ref, onMounted } from "vue";
import StudentPieceDataService from "./../../../services/StudentPieceDataService";
import SemesterDataService from "./../../../services/SemesterDataService";
import PieceDataService from "./../../../services/PieceDataService";
import StudentInsturmentDataService from "./../../../services/StudentInstrumentDataService";
import { useLoginStore } from "./../../../stores/LoginStore.js";

const emits = defineEmits([
  "addStudentPieceSuccessEvent",
  "closeAddStudentPieceDialogEvent",
  "closeStudentPieceDialogEvent",
  "updateStudentPieceSuccessEvent",
  "disableStudentPieceEvent",
  "enableStudentPieceEvent",
]);

const props = defineProps({
  isEdit: { type: [Boolean], required: true },
  studentpieceData: { type: [Object], required: true },
});
const loginStore = useLoginStore();
const editedStudentPieceData = ref(Object.assign({}, props.studentpieceData));
const form = ref(null);
const pieces = ref([]);
const semesters = ref([]);
const studentInstruments = ref([]);

//add StudentPiece
async function addStudentPiece() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await StudentPieceDataService.create(editedStudentPieceData.value)
        .then(async () => {
          emits("addStudentPieceSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the studentpiece's roles

async function updateStudentPiece() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await StudentPieceDataService.update(editedStudentPieceData.value)
        .then(() => {
          emits("updateStudentPieceSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
async function getSemesters() {
  await SemesterDataService.getAll("name", false)
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getPieces() {
  await PieceDataService.getAll("title", false)
    .then((response) => {
      pieces.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getStudentInsrument(studentRoleId) {
  await StudentInsturmentDataService.getStudentInstrumentsForStudentId(
    studentRoleId
  )
    .then((response) => {
      studentInstruments.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  getSemesters();
  getPieces();
  getStudentInsrument(loginStore.currentRole.id);
});
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Repertiore Piece
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center"> </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="
                studentpieceData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ editedStudentPieceData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row :class="props.isEdit ? '' : 'mt-2'">
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Semester
          </v-card-subtitle>
          <v-select
            v-model="editedStudentPieceData.semesterId"
            :items="semesters"
            item-title="name"
            variant="plain"
            return-object
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedStudentPieceData.semesterId || 'This field is required',
            ]"
          ></v-select>

          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >Instrument
          </v-card-subtitle>
          <v-select
            v-model="editedStudentPieceData.studentIntstrumentId"
            :items="studentInstruments"
            item-title="instrument.name"
            item-value="id"
            variant="plain"
            return-object
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedStudentPieceData.studentIntstrumentId ||
                'This field is required',
            ]"
          ></v-select>

          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >Piece
          </v-card-subtitle>
          <v-select
            placeholder="Start typing the piece title"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="editedStudentPieceData.pieceId"
            :items="pieces"
            item-title="title"
            item-value="id"
          >
          </v-select>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateStudentPiece() : addStudentPiece()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeStudentPieceDialogEvent')
              : emits('closeAddStudentPieceDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.studentpieceData.status === 'Disabled'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="
            props.studentpieceData.status === 'Disabled'
              ? emits('enableStudentPieceEvent')
              : emits('disableStudentPieceEvent')
          "
        >
          {{
            props.studentpieceData.status === "Disabled" ? "Enable" : "Disable"
          }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
