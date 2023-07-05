<script setup>
import { ref } from "vue";
import PieceDataService from "../../../../services/PieceDataService";

import { compareTwoStrings } from "string-similarity";

const emits = defineEmits([
  "addPieceSuccessEvent",
  "closeAddPieceDialogEvent",
  "closePieceDialogEvent",
  "updatePieceSuccessEvent",
  "disablePieceEvent",
  "enablePieceEvent",
]);

const props = defineProps({
  isEdit: { type: [Boolean], required: true },
  pieceData: { type: [Object], required: true },
  piecesData: { type: [Array] },
  composersData: { type: [Array] },
});

const editedPieceData = ref(Object.assign({}, props.pieceData));
const form = ref(null);

//add Piece
async function addPiece() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await PieceDataService.create(editedPieceData.value)
        .then(async () => {
          emits("addPieceSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the piece's roles

async function updatePiece() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedPieceData.value["createdAt"];
      delete editedPieceData.value["updatedAt"];

      await PieceDataService.update(editedPieceData.value)
        .then(() => {
          emits("updatePieceSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
function findSimilar(piece) {
  const similarPieces = props.piecesData.filter((c) => {
    return (
      compareTwoStrings(c.title.toLowerCase(), piece.title.toLowerCase()) >=
      0.85
    );
  });
  return similarPieces;
}
function similarPieceCheck(piece) {
  if (props.isEdit == true || piece.title == null) {
    return true;
  }
  var similarPieces = findSimilar(piece);
  var similarPieceNames = "";
  similarPieces.forEach((c) => {
    similarPieceNames += c.title + ", ";
  });
  similarPieceNames = similarPieceNames.slice(0, -2);

  return similarPieces.length == 0
    ? true
    : "This are very simialr existing pieces: " + similarPieceNames;
}
</script>

<template>
  <v-form ref="form" validate-on="input">
    <v-card class="pa-2 flatCardBorder">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Piece
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ editedPieceData.title }}
            </v-card-title>
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ editedPieceData.composer.lastName }}
            </v-card-title>
          </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="pieceData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
            >
              {{ editedPieceData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row :class="props.isEdit ? '' : 'mt-2'">
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Title
          </v-card-subtitle>
          <v-text-field
            v-model="editedPieceData.title"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedPieceData.title || 'This field is required',
              similarPieceCheck(editedPieceData),
            ]"
          ></v-text-field>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Poetic Translation
          </v-card-subtitle>
          <v-textarea
            placeholder="description of level"
            autogrow
            rows="3"
            v-model="editedPieceData.poeticTranslation"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          ></v-textarea>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Literal Translation
          </v-card-subtitle>
          <v-textarea
            placeholder="description of level"
            autogrow
            rows="3"
            v-model="editedPieceData.literalTranslation"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          ></v-textarea>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Composer
          </v-card-subtitle>
          <v-autocomplete
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="editedPieceData.composerId"
            :items="composersData"
            item-title="lastName"
            item-value="id"
          >
            ></v-autocomplete
          >
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updatePiece() : addPiece()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closePieceDialogEvent')
              : emits('closeAddPieceDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.pieceData.status === 'Disabled' ? 'bg-darkBlue' : 'bg-maroon'
          "
          @click="
            props.pieceData.status === 'Disabled'
              ? emits('enablePieceEvent')
              : emits('disablePieceEvent')
          "
        >
          {{ props.pieceData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
