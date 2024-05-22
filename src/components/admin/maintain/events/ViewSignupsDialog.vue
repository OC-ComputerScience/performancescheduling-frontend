<script setup>
import { ref, onBeforeMount } from "vue";

import { formatDate } from "../../../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../../../composables/timeFormatter";
import {
  generateTimeSlots,
  subtractTimes,
  addMinsToTime,
} from "../../../../composables/timeManipulator.js";

import AvailDataTable from "./AvailDataTable.vue";

const tableData = ref([]);
const props = defineProps({
  eventData: { type: [Object], required: true },
  availData: { type: [Object], required: true },
  studentSignupData: { type: [Object], required: true },
});

function sortData() {
  tableData.value = [];
  adjEndTime = props.eventData.endTime;

  let minutes =
    subtractTimes(props.eventData.startTime, props.eventData.endTime) / 30;

  if (minutes > parseInt(minutes)) {
    var adjEndTime = addMinsToTime(30, props.eventData.endTime);
  }

  var timeSlots = generateTimeSlots(props.eventData.startTime, adjEndTime, 30);

  //timeSlots.pop();

  timeSlots.forEach((element) => {
    tableData.value.push({
      time: element,
      faculty: [],
      accompanist: [],
      student: [],
    });
  });

  var beginIndex = 0;

  // Finds the beginning index
  props.availData.forEach((element) => {
    for (var i = 0; i < timeSlots.length; i++) {
      if (
        element.startTime == timeSlots[i].time ||
        (element.startTime > timeSlots[i].time &&
          element.startTime < timeSlots[i + 1].time)
      ) {
        beginIndex = i;
        break;
      }
    }

    // Gets the number of 30 minute time slots that this element is available for
    var numberOfAvailabilities =
      subtractTimes(element.startTime, element.endTime) / 30;
    console.log(numberOfAvailabilities);
    if (element.startTime > timeSlots[beginIndex].time)
      numberOfAvailabilities++;

    // If the element's role is a faculty member, add their first and last name to the faculty array
    if (element.userRole.role.role == "Faculty") {
      for (let i = 0; i < numberOfAvailabilities; i++) {
        tableData.value[beginIndex + i].faculty.push({
          firstName: element.userRole.user.firstName,
          lastName: element.userRole.user.lastName,
        });
      }
    }
    // If the element's role is an accompanist, add their first and last name to the accompanist array
    else if (element.userRole.role.role == "Accompanist") {
      for (let i = 0; i < numberOfAvailabilities; i++) {
        tableData.value[beginIndex + i].accompanist.push({
          firstName: element.userRole.user.firstName,
          lastName: element.userRole.user.lastName,
        });
      }
    }
  });

  props.studentSignupData.eventSignups.forEach((element) => {
    var placed = false;
    for (let i = 0; i < timeSlots.length && !placed; i++) {
      if (element.startTime < timeSlots[i].time) {
        element.studentInstrumentSignups.forEach((signup) => {
          tableData.value[i - 1].student.push({
            firstName: signup.studentInstrument.studentRole.user.firstName,
            lastName: signup.studentInstrument.studentRole.user.lastName,
          });
        });
        placed = true;
      }
    }
    if (!placed) {
      element.studentInstrumentSignups.forEach((signup) => {
        tableData.value[timeSlots.length - 1].student.push({
          firstName: signup.studentInstrument.studentRole.user.firstName,
          lastName: signup.studentInstrument.studentRole.user.lastName,
        });
      });
    }
  });
}

onBeforeMount(() => {
  sortData();
});
const emits = defineEmits(["closeSignupsDialog"]);
</script>

<template>
  <v-card min-width="800" max-width="1000">
    <v-card-title>
      <v-row class="pt-0 mt-0">
        <v-col
          cols="auto"
          class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
        >
          View Signups
        </v-col>
      </v-row>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="9" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ eventData.name }}
          </v-card-subtitle>
          <v-card-subtitle class="text-weight-semi-bold text-blue pt-1 pb-0">
            {{ formatDate(eventData.date) }}
            ({{ get12HourTimeStringFromString(eventData.startTime) }}
            to
            {{ get12HourTimeStringFromString(eventData.endTime) }})
          </v-card-subtitle>
          <v-card-subtitle class="text-weight-semi-bold text-blue pt-1 pb-0">
            {{ eventData.location.roomName }}
          </v-card-subtitle>
          <v-card-subtitle class="text- weight-semi-bold text-blue pt-1 pb-0">
            {{
              eventData.eventType.type +
              " - instrument: " +
              eventData.eventType.instrumentType
            }}
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row class="pt-0 mt-0 pl-2">
        <v-card>
          <AvailDataTable :data-table-data="tableData" />
        </v-card>
      </v-row>
    </v-card-title>
    <v-btn
      flat
      class="font-weight-semi-bold mt-0 ml-auto mr-4 mb-2 text-none text-white bg-blue flatChipBorder"
      @click="emits('closeSignupsDialog')"
    >
      Cancel
    </v-btn>
  </v-card>
</template>

<style scoped></style>
