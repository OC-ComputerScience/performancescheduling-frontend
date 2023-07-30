<script setup>
import { ref, onMounted } from "vue";
import StudentPieceDataService from "./../../../services/StudentPieceDataService";
import ComposerDataService from "./../../../services/ComposerDataService";
import SemesterDataService from "./../../../services/SemesterDataService";
import PieceDataService from "./../../../services/PieceDataService";
import StudentInstrumentDataService from "./../../../services/StudentInstrumentDataService";
import { useLoginStore } from "./../../../stores/LoginStore.js";
import PieceDialogBody from "./../../admin/maintain/pieces/PieceDialogBody.vue";

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
  studentPieces: { type: [Array], required: true },
});
const loginStore = useLoginStore();
const editedStudentPieceData = ref(Object.assign({}, props.studentpieceData));
const form = ref(null);
const pieces = ref([]);
const semesters = ref([]);
const studentInstruments = ref([]);
const composers = ref([]);
const composerId = ref(null);
const filteredPieces = ref([]);
const createOrEditPieceDialog = ref(false);

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
        .then(async () => {
          emits("updateStudentPieceSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
async function getSemesters() {
  await SemesterDataService.getAll("name")
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getPieces() {
  await PieceDataService.getAll("title", "ASC")
    .then((response) => {
      pieces.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getComposers() {
  await ComposerDataService.getAll("lastName")
    .then((response) => {
      composers.value = response.data;
      composers.value.forEach((composer) => {
        composer.fullName = composerName(composer);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function filterPieces() {
  filteredPieces.value = pieces.value.filter((piece) => {
    return piece.composerId === composerId.value;
  });
}

async function getStudentInstrument() {
  await StudentInstrumentDataService.getStudentInstrumentsForStudentId(
    loginStore.currentRole.id
  )
    .then((response) => {
      studentInstruments.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function closePieceDialog() {
  createOrEditPieceDialog.value = false;
}
async function updatePieceSuccess() {
  createOrEditPieceDialog.value = false;
  await PieceDataService.get(editedStudentPieceData.value.piece.id)
    .then((response) => {
      editedStudentPieceData.value.piece.literalTranslation =
        response.data.literalTranslation;
      editedStudentPieceData.value.piece.poeticTranslation =
        response.data.poeticTranslation;

      editedStudentPieceData.value.piece.title = response.data.title;
    })
    .catch((err) => {
      console.log(err);
    });
}

function setPiece(id) {
  editedStudentPieceData.value.piece = pieces.value.find((piece) => {
    return piece.id === id;
  });
}

function checkDuplicateStudentPiece() {
  console.log(editedStudentPieceData.value);
  console.log(props.studentPieces);
  const duplicatePiece = props.studentPieces.find((piece) => {
    return (
      piece.pieceId === editedStudentPieceData.value.pieceId &&
      piece.semesterId === editedStudentPieceData.value.semesterId &&
      piece.studentInstrumentId ===
        editedStudentPieceData.value.studentInstrumentId
    );
  });
  console.log(duplicatePiece);
  return duplicatePiece == null
    ? true
    : "This is piece, instrument and semester already exist for this student pieces";
}

function composerName(composer) {
  let comma = ", ";
  if (
    composer.firstName === null ||
    composer.firstName === "" ||
    composer.lastName === "" ||
    composer.lastName == ""
  ) {
    comma = "";
  }
  return composer.lastName + comma + composer.firstName;
}

onMounted(async () => {
  getSemesters();
  getPieces();
  getComposers();
  getStudentInstrument(loginStore.currentRole.id);
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
          <v-spacer></v-spacer>
          <v-col v-if="props.isEdit" cols="auto" class="pt-0 mt-0">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold text-none text-white flatChipBorder"
              :class="
                editedStudentPieceData.status === 'Active'
                  ? 'bg-teal'
                  : 'bg-maroon'
              "
            >
              {{ editedStudentPieceData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>

      <v-row :class="props.isEdit ? '' : 'mt-2'">
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Composer
          </v-card-subtitle>
          <v-text-field
            v-if="props.isEdit"
            v-model="editedStudentPieceData.piece.composer.lastName"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
          ></v-text-field>

          <v-autocomplete
            v-if="!props.isEdit"
            placeholder="First start typing the composer's last name"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="composerId"
            :items="composers"
            item-title="fullName"
            item-value="id"
            @change="filterPieces"
          >
            <template v-slot:item="{ item, props: { onClick } }">
              <v-list-item
                v-if="
                  item.raw.firstName != null &&
                  item.raw.firstName.length != 0 &&
                  item.raw.lastName != null &&
                  item.raw.lastName.length != 0
                "
                @click="onClick"
              >
                {{ item.raw.lastName }}, {{ item.raw.firstName }}
              </v-list-item>
              <v-list-item
                v-else-if="
                  item.raw.lastname == null || item.raw.lastname.length == 0
                "
                @click="onClick"
              >
                {{ item.raw.firstName }}
              </v-list-item>
              <v-list-item
                v-else-if="
                  item.raw.lastName == null || item.raw.lastName.length == 0
                "
                @click="onClick"
              >
                {{ item.raw.lastName }}
              </v-list-item>
            </template>
          </v-autocomplete>
          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >Piece
          </v-card-subtitle>
          <v-text-field
            v-if="props.isEdit"
            v-model="editedStudentPieceData.piece.title"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
            :rules="[checkDuplicateStudentPiece()]"
          ></v-text-field>
          <v-select
            v-if="!props.isEdit"
            placeholder="Select a Compoers then select from the list of pieces"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="editedStudentPieceData.pieceId"
            :items="filteredPieces"
            item-title="title"
            item-value="id"
            @update:modelValue="setPiece(editedStudentPieceData.pieceId)"
            :rules="[checkDuplicateStudentPiece()]"
          >
          </v-select>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Semester
          </v-card-subtitle>
          <v-select
            v-model="editedStudentPieceData.semesterId"
            :items="semesters"
            item-title="name"
            item-value="id"
            variant="plain"
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
            v-model="editedStudentPieceData.studentInstrumentId"
            :items="studentInstruments"
            item-title="instrument.name"
            item-value="id"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedStudentPieceData.studentInstrumentId ||
                'This field is required',
            ]"
          ></v-select>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="createOrEditPieceDialog = true"
        >
          Edit Piece
        </v-btn>
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
  <v-dialog v-model="createOrEditPieceDialog" persistent max-width="600px">
    <PieceDialogBody
      :is-edit="true"
      :is-admin="false"
      :piece-data="editedStudentPieceData.piece"
      @closePieceDialogEvent="closePieceDialog"
      @updatePieceSuccessEvent="closePieceDialog, updatePieceSuccess()"
    ></PieceDialogBody>
  </v-dialog>
</template>
