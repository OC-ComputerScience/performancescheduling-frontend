<script setup>
import { ref } from "vue";
import PieceDialogBody from "./PieceDialogBody.vue";
import PieceDataService from "../../../../services/PieceDataService.js";

const emits = defineEmits(["closePieceDialog", "refreshPiecesEvent"]);

defineProps({
  pieceData: { type: [Object], required: true },
  piecesData: { type: [Array] },
  composersData: { type: [Array] },
});

const createOrEditDialog = ref(false);

function closePieceDialog() {
  createOrEditDialog.value = false;
}

async function disablePiece(piece) {
  piece.status = "Disabled";
  await PieceDataService.update(piece)
    .then(() => {
      emits("refreshPiecesEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enablePiece(piece) {
  piece.status = "Active";
  await PieceDataService.update(piece)
    .then(() => {
      emits("refreshPiecesEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="7" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ pieceData.title }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold w-75">
            {{ pieceData.composer.lastName }},
            {{ pieceData.composer.firstName }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="pieceData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ pieceData.status }}
          </v-chip>
          <v-btn
            flat
            size="small"
            class="font-weight-bold mt-0 ml-4 text-none text-blue bg-white flatChipBorder"
            @click="createOrEditDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
      <PieceDialogBody
        :is-edit="true"
        :piece-data="pieceData"
        :pieces-data="piecesData"
        :composers-data="composersData"
        @closePieceDialogEvent="closePieceDialog"
        @updatePieceSuccessEvent="
          closePieceDialog(), emits('refreshPiecesEvent')
        "
        @disablePieceEvent="closePieceDialog(), disablePiece(pieceData)"
        @enablePieceEvent="closePieceDialog(), enablePiece(pieceData)"
      ></PieceDialogBody>
    </v-dialog>
  </v-card>
</template>
