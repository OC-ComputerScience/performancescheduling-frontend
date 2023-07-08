<script setup>
import { ref } from "vue";
import InstrumentDialogBody from "./InstrumentDialogBody.vue";
import InstrumentDataService from "../../../../services/InstrumentDataService.js";

const emits = defineEmits(["closeInstrumentDialog", "refreshInstrumentsEvent"]);

defineProps({
  instrumentData: { type: [Object], required: true },
});

const createOrEditDialog = ref(false);

function closeInstrumentDialog() {
  createOrEditDialog.value = false;
}

async function disableInstrument(instrument) {
  instrument.status = "Disabled";
  await InstrumentDataService.update(instrument)
    .then(() => {
      emits("refreshInstrumentsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableInstrument(instrument) {
  instrument.status = "Active";
  await InstrumentDataService.update(instrument)
    .then(() => {
      emits("refreshInstrumentsEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-0">
        <v-col cols="7" class="pl-0">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ instrumentData.name }}
          </v-card-subtitle>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="
              instrumentData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
            "
          >
            {{ instrumentData.status }}
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
      <v-row class="pt-0 mt-0 pl-2 pb-1">
        <v-col cols="6" class="pl-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="instrumentData.type == 'Vocal' ? 'bg-green' : 'bg-darkBlue'"
          >
            {{ instrumentData.type }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>

    <v-dialog v-model="createOrEditDialog" persistent max-width="600px">
      <InstrumentDialogBody
        :is-edit="true"
        :instrument-data="instrumentData"
        @closeInstrumentDialogEvent="closeInstrumentDialog"
        @updateInstrumentSuccessEvent="
          closeInstrumentDialog(), emits('refreshInstrumentsEvent')
        "
        @disableInstrumentEvent="
          closeInstrumentDialog(), disableInstrument(instrumentData)
        "
        @enableInstrumentEvent="
          closeInstrumentDialog(), enableInstrument(instrumentData)
        "
      ></InstrumentDialogBody>
    </v-dialog>
  </v-card>
</template>
