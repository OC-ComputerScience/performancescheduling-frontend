<script setup>
import { onBeforeMount, ref, watch } from "vue";
import StudentPieceDataService from "./../../../services/StudentPieceDataService";
import ComposerDataService from "./../../../services/ComposerDataService";
import SemesterDataService from "./../../../services/SemesterDataService";
import PieceDataService from "./../../../services/PieceDataService";
import StudentInstrumentDataService from "./../../../services/StudentInstrumentDataService";
import { useLoginStore } from "./../../../stores/LoginStore.js";
import PieceDialogBody from "./../../admin/maintain/pieces/PieceDialogBody.vue";
import ComposerDialogBody from "./../../admin/maintain/composers/ComposerDialogBody.vue";

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
  studentRoleId: { type: [Number], required: true },
});

const loginStore = useLoginStore();
const editedStudentPieceData = ref(Object.assign({}, props.studentpieceData));

let addForSemester = false;

const form = ref(null);
const pieces = ref([]);
const semesters = ref([]);
const studentInstruments = ref([]);
const composers = ref([]);
const composerId = ref(null);
const filteredPieces = ref([]);
const editPieceDialog = ref(false);
const createPieceDialog = ref(false);
const addComposerDialog = ref(false);
const editedPoeticTranslation = ref("");
const editedLiteralTranslation = ref("");
const currentPiece = ref(null);

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
  await SemesterDataService.getAll("startDate", "ASC")
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
      pieces.value = response.data.filter(
        (piece) => piece.status === "Active" || piece.status == "Pending"
      );
      pieces.value.forEach((piece) => {
        let movementAddl = piece.movement != null ? " " + piece.movement : "";
        let workAddl = piece.work != null ? " " + piece.work : "";
        piece.titleAddl = piece.title + movementAddl + workAddl;
      });
      if (composerId.value != null) filterPieces();
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getPiece(id) {
  await PieceDataService.get(id)
    .then((response) => {
      currentPiece.value = response.data;
      let movementAddl =
        currentPiece.value.movement != null
          ? " (" + currentPiece.value.movement + ")"
          : "";
      let workAddl =
        currentPiece.value.work != null
          ? " ( from " + currentPiece.value.work + ")"
          : "";
      currentPiece.value.titleAddl =
        currentPiece.value.title + movementAddl + workAddl;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getComposers() {
  await ComposerDataService.getAll("lastName")
    .then((response) => {
      composers.value = response.data.filter(
        (composer) =>
          composer.status === "Active" || composer.status == "Pending"
      );
      composers.value.forEach((composer) => {
        composer.fullName = composerName(composer);
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

function filterPieces() {
  //editedStudentPieceData.value.pieceId = null;
  filteredPieces.value = pieces.value.filter((piece) => {
    return piece.composerId === composerId.value;
  });
}

async function getStudentInstruments() {
  await StudentInstrumentDataService.getStudentInstrumentsForStudentId(
    props.studentRoleId,
    "All"
  )
    .then((response) => {
      studentInstruments.value = response.data;
      if (addForSemester)
        studentInstruments.value = response.data.filter((studentInstrument) => {
          return studentInstrument.status === "Active";
        });
    })
    .catch((err) => {
      console.log(err);
    });
}

function isVocal() {
  if (
    editedStudentPieceData.value.studentInstrumentId != null &&
    studentInstruments.value.length > 0
  ) {
    let studentInstrument = studentInstruments.value.find(
      (studentInstrument) => {
        return (
          studentInstrument.id ===
          editedStudentPieceData.value.studentInstrumentId
        );
      }
    );

    if (studentInstrument.instrument.type == "Vocal") return true;
  }
  return false;
}

function closePieceDialog() {
  editPieceDialog.value = false;
  createPieceDialog.value = false;
}
async function updatePieceSuccess() {
  editPieceDialog.value = false;
  createPieceDialog.value = false;
  await PieceDataService.get(editedStudentPieceData.value.piece.id)
    .then((response) => {
      editedStudentPieceData.value.piece.literalTranslation =
        response.data.literalTranslation;
      editedStudentPieceData.value.piece.poeticTranslation =
        response.data.poeticTranslation;

      editedStudentPieceData.value.piece.title = response.data.title;
      editedPoeticTranslation.value = response.data.poeticTranslation;
      editedLiteralTranslation.value = response.data.literalTranslation;
      let movementAddl =
        response.data.movement != null
          ? " (" + response.data.movement + ")"
          : "";
      let workAddl =
        response.data.work != null ? " ( from " + response.data.work + ")" : "";
      editedStudentPieceData.value.piece.titleAddl =
        response.data.title + movementAddl + workAddl;
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
  let pieceList = props.studentPieces;
  if (props.isEdit) {
    pieceList = pieceList.filter((piece) => {
      return piece.id !== editedStudentPieceData.value.id;
    });
  }
  const duplicatePiece = pieceList.find((piece) => {
    return (
      piece.pieceId === editedStudentPieceData.value.pieceId &&
      piece.semesterId === editedStudentPieceData.value.semesterId &&
      piece.studentInstrumentId ===
        editedStudentPieceData.value.studentInstrumentId
    );
  });

  return duplicatePiece == null
    ? true
    : "This is piece, instrument and semester already exist for this student pieces";
}

function composerName(composer) {
  let comma = " ";
  if (composer.firstName === "" || composer.firstName == null) {
    comma = "";
    composer.firstName = "";
  }
  if (composer.lastName === "" || composer.lastName == null) {
    comma = "";
    composer.lastName = "";
  }
  return composer.firstName + comma + composer.lastName;
}
watch(
  () => editedStudentPieceData.value.pieceId,
  () => {
    if (editedStudentPieceData.value.pieceId != null) {
      let newPiece = pieces.value.find((piece) => {
        return piece.id === editedStudentPieceData.value.pieceId;
      });
      editedPoeticTranslation.value = newPiece.poeticTranslation;
      editedLiteralTranslation.value = newPiece.literalTranslation;
      if (editedPoeticTranslation.value == null) {
        editedPoeticTranslation.value =
          "Please edit piece and update poetic translation";
      }
      if (editedLiteralTranslation.value == null) {
        editedLiteralTranslation.value =
          "Please edit piece and update literal translation";
      }
    }
  }
);

onBeforeMount(async () => {
  await getSemesters();
  if (!props.isEdit) await getPieces();
  await getComposers();

  if (!props.isEdit && editedStudentPieceData.value.semesterId == null) {
    editedStudentPieceData.value.semesterId = semesters.value[0].id;
    editedStudentPieceData.value.piece = {};
    editedStudentPieceData.value.piece.composer = null;
  }
  if (props.isEdit) {
    await getPiece(editedStudentPieceData.value.pieceId);
    editedPoeticTranslation.value = currentPiece.value.poeticTranslation;
    editedLiteralTranslation.value = currentPiece.value.literalTranslation;

    editedStudentPieceData.value.piece.composer.fullName = composerName(
      composers.value.find((composer) => {
        return composer.id === currentPiece.value.composerId;
      })
    );
    let movementAddl =
      editedStudentPieceData.value.piece.movement != null
        ? " (" + editedStudentPieceData.value.piece.movement + ")"
        : "";
    let workAddl =
      editedStudentPieceData.value.piece.work != null
        ? " ( from " + editedStudentPieceData.value.piece.work + ")"
        : "";
    editedStudentPieceData.value.piece.titleAddl =
      editedStudentPieceData.value.piece.title + movementAddl + workAddl;
  }
  if (!props.isEdit) {
    if (editedStudentPieceData.value.semesterId != null) addForSemester = true;
  }
  await getStudentInstruments(loginStore.currentRole.id);
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
            {{ props.isEdit ? "Edit" : "Add" }} Repertoire Piece
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
          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >Instrument
          </v-card-subtitle>
          <v-select
            v-model="editedStudentPieceData.studentInstrumentId"
            placeholder="Select an instrument"
            :items="studentInstruments"
            item-title="instrument.name"
            item-value="id"
            variant="plain"
            :readonly="addForSemester ? false : true"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedStudentPieceData.studentInstrumentId ||
                'This field is required',
            ]"
          ></v-select>
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
            :readonly="addForSemester ? true : false"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedStudentPieceData.semesterId || 'This field is required',
            ]"
          ></v-select>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Composer
          </v-card-subtitle>
          <v-text-field
            v-if="props.isEdit"
            v-model="editedStudentPieceData.piece.composer.fullName"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
          ></v-text-field>

          <v-autocomplete
            v-if="!props.isEdit"
            placeholder="Start typing the composer's name then select a composer"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="composerId"
            :items="composers"
            item-title="fullName"
            item-value="id"
            @update:modelValue="filterPieces"
          >
          </v-autocomplete>
          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >Piece
          </v-card-subtitle>
          <v-text-field
            v-if="props.isEdit"
            v-model="editedStudentPieceData.piece.titleAddl"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
            :rules="[checkDuplicateStudentPiece()]"
          ></v-text-field>
          <v-autocomplete
            v-if="!props.isEdit"
            placeholder="Select piece for the Composer above"
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="editedStudentPieceData.pieceId"
            :items="filteredPieces"
            item-title="titleAddl"
            item-value="id"
            @update:modelValue="setPiece(editedStudentPieceData.pieceId)"
            :rules="[checkDuplicateStudentPiece()]"
          >
          </v-autocomplete>

          <v-card-subtitle
            v-if="isVocal()"
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Poetic Translation
          </v-card-subtitle>
          <v-text-field
            v-if="isVocal()"
            v-model="editedPoeticTranslation"
            placeholder="Please edit piece and update poetic translation"
            variant="plain"
            class="text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
          >
          </v-text-field>
          <v-card-subtitle
            v-if="isVocal()"
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Literal Translation
          </v-card-subtitle>
          <v-text-field
            v-if="isVocal()"
            v-model="editedLiteralTranslation"
            placeholder="Please edit piece and update literal translation"
            variant="plain"
            class="text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            readonly
          >
          </v-text-field>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="!props.isEdit"
          flat
          color="blue"
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-blue flatChipBorder"
          @click="createPieceDialog = true"
        >
          Add Piece
        </v-btn>
        <v-btn
          flat
          color="blue"
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          @click="editPieceDialog = true"
        >
          Edit Piece
        </v-btn>
        <v-btn
          flat
          v-if="!props.isEdit"
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          @click="addComposerDialog = true"
        >
          Add Composer
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
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateStudentPiece() : addStudentPiece()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeStudentPieceDialogEvent')
              : emits('closeAddStudentPieceDialogEvent')
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-dialog v-model="editPieceDialog" persistent max-width="600px">
    <PieceDialogBody
      :is-edit="true"
      :is-admin="false"
      :piece-data="editedStudentPieceData.piece"
      :pieces-data="pieces"
      @closePieceDialogEvent="closePieceDialog"
      @updatePieceSuccessEvent="closePieceDialog, updatePieceSuccess()"
    ></PieceDialogBody>
  </v-dialog>
  <v-dialog v-model="createPieceDialog" persistent max-width="600px">
    <PieceDialogBody
      :is-edit="false"
      :is-admin="true"
      :piece-data="{
        id: null,
        title: null,
        originalLanguage: null,
        poeticTranslation: null,
        literalTranslation: null,
        status: 'Pending',
      }"
      :pieces-data="pieces"
      @closeAddPieceDialogEvent="createPieceDialog = false"
      @addPieceSuccessEvent="(createPieceDialog = false), getPieces()"
    ></PieceDialogBody>
  </v-dialog>
  <v-dialog v-model="addComposerDialog" persistent max-width="600px">
    <ComposerDialogBody
      :is-edit="false"
      :is-admin="false"
      :composer-data="{
        id: null,
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        dateOfDeath: null,
        nationality: null,
        status: 'Pending',
      }"
      :composers-data="composers"
      @closeAddComposerDialogEvent="addComposerDialog = false"
      @addComposerSuccessEvent="(addComposerDialog = false), getComposers()"
    ></ComposerDialogBody>
  </v-dialog>
</template>
