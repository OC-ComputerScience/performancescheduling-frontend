<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
//import { get24HourTimeString } from "../../composables/timeFormatter";
import AvailabilityDataService from "../../services/AvailabilityDataService";

const emits = defineEmits([
  "addAvailabilityEvent"
]);

const props = defineProps({
  availabilityData: { type: [Object], required: true },
  eventData: { type: [Object], required: false },
  isEdit: { type: [Boolean], required: true },
});

console.log("availability data", props.availabilityData)
console.log("event data", props.eventData)

const form = ref(null);

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const selectedStartTime = ref(get12HourTimeStringFromString(props.availabilityData.startTime));
console.log('availability data', props.availabilityData)
console.log('selected start time', selectedStartTime)
const selectedEndTime = ref(get12HourTimeStringFromString(props.availabilityData.endTime));
const selectTimesStart = ref([]);
const selectTimesEnd = ref([]);

async function addAvailability() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await AvailabilityDataService.create({
        eventId: props.eventData.id,
        userRoleId: currentRole.value.id,
        startTime: convertToMilitaryFormat(selectedStartTime.value),
        endTime: convertToMilitaryFormat(selectedEndTime.value)
      })
        .then(() => {
          emits("addAvailabilityEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

async function updateAvailability() {
  form.value.validate().then(async (valid) => {
    console.log(valid.valid);
    if (valid.valid) {
      await updateSelectedStartTime();
      await updateSelectedEndTime();

      emits("updateAvailabilityEvent");
    }
  });
}

async function updateSelectedStartTime() {
  if (
    props.availabilityData.startTime === null ||
    selectedStartTime.value != props.availabilityData.startTime
  ) {
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      startTime: convertToMilitaryFormat(selectedStartTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateSelectedEndTime() {
  if (
    props.availabilityData.endTime === null ||
    selectedEndTime.value != props.availabilityData.endTime
  ) {
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      endTime: convertToMilitaryFormat(selectedEndTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

// Organizing time to be displayed when select the start and end time
async function setTimeBoundaries(){  

  if(props.availabilityData.startTime !== null){
    // Starts with event start time and goes until event end time
    const startTime = parseTimeString(props.availabilityData.event.startTime);
    const endTime = parseTimeString(props.availabilityData.event.endTime);
    const interval = 15;

    console.log("start time", props.availabilityData.event.startTime)
    console.log("end time", endTime)

    // Put times into an array
    while (isTimeBefore(startTime, endTime)) {
      selectTimesStart.value.push(formatTimeString(startTime));
      selectTimesEnd.value.push(formatTimeString(startTime));
      startTime.minute += interval;

    // Handling case when minutes pass 59
      if (startTime.minute >= 60) {
        startTime.hour += Math.floor(startTime.minute / 60);
        startTime.minute %= 60;
      }
    }
    selectTimesEnd.value.push(formatTimeString(endTime));
  }
  else{
    // Starts with event start time and goes until event end time
    const startTime = parseTimeString(props.eventData.startTime);
    const endTime = parseTimeString(props.eventData.endTime);
    const interval = 15;

    console.log("start time", props.eventData.startTime)
    console.log("end time", endTime)

    // Put times into an array
    while (isTimeBefore(startTime, endTime)) {
      selectTimesStart.value.push(formatTimeString(startTime));
      selectTimesEnd.value.push(formatTimeString(startTime));
      startTime.minute += interval;

    // Handling case when minutes pass 59
      if (startTime.minute >= 60) {
        startTime.hour += Math.floor(startTime.minute / 60);
        startTime.minute %= 60;
      }
    }
    selectTimesEnd.value.push(formatTimeString(endTime));
  }
    console.log('end timessss', selectTimesEnd)
}

// Convert the time to string, excluding the seconds
function parseTimeString(timeString) {
  const [hour, minute] = timeString.split(":");
  return { hour: parseInt(hour), minute: parseInt(minute)};
}

// Format the time to be displayed as AM and PM
function formatTimeString({ hour, minute }) {
  const period = hour >= 12 ? "PM" : "AM";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${period}`;
}

// Comparison for while loop
function isTimeBefore(start, end) {
  return start.hour < end.hour || (start.hour === end.hour && start.minute < end.minute);
}

function convertToMilitaryFormat(timeString) {
  const [time, period] = timeString.split(' ');
  let [hours, minutes] = time.split(':');

  hours = parseInt(hours);
  minutes = parseInt(minutes);

  if (period === 'PM' && hours !== 12) {
    hours += 12;
  } else if (period === 'AM' && hours === 12) {
    hours = 0;
  }

  timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

  return timeString;
}

onMounted(() => {
  setTimeBoundaries();
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
            {{ props.isEdit ? "Edit" : "Add" }} Availability
          </v-col>
          <v-spacer></v-spacer>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-4">
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Start Time
        </v-card-subtitle>
        <v-select
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedStartTime"
          return-object
          :items="selectTimesEnd"
          :rules="[(v) => !!v || 'This field is required']"
        >
        <!-- <div v-for="availability in availabilityData">
          <v-select
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="selectedStartTime"
            :items="availability.length <= 1 ? availability[0].startTime : availability"
            return-object
            :rules="[(v) => !!v || 'This field is required']"
          > -->
          </v-select>
        <!-- </div> -->

        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          End Time
        </v-card-subtitle>
        <v-select
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedEndTime"
          return-object
          :items="selectTimesEnd"
          :rules="[(v) => !!v || 'This field is required']"
        >
        </v-select>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateAvailability() : addAvailability()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white bg-blue flatChipBorder"
          @click="emits('closeAvailabilityDialogEvent')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
