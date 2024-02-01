<script setup>
import { ref, watch } from "vue";
import PieceDataService from "../../../../services/PieceDataService";
import ComposerDataService from "../../../../services/ComposerDataService";
import EventSignupPieceDataService from "../../../../services/EventSignupPieceDataService";
import StudentPieceDataService from "../../../../services/StudentPieceDataService";

const emits = defineEmits(["closeDupPieceDialogEvent"]);

const props = defineProps({
  piecesData: { type: [Array] },
});

const composers = ref([]);
const selectedComposer = ref(null);
const filteredPieces = ref([]);
const signupPieces = ref([]);
const studentPieces = ref([]);

getComposers();

async function mergePieces() {
  // select firrst piece Id
  var firstPieceId = filteredPieces.value.find((piece) => piece.selected).id;
  // reaassng all studentPieces to first piece
  for (let i = 0; i < filteredPieces.value.length; i++) {
    if (
      filteredPieces.value[i].selected &&
      filteredPieces.value[i].id != firstPieceId
    ) {
      await reassignStudentPieces(filteredPieces.value[i].id, firstPieceId);
    }
  }
  //reassing all signupPieces to first piece
  for (let i = 0; i < filteredPieces.value.length; i++) {
    if (
      filteredPieces.value[i].selected &&
      filteredPieces.value[i].id != firstPieceId
    ) {
      await reassignSignupPieces(filteredPieces.value[i].id, firstPieceId);
    }
  }

  // delete all other pieces

  for (let i = 0; i < filteredPieces.value.length; i++) {
    if (
      filteredPieces.value[i].selected &&
      filteredPieces.value[i].id != firstPieceId
    ) {
      await PieceDataService.remove(filteredPieces.value[i].id)
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }
  }

  emits("closeDupPieceDialogEvent");
}
async function reassignSignupPieces(fromPieceId, toPieceId) {
  // get all signupPieces for fromPieceId
  await EventSignupPieceDataService.getAllByPieceId(fromPieceId)
    .then((response) => {
      signupPieces.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  // update all signupPieces to toPieceId
  signupPieces.value.forEach(async (signupPiece) => {
    signupPiece.pieceId = toPieceId;
    await EventSignupPieceDataService.update(signupPiece)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  });
}

async function reassignStudentPieces(fromPieceId, toPieceId) {
  // get all studentPieces for fromPieceId
  await StudentPieceDataService.getAllByPieceId(fromPieceId)
    .then((response) => {
      studentPieces.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  // update all studentPieces to toPieceId
  studentPieces.value.forEach(async (studentPiece) => {
    studentPiece.pieceId = toPieceId;
    await StudentPieceDataService.update(studentPiece)
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
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
// Update the piece's roles

function filterPieces() {
  filteredPieces.value = props.piecesData.filter(
    (piece) => piece.composerId === selectedComposer.value
  );
}

watch(selectedComposer, () => {
  filterPieces();
});
</script>

<template>
  <v-card class="my-4 mx-4 pa-2 flatCardBorder">
    <v-card-title class="pt-0 mt-0 text-maroon font-weight-bold text-h4">
      Merge Duplicate Pieces
    </v-card-title>

    <v-row>
      <v-card-subtitle
        class="pl-4 pb-2 mt-4 font-weight-semi-bold text-darkBlue text-h6"
      >
        Select Composer
      </v-card-subtitle>
    </v-row>
    <v-row>
      <v-autocomplete
        placeholder="Start typing the composer's last name"
        color="darkBlue"
        variant="plain"
        class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mx-4 mb-4"
        v-model="selectedComposer"
        :items="composers"
        item-title="fullName"
        item-value="id"
      >
      </v-autocomplete>
    </v-row>
    <v-row>
      <v-card-subtitle
        class="pl-4 pb-2 mt-2 font-weight-semi-bold text-darkBlue text-h6"
      >
        Check Pieces to Merge
      </v-card-subtitle>
    </v-row>
    <v-row v-for="piece in filteredPieces" :key="piece.id" clase=" mx-0">
      <v-card class="flatCardBorder mx-0 px-0">
        <v-row>
          <v-col class="mr-0">
            <v-checkbox
              v-model="piece.selected"
              color="darkBlue"
              class="pt-0 mx-0 my-0 px-0 pl-2"
            ></v-checkbox>
          </v-col>
          <v-col>
            <v-card-subtitle class="text-darkblue pt-5 pl-0">
              {{ piece.title }}
            </v-card-subtitle>
          </v-col>
        </v-row>
      </v-card>
    </v-row>
    <v-card-actions>
      <v-spacer />
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-blue flatChipBorder"
        @click="mergePieces()"
      >
        Merge Duplicates
      </v-btn>

      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
        :class="props.isEdit ? '' : 'mr-auto'"
        @click="emits('closeDupPieceDialogEvent')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
