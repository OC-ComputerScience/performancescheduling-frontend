<script setup>
import { ref, onMounted, watch } from "vue";
import UserRoleDataService from "../../../../services/UserRoleDataService";
import StudentInstrumentDataService from "../../../../services/StudentInstrumentDataService";
import LevelDataService from "../../../../services/LevelDataService";
import InstrumentDataService from "../../../../services/InstrumentDataService";
import SemesterDataService from "../../../../services/SemesterDataService";

const emits = defineEmits([
  "closeAddInstrumentDialog",
  "addInstrumentSuccessEvent",
  "updateInstrumentSuccessEvent",
  "closeUserInstrumentDialogEvent",
  "disableStudentInstrumentEvent",
  "enableStudentInstrumentEvent",
]);

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
  isStudent: { type: [Boolean], required: false },
});

const form = ref(null);

const selectedInstrument = ref(props.studentInstrumentData.instrument);
const selectedInstructor = ref(props.studentInstrumentData.instructorRole);
const selectedAccompanist = ref(props.studentInstrumentData.accompanistRole);
const selectedSemester = ref(props.studentInstrumentData.semester);
const studentInstruments = ref([]);
const haveLevel = ref(false);

const editedLevel = ref(props.studentInstrumentData.level);
const editedEndingLevel = ref(props.studentInstrumentData.endingLevel);
const privateHours = ref(props.studentInstrumentData.privateHours);
const levelOptions = ref([]);
const instrumentOptions = ref([]);
const instructors = ref([]);
const accompanists = ref([]);
const semesters = ref([]);

