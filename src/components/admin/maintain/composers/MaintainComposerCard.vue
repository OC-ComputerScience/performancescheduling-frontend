<script setup>
import { ref } from "vue";
import ComposerDialogBody from "./ComposerDialogBody.vue";
import ComposerDataService from "../../../../services/ComposerDataService.js";

const emits = defineEmits(["closeComposerDialog", "refreshComposersEvent"]);

const props = defineProps({
  composerData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);
const comma = ref(", ");

if (
  props.composerData.firstName == null ||
  props.composerData.firstName.length == 0 ||
  props.composerData.lastName == null ||
  props.composerData.lastName.length == 0
)
  comma.value = "";

function closeComposerDialog() {
  createOrEditDialog.value = false;
}

async function disableComposer(composer) {
  composer.status = "Disabled";
  await ComposerDataService.update(composer)
    .then(() => {
      emits("refreshComposersEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableComposer(composer) {
  composer.status = "Active";
  await ComposerDataService.update(composer)
    .then(() => {
      emits("refreshComposersEvent");
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
            {{ composerData.lastName }}{{ comma }}{{ composerData.firstName }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
            {{ composerData.dateOfBirth }} - {{ composerData.dateOfDeath }}
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="composerData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ composerData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        flat
        size="small"
        class="font-weight-bold mt-0 ml-4 mr-2 text-none text-blue bg-white flatChipBorder"
        @click="createOrEditDialog = true"
      >
        Edit
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
    <ComposerDialogBody
      :is-edit="true"
      :is-admin="true"
      :composer-data="composerData"
      @closeComposerDialogEvent="closeComposerDialog"
      @updateComposerSuccessEvent="
        closeComposerDialog(), emits('refreshComposersEvent')
      "
      @disableComposerEvent="
        closeComposerDialog(), disableComposer(composerData)
      "
      @enableComposerEvent="closeComposerDialog(), enableComposer(composerData)"
    ></ComposerDialogBody>
  </v-dialog>
</template>
