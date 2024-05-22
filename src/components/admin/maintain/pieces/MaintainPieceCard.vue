<script setup>
import { ref } from "vue";
import PieceDialogBody from "./PieceDialogBody.vue";
import PieceDataService from "../../../../services/PieceDataService.js";
import { useLoginStore } from "../../../../stores/LoginStore.js";

const loginStore = useLoginStore();
const isAdmin = ref(loginStore.currentRole.roleId === 3 ? true : false);

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
        <v-col cols="6" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ pieceData.title }}
          </v-card-subtitle>
          <v-card-text
            v-if="pieceData.movement"
            class="text-weight-semi-bold font-italic pt-1 pb-0"
          >
            {{ pieceData.movement }}
          </v-card-text>
          <v-card-text
            v-if="pieceData.work"
            class="text-weight-semi-bold font-italic pt-1 pb-0"
          >
            from {{ pieceData.work }}
          </v-card-text>

          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
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
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 mr-2 text-none text-white bg-blue flatChipBorder"
        @click="createOrEditDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <PieceDialogBody
      :is-edit="true"
      :is-admin="isAdmin"
      :piece-data="pieceData"
      :pieces-data="piecesData"
      :composers-data="composersData"
      @closePieceDialogEvent="closePieceDialog"
      @updatePieceSuccessEvent="closePieceDialog(), emits('refreshPiecesEvent')"
      @disablePieceEvent="closePieceDialog(), disablePiece(pieceData)"
      @enablePieceEvent="closePieceDialog(), enablePiece(pieceData)"
    ></PieceDialogBody>
  </v-dialog>
</template>
