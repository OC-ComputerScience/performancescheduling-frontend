<script setup>
import { ref } from "vue";
import ComposerDataService from "../../../../services/ComposerDataService";

const emits = defineEmits([
  "addComposerSuccessEvent",
  "closeAddComposerDialogEvent",
  "closeComposerDialogEvent",
  "updateComposerSuccessEvent",
  "disableComposerEvent",
  "enableComposerEvent",
]);

const props = defineProps({
  majorData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedComposerData = ref(Object.assign({}, props.majorData));
const form = ref(null);

//add Composer
async function addComposer() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await ComposerDataService.create(editedComposerData.value)
        .then(async () => {
          emits("addComposerSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the major's roles

async function updateComposer() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedComposerData.value["createdAt"];
      delete editedComposerData.value["updatedAt"];

      await ComposerDataService.update(editedComposerData.value)
        .then(() => {
          emits("updateComposerSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
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
            {{ props.isEdit ? "Edit" : "Add" }} Composer
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ editedComposerData.name }}
            </v-card-title>
          </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="majorData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
            >
              {{
                editedComposerData.status === "Active" ? "Active" : "Disabled"
              }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row :class="props.isEdit ? '' : 'mt-2'">
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Composer Name
          </v-card-subtitle>
          <v-text-field
            placeholder="Music"
            v-model="editedComposerData.name"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedComposerData.name || 'This field is required',
            ]"
          ></v-text-field>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Music Composer?
          </v-card-subtitle>
          <v-checkbox
            v-model="editedComposerData.isMusicComposer"
            label="Music Composer?"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          ></v-checkbox>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateComposer() : addComposer()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeComposerDialogEvent')
              : emits('closeAddComposerDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.majorData.status === 'Disabled' ? 'bg-darkBlue' : 'bg-maroon'
          "
          @click="
            props.majorData.status === 'Disabled'
              ? emits('enableComposerEvent')
              : emits('disableComposerEvent')
          "
        >
          {{ props.majorData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
