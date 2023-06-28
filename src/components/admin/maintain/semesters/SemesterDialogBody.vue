<script setup>
import { ref, onMounted } from "vue";

import SemesterDataService from "../../../../services/SemesterDataService";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits([
  "addSemesterSuccessEvent",
  "closeAddSemesterDialogEvent",
  "closeSemesterDialogEvent",
  "updateSemesterSuccessEvent",
  "disableSemesterEvent",
  "enableSemesterEvent",
]);

const props = defineProps({
  semesterData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedSemesterData = ref(props.semesterData);

// const editedSemesterRoles = ref(props.semesterRoles);

onMounted(() => {
  if (props.isEdit) {
    editedSemesterData.value["id"] = props.semesterData.id;
    editedSemesterData.value.startDate = formatDate(
      editedSemesterData.value.startDate
    );
    editedSemesterData.value.endDate = formatDate(
      editedSemesterData.value.endDate
    );
  } else {
    editedSemesterData.value["status"] = "Active";
  }
});

async function addSemester() {
  if (!validateSemester()) {
    return;
  }
  await SemesterDataService.create(editedSemesterData.value)
    .then(async () => {
      emits("addSemesterSuccessEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateSemester() {
  if (!validateSemester()) {
    return;
  }
  delete editedSemesterData.value["createdAt"];
  delete editedSemesterData.value["updatedAt"];

  await SemesterDataService.update(editedSemesterData.value)
    .then(() => {
      emits("updateSemesterSuccessEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

function validateSemester() {
  if (
    semesterNameCheck() === "" &&
    startDateCheck() === "" &&
    endDateCheck() === ""
  )
    return true;
  else return false;
}

function semesterNameCheck() {
  const pattern = /[0-9]{4}-[A-Z]{2}/;
  console.log("test" + pattern.test(editedSemesterData.value.name));
  return pattern.test(editedSemesterData.value.name)
    ? ""
    : "Semester name must be in the format of YYYY-SS.";
}
function startDateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedSemesterData.value.startDate)
    ? ""
    : "Date  must be in the format of MM/DD/YYYY.";
}
function endDateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedSemesterData.value.endDate)
    ? ""
    : "Date must be in the format of MM/DD/YYYY.";
}
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-card-title>
      <v-row class="pt-0 mt-0">
        <v-col
          cols="auto"
          class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
        >
          {{ props.isEdit ? "Edit" : "Add" }} Semester
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-row v-if="props.isEdit" class="pt-0 mt-0">
        <v-col cols="auto" class="pl-6" align-self="center">
          <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
            {{ semesterData.name }}
          </v-card-title>
        </v-col>
        <v-col v-if="props.isEdit" cols="auto" align-self="center">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="semesterData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ semesterData.status === "Active" ? "Active" : "Disabled" }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions :class="props.isEdit ? '' : 'mt-2'">
      <v-card-text>
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Semester Name
        </v-card-subtitle>

        <v-text-field
          placeholder="2000-FA"
          v-model="editedSemesterData.name"
          variant="plain"
          class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          :rules="[
            () => !!editedSemesterData.name || 'This field is required',
            semesterNameCheck,
          ]"
        ></v-text-field>

        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Start Date
        </v-card-subtitle>
        <v-text-field
          placeholder="MM/DD/YYYY"
          v-model="editedSemesterData.startDate"
          variant="plain"
          class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          :rules="[
            () => !!editedSemesterData.startDate || 'This field is required',
            startDateCheck,
          ]"
        ></v-text-field>
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          End Date
        </v-card-subtitle>
        <v-text-field
          placeholder="MM/DD/YYYY"
          v-model="editedSemesterData.endDate"
          variant="plain"
          class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          :rules="[
            () => !!editedSemesterData.endDate || 'This field is required',
            endDateCheck,
          ]"
        ></v-text-field>
      </v-card-text>
    </v-card-actions>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
        @click="props.isEdit ? updateSemester() : addSemester()"
      >
        {{ props.isEdit ? "Save" : "Add" }}
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        :class="props.isEdit ? '' : 'mr-auto'"
        @click="
          props.isEdit
            ? emits('closeSemesterDialogEvent')
            : emits('closeAddSemesterDialogEvent')
        "
      >
        Cancel
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
