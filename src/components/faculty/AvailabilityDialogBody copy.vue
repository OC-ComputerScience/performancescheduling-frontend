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

//I have to make a for loop to get all start and end time
//const selectedStartTime = ref(get12HourTimeStringFromString(props.availabilityData.startTime));
const selectedStartTime = ref([]);
//const selectedEndTime = ref(get12HourTimeStringFromString(props.availabilityData.endTime));
const selectedEndTime = ref([]);

//These both const will store all the start/end times possibilities for the availability
const startTimeBoundaries = ref([]);
const endTimeBoundaries = ref([]);

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
  if(Array.isArray(props.availabilityData)){
    for(let i=0; i<props.availabilityData.length;i++){
      await AvailabilityDataService.update({
        id: props.availabilityData[i].id,
        startTime: convertToMilitaryFormat(selectedStartTime.value[i])
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  else{
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      startTime: convertToMilitaryFormat(selectedStartTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateSelectedEndTime() {
  if(Array.isArray(props.availabilityData)){
    for(let i=0; i<props.availabilityData.length;i++){
      await AvailabilityDataService.update({
        id: props.availabilityData[i].id,
        endTime: convertToMilitaryFormat(selectedEndTime.value[i])
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  else{
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      endTime: convertToMilitaryFormat(selectedEndTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function deleteAvailability() {
  if(Array.isArray(props.availabilityData)){
    console.log('first remove availability', props.availabilityData.id)
      await AvailabilityDataService.remove({
        id: props.availabilityData[selectedStartTime.id].id
      }).catch((err) => {
        console.log(err);
      });
  }
  else{
    console.log('remove availability', props.availabilityData.id)
    await AvailabilityDataService.remove({
      id: props.availabilityData.id
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function setAvailabilityTimes(){
  console.log('HERE AVAILABLE', props.availabilityData)
  if(Array.isArray(props.availabilityData)){
    for(let i=0; i<props.availabilityData.length;i++){
      selectedStartTime.value.push(get12HourTimeStringFromString(props.availabilityData[i].startTime))
      selectedEndTime.value.push(get12HourTimeStringFromString(props.availabilityData[i].endTime))
    }
  }
  else{
    selectedStartTime.value = get12HourTimeStringFromString(props.availabilityData.startTime);
    selectedEndTime.value = get12HourTimeStringFromString(props.availabilityData.endTime);
  }
  console.log('selected start time', selectedStartTime)
}

// Organizing time to be displayed when select the start and end time
async function setTimeBoundaries(){  
    const startTime = parseTimeString(props.eventData.startTime);
    const endTime = parseTimeString(props.eventData.endTime);
    const interval = 15;

    // Put times into an array
    while (isTimeBefore(startTime, endTime)) {
      startTimeBoundaries.value.push(formatTimeString(startTime));
      endTimeBoundaries.value.push(formatTimeString(startTime));
      startTime.minute += interval;

    // Handling case when minutes pass 59
      if (startTime.minute >= 60) {
        startTime.hour += Math.floor(startTime.minute / 60);
        startTime.minute %= 60;
      }
    }
    endTimeBoundaries.value.push(formatTimeString(endTime));
  }
    console.log('end timessss', endTimeBoundaries)
    console.log('availability boundaries', props.availabilityData)


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
  console.log('time being converted', timeString)
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
  console.log('availability mounted 1', props.availabilityData)
  setTimeBoundaries();
  setAvailabilityTimes();
  console.log('availability mounted 2', props.availabilityData)
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
        <div v-if="availabilityData.length > 1" v-for="(time,index) in selectedStartTime">

          <div class="d-flex justify-center align-center">
            <!-- <v-card-subtitle class="pl-0 pb-2 font-weight-bold text-darkBlue">
                Availability {{ index+1 }}
            </v-card-subtitle> -->
            <v-btn
              flat
              size="small"
              class="font-weight-semi-bold mt-0 mb-3 mr-2 ml-auto text-none text-white bg-red flatChipBorder"
              @click="deleteAvailability()"
            >
              Delete
            </v-btn>
          </div>
          <div class="d-flex align-center">
            <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
              Start Time:
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="selectedStartTime[index]"
              :items="startTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            ></v-select>
          </div>

          <div class="d-flex align-center">
            <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
              End Time:
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 ml-2 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="selectedEndTime[index]"
              :items="endTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>
          </div>
            <div class="mb-8"></div>
          </div>

        <div v-else>
          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
            Start Time
          </v-card-subtitle>
          <v-select
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="selectedStartTime"
            return-object
            :items="startTimeBoundaries"
            :rules="[(v) => !!v || 'This field is required']"
          ></v-select>
          <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
            End Time
          </v-card-subtitle>
          <v-select
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="selectedEndTime"
            return-object
            :items="endTimeBoundaries"
            :rules="[(v) => !!v || 'This field is required']"
          >
          </v-select>
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn v-if="availabilityData.length = 1 && props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-red flatChipBorder"
          @click="deleteAvailability()"
        >
          Delete
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateAvailability() : addAvailability()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-2 mr-auto text-none text-white bg-blue flatChipBorder"
          @click="emits('closeAvailabilityDialogEvent')"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
