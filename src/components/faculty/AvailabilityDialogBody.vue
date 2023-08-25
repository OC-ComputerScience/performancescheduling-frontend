<script setup>
import { ref, onMounted, watch } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import { get24HourTimeString } from "../../composables/timeFormatter";
import AvailabilityDataService from "../../services/AvailabilityDataService";

const emits = defineEmits([
  "addAvailabilityEvent",
  "updateAvailabilityEvent",
  "deleteAvailabilityEvent",
  "closeAvailabilityDialogEvent"
]);

const props = defineProps({
  availabilityData: { type: [Object], required: true },
  completeAvailabilityData: { type: [Object], required: true },
  eventData: { type: [Object], required: false },
  isEdit: { type: [Boolean], required: true },
});

console.log("availability data", props.availabilityData)
console.log("complete data", props.completeAvailabilityData)
console.log("event data", props.eventData)

const form = ref(null);

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const arrayStartTime = ref([]);
const arrayEndTime = ref([]);
const AvailabilityNoError = ref(true);
const deleteAvailabilityDialog = ref(false)

//These both const will store all the start/end times possibilities for the availability
const startTimeBoundaries = ref([]);
const endTimeBoundaries = ref([]);

const currentStartTime = ref([]);
const currentEndTime = ref([]);
const currentIndex = ref(null);

async function initializeCurrentVariables(index){
  currentIndex.value=index;
  currentStartTime.value=arrayStartTime.value[index]
  currentEndTime.value=arrayEndTime.value[index]
}

async function checkAvailability(){
  AvailabilityNoError.value = true;

  if(!((Array.isArray(props.completeAvailabilityData) && props.isEdit))){
    currentStartTime.value=arrayStartTime.value
    currentEndTime.value=arrayEndTime.value
  } 
console.log('start time current', currentStartTime)
  //converting the current start and end time
  const start = ref(get24HourTimeString(currentStartTime.value))
  const end = ref(get24HourTimeString(currentEndTime.value))
 
  //if there is more than one availability for this event, availabilityData is an Array type
  if(Array.isArray(props.completeAvailabilityData)){
    //start time cannot be greater or equal to end time
    if(start.value >= end.value){
      AvailabilityNoError.value = false;
    }
    //start and end time cannot overlap already set availabilities
    for(let i=0; i<props.completeAvailabilityData.length;i++){
      const originalStartTime = get24HourTimeString(props.completeAvailabilityData[i].startTime);
      const originalEndTime = get24HourTimeString(props.completeAvailabilityData[i].endTime);
      if(i!=currentIndex.value){
        if ((start.value >= originalStartTime) && (start.value <= originalEndTime)
            || (end.value >= originalStartTime) && (end.value <= originalEndTime)){  
          AvailabilityNoError.value = false;
          break;}}}
  }

  //if there is none or only one availability for this event
  else{
    if(start.value >= end.value){
      AvailabilityNoError.value = false;
    }
    if (props.completeAvailabilityData != null && !props.isEdit){
      const originalStartTime = get24HourTimeString(props.completeAvailabilityData.startTime);
      const originalEndTime = get24HourTimeString(props.completeAvailabilityData.endTime);
      if ((start.value >= originalStartTime) && (start.value <= originalEndTime)
            || (end.value >= originalStartTime) && (end.value <= originalEndTime)){
        AvailabilityNoError.value = false;}}
  }

  //if it is not breaking any of the rules
  if (AvailabilityNoError.value){
    props.isEdit ? updateAvailability() : addAvailability();
    }
}

async function addAvailability() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await AvailabilityDataService.create({
        eventId: props.eventData.id,
        userRoleId: currentRole.value.id,
        startTime: convertToMilitaryFormat(arrayStartTime.value),
        endTime: convertToMilitaryFormat(arrayEndTime.value)
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
      await updateStartTime();
      await updateEndTime();

      emits("updateAvailabilityEvent");
    }
  });
}

