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
  isAdmin: { type: [Boolean], required: true },
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
    let compFirstName;
    let compLastName;
    if (c.firstName == null) compFirstName = "";
    else compFirstName = c.firstName.toLowerCase();

    if (c.lastName == null) compLastName = "";
    else compLastName = c.lastName.toLowerCase();

    return (
      compareTwoStrings(compFirstName, composer.firstName.toLowerCase()) >=
        0.7 &&
      compareTwoStrings(compLastName, composer.lastName.toLowerCase()) >= 0.8
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
    : "This are very similar existing composers: " + similarComposerNames;
}

function emptyNameCheck(composer) {
  return (composer.lastName != null && composer.lastName.length != 0) ||
    (composer.firstName != null && composer.firstName.length != 0)
    ? true
    : "First Name or Last Name is required";
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
            {{ props.isEdit ? "Edit" : "Add" }} Composer
          </v-col>
          <v-spacer />
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mb-2 text-none text-white flatChipBorder"
              :class="
                composerData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ editedComposerData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-row class="mt-2">
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
              emptyNameCheck(editedComposerData),
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
              emptyNameCheck(editedComposerData),
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
                placeholder="YYYY or Present"
                v-model="editedComposerData.dateOfDeath"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () =>
                    !!editedComposerData.dateOfDeath ||
                    'This field is required',
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-card-actions>
        <v-spacer />
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white flatChipBorder"
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
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateComposer() : addComposer()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
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
          v-if="
            props.isEdit &&
            props.isAdmin &&
            props.composerData.status === 'Pending'
          "
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.composerData.status === 'Pending'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="emits('enableComposerEvent')"
        >
          Enable
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
