<script setup>
import { ref, onMounted } from "vue";
import { get12HourTimeStringFromString } from "../../../composables/timeFormatter";
import EventSignupDataService from "../../../services/EventSignupDataService.js";
import StudentInstrumentDataService from "../../../services/StudentInstrumentDataService";
import LevelDataService from "../../../services/LevelDataService";

const emits = defineEmits(["closeDialogEvent"]);
const props = defineProps(["signup"]);
const studentNames = ref("");
const endingLevel = ref(props.signup.endingLevelId);
const editedSignup = ref(props.signup);
const levelOptions = ref([]);
console.log(props.signup);
async function saveEndingLevel() {
  editedSignup.value.endingLevelId = endingLevel.value;

  await EventSignupDataService.update(editedSignup.value).catch((error) => {
    console.log(error);
  });
  props.signup.studentInstrumentSignups.forEach(async (stuSignup) => {
    let studentInstrument = {
      id: stuSignup.studentInstrument.id,
      endingLevelId: endingLevel.value,
    };
    await StudentInstrumentDataService.update(studentInstrument).catch(
      (error) => {
        console.log(error);
      }
    );
  });
  let studentInstrument = {
    id: props.signup.studentInstrumentSignups[0].studentInstrument.id,
    endingLevelId: endingLevel.value,
  };

  await StudentInstrumentDataService.update(studentInstrument).catch(
    (error) => {
      console.log(error);
    }
  );
  emits("closeDialogEvent");
}

async function getLevels() {
  await LevelDataService.getAll()
    .then((response) => {
      levelOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  getLevels();
  let students = props.signup.studentInstrumentSignups.map(
    (stuSignup) =>
      stuSignup.studentInstrument.studentRole.user.firstName +
      " " +
      stuSignup.studentInstrument.studentRole.user.lastName
  );

  if (students.length == 1) {
    studentNames.value = students[0];
  } else if (students.length == 2) {
    //joins all with "and" but no commas
    studentNames.value = students.join(" and ");
  } else {
    //joins all with commas, but last one gets ", and"
    studentNames.value =
      students.slice(0, -1).join(", ") + ", and " + students.slice(-1);
  }
});
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-text>
        <v-row class="mt-1">
          <v-card-title class="font-weight-bold text-maroon text-h4">
            Enter Level
          </v-card-title>

          <v-spacer></v-spacer>
          <v-card color="lightMaroon" elevation="0" class="mr-2">
            <v-card-title>
              <div class="text-maroon font-weight-bold">
                {{
                  get12HourTimeStringFromString(props.signup.startTime) +
                  "-" +
                  get12HourTimeStringFromString(props.signup.endTime)
                }}
              </div>
            </v-card-title>
          </v-card>
        </v-row>
        <v-row class="mt-4 ml-2">
          <v-card-subtitle class="text-black text-h7">
            Note: only one juror needs to submit an Ending Level.
          </v-card-subtitle>
        </v-row>
        <v-row class="mt-6 ml-2">
          <v-card-subtitle class="font-weight-bold text-black text-h6">
            {{ studentNames }}
          </v-card-subtitle>
        </v-row>

        <v-row class="mt-4 ml-2">
          <v-card-title class="font-weight-bold text-maroon text-h5">
            Ending Level
          </v-card-title>
        </v-row>
        <v-row class="mt-4 ml-2">
          <v-select
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="endingLevel"
            :items="levelOptions"
            :item-title="(item) => item.name"
            item-value="id"
            :rules="[(v) => !!v || 'This field is required']"
          >
          </v-select>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-maroon flatChipBorder"
          @click="saveEndingLevel()"
        >
          Save
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          @click="emits('closeDialogEvent')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