async function updateStartTime() {
  if(Array.isArray(props.availabilityData)){
    for(let i=0; i<props.availabilityData.length;i++){
      await AvailabilityDataService.update({
        id: props.availabilityData[i].id,
        startTime: convertToMilitaryFormat(arrayStartTime.value[i])
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  else{
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      startTime: convertToMilitaryFormat(arrayStartTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateEndTime() {
  if(Array.isArray(props.availabilityData)){

    for(let i=0; i<props.availabilityData.length;i++){
      await AvailabilityDataService.update({
        id: props.availabilityData[i].id,
        endTime: convertToMilitaryFormat(arrayEndTime.value[i])
      }).catch((err) => {
        console.log(err);
      });
    }
  }
  else{
    await AvailabilityDataService.update({
      id: props.availabilityData.id,
      endTime: convertToMilitaryFormat(arrayEndTime.value)
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function deleteAvailability(index) {
  if(Array.isArray(props.availabilityData)){
      await AvailabilityDataService.remove(props.availabilityData[index].id)
      .then(() => {
          emits("deleteAvailabilityEvent");
        })
      .catch((err) => {
        console.log(err);
      });
  }
  else{
    await AvailabilityDataService.remove(props.availabilityData.id)
    .then(() => {
          emits("deleteAvailabilityEvent");
        })
    .catch((err) => {
      console.log(err);
    });
  }
}

async function setAvailabilityTimes(){
  if(Array.isArray(props.availabilityData)){
    for(let i=0; i<props.availabilityData.length;i++){
      arrayStartTime.value.push(get12HourTimeStringFromString(props.availabilityData[i].startTime))
      arrayEndTime.value.push(get12HourTimeStringFromString(props.availabilityData[i].endTime))
    }
  }
  else{
    arrayStartTime.value = get12HourTimeStringFromString(props.availabilityData.startTime);
    arrayEndTime.value = get12HourTimeStringFromString(props.availabilityData.endTime);
  }
  console.log('array start time', arrayStartTime)
}

// Organizing time to be displayed when select the start and end time
async function setTimeBoundaries(){  
    // Starts with event start time and goes until event end time
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
    console.log('here 1', currentStartTime)
    if(currentStartTime.value != null){
      console.log('here 2')
      while (isTimeBefore(endTimeBoundaries.value[0], currentStartTime.value)){
        endTimeBoundaries.value.shift();
      }
    }
  }


// Convert the time to string, excluding the seconds
function parseTimeString(timeString) {
  const [hour, minute] = timeString.split(":");
  return { hour: parseInt(hour), minute: parseInt(minute)};
}

// Format the time to be displayed as "am" and "pm"
function formatTimeString({ hour, minute }) {
  const period = hour >= 12 ? "pm" : "am";
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

  if (period === 'pm' && hours !== 12) {
    hours += 12;
  } else if (period === 'am' && hours === 12) {
    hours = 0;
  }

  timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;

  return timeString;
}

//not working
watch(currentStartTime, async () => {
  await setTimeBoundaries();
});

onMounted(() => {
  setTimeBoundaries();
  setAvailabilityTimes();
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
        <div v-if="availabilityData.length > 1" v-for="(time,index) in arrayStartTime" @click="initializeCurrentVariables(index)">

          <div class="d-flex justify-center align-center">
            <v-card-subtitle class="pl-0 pb-2 font-weight-bold text-darkBlue" style="font-size: 18px;">
                Availability {{ index+1 }}
            </v-card-subtitle>
            <v-btn
              flat
              size="small"
              class="font-weight-semi-bold mt-0 mb-3 mr-2 ml-auto text-none text-white bg-maroon flatChipBorder"
              @click="deleteAvailabilityDialog = true"
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
              class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 my-0 mb-4"
              v-model="arrayStartTime[index]"
              :items="startTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            ></v-select>
            <v-card-subtitle class="ml-5 pl-0 pb-2 font-weight-semi-bold text-darkBlue">
              End Time:
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mb-4"
              v-model="arrayEndTime[index]"
              :items="endTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>
          </div>
          <div class="mb-8"></div>
        </div>

        <div v-else>
          <div class="d-flex align-center">
            <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
              Start Time
            </v-card-subtitle>
            <v-select
              color="white"
              class="font-weight-bold text-blue flatCardBorder pl-4 pr-2 my-0 mx-0"
              v-model="arrayStartTime"
              return-object
              :items="startTimeBoundaries"
              :rules="[(v) => !!v || 'This field is required']"
            ></v-select>
            <v-card-subtitle class="ml-5 pl-0 pb-2 font-weight-semi-bold text-darkBlue">
              End Time
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mb-4"
              v-model="arrayEndTime"
              return-object
              :items="endTimeBoundaries"
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>
          </div>
        </div>
        <div v-if="!AvailabilityNoError">            
            <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkRed">
              Please enter a valid availability time frame
            </v-card-subtitle>
          </div>
          <v-card-actions class="d-flex justify-center">
            <v-btn
              flat
              class="font-weight-semi-bold mt-0 text-none text-white bg-teal flatChipBorder"
              @click="checkAvailability()"
            >
              {{ props.isEdit ? "Save" : "Add" }}
            </v-btn>
            <v-btn
              flat
              class="font-weight-semi-bold mt-0 ml-3 text-none text-white bg-blue flatChipBorder"
              @click="emits('closeAvailabilityDialogEvent')"
            >
              Cancel
            </v-btn>
            <div v-if="!Array.isArray(completeAvailabilityData) && isEdit">
              <v-btn
                flat
                class="font-weight-semi-bold mt-0 ml-3 mr-auto text-none text-white bg-maroon flatChipBorder"
                @click="deleteAvailabilityDialog = true"
              >
                Delete
              </v-btn>
            </div>
          </v-card-actions>
      </v-card-text>
    </v-form>
  </v-card>

  <v-dialog v-model="deleteAvailabilityDialog" max-width="500">
    <v-card class="pa-2 bg-lightBlue flatCardBorder">
      <v-card-title class="pt-0 mt-0 text-blue font-weight-bold text-h6">Confirm Delete</v-card-title>
        <v-card-text class="font-weight-semi-bold text-darkBlue">
          Are you sure you want to delete this availability?
        </v-card-text>
        <v-card-actions>
          <v-btn                 
            flat
            class="font-weight-semi-bold mt-4 ml-2 ml-auto text-none text-white bg-blue flatChipBorder" 
            @click="deleteAvailabilityDialog = false">
            Cancel</v-btn>
          <v-btn
            flat
            class="font-weight-semi-bold mt-4 ml-2 mr-aut0 text-none text-white bg-maroon flatChipBorder" 
            @click="deleteAvailability(currentIndex)">
            Delete</v-btn>
        </v-card-actions>
  </v-card>
  </v-dialog>
</template>
