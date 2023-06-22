<script setup>
import { ref, onMounted } from "vue";
import UserRoleDataService from "../../services/UserRoleDataService";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService";
import LevelDataService from "../../services/LevelDataService";

const emits = defineEmits([
  "closeUserInstrumentDialog",
  "updateInstrumentSuccessEvent",
  "disableStudentInstrumentEvent",
  "enableStudentInstrumentEvent",
]);

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const selectedInstructor = ref(props.studentInstrumentData.instructorRole);
const selectedAccompanist = ref(props.studentInstrumentData.accompanistRole);

const editedLevel = ref(props.studentInstrumentData.level);

const levelOptions = ref([]);

async function getLevels() {
  await LevelDataService.getAll()
    .then((response) => {
      levelOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const instructors = ref([]);
const accompanists = ref([]);

async function getAllInstructors() {
  await UserRoleDataService.getRolesFoRoleId(2)
    .then((response) => {
      instructors.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAllAccompanists() {
  await UserRoleDataService.getRolesFoRoleId(4)
    .then((response) => {
      accompanists.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function updateInstrument() {
  await updateSelectedInstructor();
  await updateSelectedAccompanist();
  await updateLevel();

  emits("updateInstrumentSuccessEvent");
}

async function updateSelectedInstructor() {
  if (
    selectedInstructor.value.id != props.studentInstrumentData.instructorRole.id
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      instructorRoleId: selectedInstructor.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateSelectedAccompanist() {
  if (
    selectedAccompanist.value.id !=
    props.studentInstrumentData.accompanistRole.id
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      accompanistRoleId: selectedAccompanist.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateLevel() {
  if (editedLevel.value.id != props.studentInstrumentData.level.id) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      levelId: editedLevel.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

onMounted(async () => {
  await getLevels();
  console.log(props.studentInstrumentData);
  await getAllInstructors();
  console.log(instructors.value[81]);
  await getAllAccompanists();
});
</script>

<template>
  <v-card class="pa-2 bg-lightBlue flatCardBorder">
    <v-card-title>
      <v-row class="pt-0 mt-0">
        <v-col cols="auto" class="pt-0 mt-0 text-blue font-weight-bold text-h4">
          {{ props.isEdit ? "Edit" : "Add" }} Instrument
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-0 mt-0 pr-2">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none bg-white flatChipBorder"
            :class="
              studentInstrumentData.status === 'Active'
                ? 'text-teal'
                : 'text-maroon'
            "
          >
            {{
              studentInstrumentData.status === "Active" ? "Active" : "Disabled"
            }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-4">
      <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
        Instructor
      </v-card-subtitle>
      <v-select
        color="darkBlue"
        variant="plain"
        class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
        v-model="selectedInstructor"
        :items="instructors"
        :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
        item-value="id"
        return-object
      >
      </v-select>

      <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
        Accompanist
      </v-card-subtitle>
      <v-select
        color="darkBlue"
        variant="plain"
        class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
        v-model="selectedAccompanist"
        :items="accompanists"
        :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
        item-value="id"
        return-object
      >
      </v-select>
      <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
        Level
      </v-card-subtitle>
      <v-select
        color="darkBlue"
        variant="plain"
        class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
        v-model="editedLevel"
        :items="levelOptions"
        :item-title="(item) => item.name"
        item-value="id"
        return-object
      >
      </v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
        @click="updateInstrument()"
      >
        Save
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        @click="emits('closeUserInstrumentDialogEvent')"
      >
        Cancel
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
        :class="
          props.studentInstrumentData.status === 'Disabled'
            ? 'bg-darkBlue'
            : 'bg-maroon'
        "
        @click="
          props.studentInstrumentData.status === 'Disabled'
            ? emits('enableStudentInstrumentEvent')
            : emits('disableStudentInstrumentEvent')
        "
      >
        {{
          props.studentInstrumentData.status === "Disabled"
            ? "Enable"
            : "Disable"
        }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
