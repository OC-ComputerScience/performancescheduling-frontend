<script setup>
import { ref, onMounted } from "vue";
import { get12HourTimeStringFromString } from "../../../composables/timeFormatter";
import EventSignupDataService from "../../../services/EventSignupDataService.js";

const emits = defineEmits(["closeDialogEvent"]);
const props = defineProps(["signup"]);
const studentNames = ref("");

async function saveGrade(grade) {
  props.signup.pass = grade;
  await EventSignupDataService.update(props.signup).catch((error) => {
    console.log(error);
  });
  emits("closeDialogEvent");
}

onMounted(async () => {
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
            Select Grade
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
            Note: only one hearer needs to submit a Grade.
          </v-card-subtitle>
        </v-row>
        <v-row class="mt-6 ml-2">
          <v-card-subtitle class="font-weight-bold text-black text-h6">
            {{ studentNames }}
          </v-card-subtitle>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="saveGrade(true)"
        >
          Pass
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-maroon flatChipBorder"
          @click="saveGrade(false)"
        >
          Fail
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          @click="emits('closeDialogEvent')"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
