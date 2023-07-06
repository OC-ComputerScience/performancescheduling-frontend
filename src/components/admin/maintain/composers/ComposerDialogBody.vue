<script setup>
import { ref } from "vue";
import ComposerDataService from "../../../../services/ComposerDataService";

import { compareTwoStrings } from "string-similarity";

const emits = defineEmits([
  "addComposerSuccessEvent",
  "closeAddComposerDialogEvent",
  "closeComposerDialogEvent",
  "updateComposerSuccessEvent",
  "disableComposerEvent",
  "enableComposerEvent",
]);

const props = defineProps({
  isEdit: { type: [Boolean], required: true },
  composerData: { type: [Object], required: true },
  composersData: { type: [Array] },
});

const editedComposerData = ref(Object.assign({}, props.composerData));
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

// Update the composer's roles

async function updateComposer() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
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
function findSimilar(composer) {
  const similarComposers = props.composersData.filter((c) => {
    return (
      compareTwoStrings(
        c.firstName.toLowerCase(),
        composer.firstName.toLowerCase()
      ) >= 0.85 &&
      compareTwoStrings(
        c.lastName.toLowerCase(),
        composer.lastName.toLowerCase()
      ) >= 0.9
    );
  });
  return similarComposers;
}
function similarComposerCheck(composer) {
  if (
    props.isEdit == true ||
    composer.lastName == null ||
    composer.firstName == null
  ) {
    return true;
  }
  var similarComposers = findSimilar(composer);
  var similarComposerNames = "";
  similarComposers.forEach((c) => {
    similarComposerNames += c.firstName + " " + c.lastName + ", ";
  });
  similarComposerNames = similarComposerNames.slice(0, -2);

  return similarComposers == 0
    ? true
    : "This are very simialr existing composers: " + similarComposerNames;
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
              :class="
                composerData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ editedComposerData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-row :class="props.isEdit ? '' : 'mt-2'">
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            First Name
          </v-card-subtitle>
          <v-text-field
            v-model="editedComposerData.firstName"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedComposerData.firstName || 'This field is required',
              similarComposerCheck(editedComposerData),
            ]"
          ></v-text-field>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Last Name
          </v-card-subtitle>
          <v-text-field
            v-model="editedComposerData.lastName"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedComposerData.lastName || 'This field is required',
              similarComposerCheck(editedComposerData),
            ]"
          ></v-text-field>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Nationality
          </v-card-subtitle>
          <v-text-field
            v-model="editedComposerData.nationality"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () =>
                !!editedComposerData.nationality || 'This field is required',
            ]"
          ></v-text-field>
          <v-row>
            <v-col cols="6">
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Date of Birth
              </v-card-subtitle>
              <v-text-field
                placeholder="YYYY"
                v-model="editedComposerData.dateOfBirth"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () =>
                    !!editedComposerData.dateOfBirth ||
                    'This field is required',
                  () =>
                    /^[0-9]{4}$/.test(editedComposerData.dateOfBirth) ||
                    'Must be a YYYY',
                ]"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Date of Death
              </v-card-subtitle>
              <v-text-field
                placeholder="YYYY"
                v-model="editedComposerData.dateOfDeath"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () =>
                    /^$|[0-9]{4}$/.test(editedComposerData.dateOfDeath) ||
                    'Must be YYYY',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
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
            props.composerData.status === 'Disabled'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="
            props.composerData.status === 'Disabled'
              ? emits('enableComposerEvent')
              : emits('disableComposerEvent')
          "
        >
          {{ props.composerData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