async function getLevels() {
  await LevelDataService.getAll()
    .then((response) => {
      levelOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getStudentInstruments() {
  await StudentInstrumentDataService.getStudentInstrumentsForStudentId(
    props.studentInstrumentData.studentRoleId
  )
    .then((response) => {
      studentInstruments.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getInstruments() {
  await InstrumentDataService.getAll("name")
    .then((response) => {
      instrumentOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAllInstructors() {
  await UserRoleDataService.getRolesForRoleId(2, "lastName,firstName")
    .then((response) => {
      instructors.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAllAccompanists() {
  await UserRoleDataService.getRolesForRoleId(4, "lastName,firstName")
    .then((response) => {
      accompanists.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getSemesters() {
  await SemesterDataService.getAll("startDate", false)
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function addInstrument() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await StudentInstrumentDataService.create({
        privateHours: privateHours.value,
        status: props.studentInstrumentData.status,
        studentRoleId: props.studentInstrumentData.studentRoleId,
        instrumentId: selectedInstrument.value.id,
        instructorRoleId: selectedInstructor.value.id,
        accompanistRoleId:
          selectedAccompanist.value != null
            ? selectedAccompanist.value.id
            : null,
        levelId: editedLevel.value.id,
        semesterId: selectedSemester.value.id,
      })
        .then(() => {
          emits("addInstrumentSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

async function updateInstrument() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await updateSelectedInstructor();
      await updateSelectedAccompanist();
      await updateLevel();
      await updateEndingLevel();
      await updatePrivateHours();
      await updateSemester();

      emits("updateInstrumentSuccessEvent");
    }
  });
}

async function updateSelectedInstructor() {
  if (
    props.studentInstrumentData.instructorRoleId === null ||
    selectedInstructor.value.id != props.studentInstrumentData.instructorRoleId
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
    props.studentInstrumentData.accompanistRoleId === null ||
    selectedAccompanist.value == null ||
    selectedAccompanist.value.id !=
      props.studentInstrumentData.accompanistRoleId
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      accompanistRoleId:
        selectedAccompanist.value != null ? selectedAccompanist.value.id : null,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateLevel() {
  if (
    props.studentInstrumentData.levelId === null ||
    editedLevel.value.id != props.studentInstrumentData.levelId
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      levelId: editedLevel.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateEndingLevel() {
  if (
    editedEndingLevel.value != null &&
    (props.studentInstrumentData.endingLevelId === null ||
      editedEndingLevel.value.id != props.studentInstrumentData.endingLevelId)
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      endingLevelId: editedEndingLevel.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateSemester() {
  if (
    props.studentInstrumentData.semesterId === null ||
    selectedSemester.value.id != props.studentInstrumentData.semesterId
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      semesterId: selectedSemester.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updatePrivateHours() {
  if (
    props.studentInstrumentData.privateHours === null ||
    privateHours.value != props.studentInstrumentData.privateHours
  ) {
    await StudentInstrumentDataService.update({
      id: props.studentInstrumentData.id,
      privateHours: privateHours.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}
async function setDefaultValues() {
  await getStudentInstruments();

  let defaultInstrument = studentInstruments.value.find(
    (x) => x.instrumentId === selectedInstrument.value.id
  );

  if (defaultInstrument == null) {
    haveLevel.value = false;
    selectedInstructor.value = null;
    selectedAccompanist.value = null;
    editedLevel.value = levelOptions.value[0];
    selectedSemester.value = semesters.value[0];
    privateHours.value = 1;
  } else {
    haveLevel.value = true;
    selectedInstructor.value = defaultInstrument.instructorRole;
    selectedAccompanist.value = defaultInstrument.accompanistRole;
    selectedSemester.value = semesters.value[0];

    if (defaultInstrument.endingLevelId != null) {
      editedLevel.value =
        levelOptions.value[defaultInstrument.endingLevelId - 1];
    } else {
      haveLevel.value = false;
      if (defaultInstrument.levelId === null) editedLevel.value = 1;
      else
        editedLevel.value = levelOptions.value[defaultInstrument.levelId - 1];
    }

    privateHours.value = defaultInstrument.privateHours;
  }
}
watch(selectedInstrument, (newValue, oldValue) => {
  if (newValue != null && !props.isEdit) {
    setDefaultValues();
  }
});

onMounted(async () => {
  await getLevels();
  await getInstruments();
  await getAllInstructors();
  await getAllAccompanists();
  await getSemesters();
});
</script>

<template>
  <v-card class="pa-2 bg-lightBlue flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-blue font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Instrument
          </v-col>
          <v-spacer></v-spacer>
          <v-col v-if="props.isEdit" cols="auto" class="pt-0 mt-0 pr-2">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-white flatChipBorder"
              :class="
                studentInstrumentData.status === 'Active'
                  ? 'bg-teal'
                  : 'bg-maroon'
              "
            >
              {{ studentInstrumentData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Instrument
        </v-card-subtitle>
        <v-autocomplete
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedInstrument"
          :items="instrumentOptions"
          :item-title="(item) => item.name"
          item-value="id"
          return-object
          :readonly="props.isEdit"
          :rules="[(v) => !!v || 'This field is required']"
        >
        </v-autocomplete>
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Semester
        </v-card-subtitle>
        <v-select
          v-model="selectedSemester"
          :items="semesters"
          item-title="name"
          item-value="id"
          variant="plain"
          return-object
          class="bg-white text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          :rules="[() => !!selectedSemester || 'This field is required']"
        ></v-select>

        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Instructor
        </v-card-subtitle>
        <v-autocomplete
          clearable
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedInstructor"
          :items="instructors"
          :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
          item-value="id"
          return-object
          :rules="[(v) => !!v || 'This field is required']"
        >
        </v-autocomplete>

        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Accompanist
        </v-card-subtitle>
        <v-autocomplete
          clearable
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedAccompanist"
          :items="accompanists"
          :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
          item-value="id"
          return-object
        >
        </v-autocomplete>
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Starting Level
        </v-card-subtitle>
        <v-select
          :read-only="haveLevel"
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="editedLevel"
          :items="levelOptions"
          :item-title="(item) => item.name"
          item-value="id"
          return-object
          :rules="[(v) => !!v || 'This field is required']"
        >
        </v-select>
        <v-card-subtitle
          v-if="isEdit"
          class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
        >
          Ending Level
        </v-card-subtitle>
        <v-select
          v-if="isEdit"
          color="darkBlue"
          variant="plain"
          :readonly="props.isStudent"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="editedEndingLevel"
          :items="levelOptions"
          :item-title="(item) => item.name"
          item-value="id"
          return-object
        >
        </v-select>
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Private Lesson Hours
        </v-card-subtitle>
        <v-text-field
          type="number"
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="privateHours"
          :rules="[/^[1-2]/.test(privateHours) || 'Must be 1 or 2 hours']"
        >
        </v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          v-if="props.isEdit && !props.isStudent"
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
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateInstrument() : addInstrument()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="emits('closeUserInstrumentDialogEvent')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
