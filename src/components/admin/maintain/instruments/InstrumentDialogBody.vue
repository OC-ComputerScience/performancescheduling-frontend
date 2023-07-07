<script setup>
import { ref } from "vue";
import InstrumentDataService from "../../../../services/InstrumentDataService";

const emits = defineEmits([
  "addInstrumentSuccessEvent",
  "closeAddInstrumentDialogEvent",
  "closeInstrumentDialogEvent",
  "updateInstrumentSuccessEvent",
  "disableInstrumentEvent",
  "enableInstrumentEvent",
]);

const props = defineProps({
  instrumentData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const instrumentTypes = ["Vocal", "Instrument"];

const editedInstrumentData = ref(Object.assign({}, props.instrumentData));
const form = ref(null);

//add Instrument
async function addInstrument() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await InstrumentDataService.create(editedInstrumentData.value)
        .then(async () => {
          emits("addInstrumentSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the instrument's roles

async function updateInstrument() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await InstrumentDataService.update(editedInstrumentData.value)
        .then(() => {
          emits("updateInstrumentSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}
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
            {{ props.isEdit ? "Edit" : "Add" }} Instrument
          </v-col>
          <v-col
            v-if="props.isEdit"
            cols="auto"
            align-self="center"
            class="pt-0 mt-0"
          >
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold text-none text-white flatChipBorder"
              :class="
                instrumentData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ editedInstrumentData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0"> </v-row>
        <v-row :class="props.isEdit ? '' : 'mt-2'">
          <v-col>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Instrument Name
            </v-card-subtitle>
            <v-text-field
              placeholder="Trumpet"
              v-model="editedInstrumentData.name"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () => !!editedInstrumentData.name || 'This field is required',
              ]"
            ></v-text-field>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Type
            </v-card-subtitle>
            <v-Select
              v-model="editedInstrumentData.type"
              :items="instrumentTypes"
              class="text-blue font-weight-bold py-0 my-0 mb-4"
            ></v-Select>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateInstrument() : addInstrument()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeInstrumentDialogEvent')
              : emits('closeAddInstrumentDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.instrumentData.status === 'Disabled'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="
            props.instrumentData.status === 'Disabled'
              ? emits('enableInstrumentEvent')
              : emits('disableInstrumentEvent')
          "
        >
          {{
            props.instrumentData.status === "Disabled" ? "Enable" : "Disable"
          }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
