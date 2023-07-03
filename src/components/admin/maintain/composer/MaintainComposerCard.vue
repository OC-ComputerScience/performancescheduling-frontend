<script setup>
import { ref } from "vue";
import ComposerDialogBody from "./ComposerDialogBody.vue";
import ComposerDataService from "../../../../services/ComposerDataService.js";

const emits = defineEmits(["closeComposerDialog", "refreshComposersEvent"]);

defineProps({
  majorData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeComposerDialog() {
  createOrEditDialog.value = false;
}

async function disableComposer(major) {
  major.status = "Disabled";
  await ComposerDataService.update(major)
    .then(() => {
      emits("refreshComposersEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableComposer(major) {
  major.status = "Active";
  await ComposerDataService.update(major)
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
            {{ majorData.name }}
          </v-card-subtitle>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="majorData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ majorData.status }}
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
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="6" class="pl-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="majorData.isMusicComposer ? 'bg-green' : 'bg-darkBlue'"
          >
            {{ majorData.isMusicComposer ? "Music" : "Non Music" }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="1200px">
      <ComposerDialogBody
        :is-edit="true"
        :major-data="majorData"
        @closeComposerDialogEvent="closeComposerDialog"
        @updateComposerSuccessEvent="
          closeComposerDialog(), emits('refreshComposersEvent')
        "
        @disableComposerEvent="
          closeComposerDialog(), disableComposer(majorData)
        "
        @enableComposerEvent="closeComposerDialog(), enableComposer(majorData)"
      ></ComposerDialogBody>
    </v-dialog>
  </v-card>
</template>
