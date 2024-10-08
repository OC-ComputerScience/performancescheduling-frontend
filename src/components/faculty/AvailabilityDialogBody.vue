<script setup>
//This code will be cleaned up after we have time to do it. Don't focus on the mess here :)
import { ref, onBeforeMount, watch, computed } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import { get24HourTimeString } from "../../composables/timeFormatter";
import AvailabilityDataService from "../../services/AvailabilityDataService";
import UserRoleDataService from "../../services/UserRoleDataService";

const emits = defineEmits([
  "addAvailabilityEvent",
  "updateAvailabilityEvent",
  "deleteAvailabilityEvent",
  "closeAvailabilityDialogEvent",
]);

const props = defineProps({
  availabilityData: { type: [Object], required: true },
  completeAvailabilityData: { type: [Object], required: false },
  eventData: { type: [Object], required: false },
  isEdit: { type: [Boolean], required: true },
});

const setAvailabilityData = ref(props.availabilityData);
const setCompleteAvailabilityData =
  props.completeAvailabilityData === undefined
    ? ref(props.availabilityData)
    : ref(props.completeAvailabilityData);

const form = ref(null);

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);
const isAdmin = computed(() => currentRole.value.roleId == 3);

const userRoles = ref([]);
const workingRole = ref(currentRole.value);
const userAvailability = ref([]);
const selectedRole = ref(null);

const arrayStartTime = ref([]);
const arrayEndTime = ref([]);
const AvailabilityNoError = ref(true);
const deleteAvailabilityDialog = ref(false);
const displayEventReady = ref(false);

//These both const will store all the start/end times possibilities for the availability
const startTimeBoundaries = ref([]);
const endTimeBoundaries = ref([]);

const currentStartTime = ref([]);
const currentEndTime = ref([]);
const currentIndex = ref(0);

async function initializeCurrentVariables(index) {
  currentIndex.value = index;
  currentStartTime.value = arrayStartTime.value[index];
  currentEndTime.value = arrayEndTime.value[index];
}

async function checkAvailability() {
  AvailabilityNoError.value = true;

  if (!(Array.isArray(setCompleteAvailabilityData.value) && props.isEdit)) {
    currentStartTime.value = arrayStartTime.value;
    currentEndTime.value = arrayEndTime.value;
  }

  Array.isArray(setAvailabilityData.value)
    ? (currentStartTime.value = arrayStartTime.value[currentIndex.value])
    : (currentStartTime.value = arrayStartTime.value);
  Array.isArray(setAvailabilityData.value)
    ? (currentEndTime.value = arrayEndTime.value[currentIndex.value])
    : (currentEndTime.value = arrayEndTime.value);

  //converting the current start and end time
  const start = ref(get24HourTimeString(currentStartTime.value));
  const end = ref(get24HourTimeString(currentEndTime.value));

  //if there is more than one availability for this event, setAvailabilityData is an Array type
  if (
    Array.isArray(setCompleteAvailabilityData.value) &&
    setCompleteAvailabilityData.value.length > 0
  ) {
    //start and end time cannot overlap already set availabilities
    for (let i = 0; i < setCompleteAvailabilityData.value.length; i++) {
      const originalStartTime = setCompleteAvailabilityData.value[
        i
      ].startTime.slice(0, -3);
      const originalEndTime = setCompleteAvailabilityData.value[
        i
      ].endTime.slice(0, -3);
      if (
        i != currentIndex.value ||
        (i == currentIndex.value && !props.isEdit)
      ) {
        if (
          (start.value >= originalStartTime && start.value < originalEndTime) ||
          (end.value > originalStartTime && end.value <= originalEndTime) ||
          (start.value <= originalStartTime && end.value >= originalEndTime) ||
          start.value == originalStartTime
        ) {
          AvailabilityNoError.value = false;
          break;
        }
      }
    }
  }

  //if there is none or only one availability for this event
  else {
    if (setCompleteAvailabilityData.value != null && !props.isEdit) {
      const originalStartTime = setCompleteAvailabilityData.value.startTime;
      const originalEndTime = setCompleteAvailabilityData.value.endTime;
      if (
        (start.value >= originalStartTime && start.value <= originalEndTime) ||
        (end.value >= originalStartTime && end.value <= originalEndTime) ||
        (start.value <= originalStartTime && end.value >= originalEndTime) ||
        start.value == originalStartTime
      ) {
        AvailabilityNoError.value = false;
      }
    }
  }

  //if it is not breaking any of the rules
  if (AvailabilityNoError.value) {
    props.isEdit ? updateAvailability() : addAvailability();
  }
}

async function addAvailability() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await AvailabilityDataService.create({
        eventId: props.eventData.id,
        userRoleId: workingRole.value.id,
        startTime: convertToMilitaryFormat(arrayStartTime.value),
        endTime: convertToMilitaryFormat(arrayEndTime.value),
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
    if (valid.valid) {
      await updateStartTime();
      await updateEndTime();

      emits("updateAvailabilityEvent");
    }
  });
}

async function updateStartTime() {
  if (Array.isArray(setAvailabilityData.value)) {
    for (let i = 0; i < setAvailabilityData.value.length; i++) {
      await AvailabilityDataService.update({
        id: setAvailabilityData.value[i].id,
        startTime: get24HourTimeString(arrayStartTime.value[i]),
      }).catch((err) => {
        console.log(err);
      });
    }
  } else {
    await AvailabilityDataService.update({
      id: setAvailabilityData.value.id,
      startTime: get24HourTimeString(arrayStartTime.value),
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function updateEndTime() {
  if (Array.isArray(setAvailabilityData.value)) {
    for (let i = 0; i < setAvailabilityData.value.length; i++) {
      await AvailabilityDataService.update({
        id: setAvailabilityData.value[i].id,
        endTime: get24HourTimeString(arrayEndTime.value[i]),
      }).catch((err) => {
        console.log(err);
      });
    }
  } else {
    await AvailabilityDataService.update({
      id: setAvailabilityData.value.id,
      endTime: get24HourTimeString(arrayEndTime.value),
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function deleteAvailability(index) {
  if (props.eventData.isReady && !isAdmin.value) {
    displayEventReady.value = true;
  } else {
    if (Array.isArray(setAvailabilityData.value)) {
      await AvailabilityDataService.remove(setAvailabilityData.value[index].id)
        .then(() => {
          emits("deleteAvailabilityEvent");
          deleteAvailabilityDialog.value = false;
          setAvailabilityData.value.splice(index, 1);
          arrayStartTime.value.splice(index, 1);
          arrayEndTime.value.splice(index, 1);
          if (setAvailabilityData.value.length == 0) {
            emits("refreshAvailabilitiesEvent");
          }
          currentIndex.value = 0;
          currentStartTime.value = arrayStartTime.value[0];
          currentEndTime.value = arrayEndTime.value[0];
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      await AvailabilityDataService.remove(setAvailabilityData.value.id)
        .then(() => {
          emits("deleteAvailabilityEvent");
          deleteAvailabilityDialog.value = false;
          deleteAvailabilityDialog.value = false;
          setAvailabilityData.value.splice(index, 1);
          arrayStartTime.value.splice(index, 1);
          arrayEndTime.value.splice(index, 1);
          if (setAvailabilityData.value.length == 0) {
            emits("refreshAvailabilitiesEvent");
          }
          currentIndex.value = 0;
          currentStartTime.value = arrayStartTime.value[0];
          currentEndTime.value = arrayEndTime.value[0];
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
}

async function setAvailabilityTimes() {
  if (Array.isArray(setAvailabilityData.value)) {
    for (let i = 0; i < setAvailabilityData.value.length; i++) {
      arrayStartTime.value.push(
        get12HourTimeStringFromString(setAvailabilityData.value[i].startTime)
      );
      arrayEndTime.value.push(
        get12HourTimeStringFromString(setAvailabilityData.value[i].endTime)
      );
    }
  } else {
    arrayStartTime.value = setAvailabilityData.value.startTime
      ? get12HourTimeStringFromString(setAvailabilityData.value.startTime)
      : "";

    arrayEndTime.value = setAvailabilityData.value.endTime
      ? get12HourTimeStringFromString(setAvailabilityData.value.endTime)
      : "";
  }
}

// Organizing time to be displayed when select the start and end time
async function setTimeBoundaries() {
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
    /*
    endTimeBoundaries.value.push(formatTimeString(endTime));

    if (currentStartTime.value != null) {
      while (isTimeBefore(endTimeBoundaries.value[0], currentStartTime.value)) {
        endTimeBoundaries.value.shift();
      }
      endTimeBoundaries.value.shift();
    }
    */
  }
  endTimeBoundaries.value.push(formatTimeString(endTime));
}

// Convert the time to string, excluding the seconds
function parseTimeString(timeString) {
  const [hour, minute] = timeString.split(":");
  return { hour: parseInt(hour), minute: parseInt(minute) };
}

// Format the time to be displayed as "am" and "pm"
function formatTimeString({ hour, minute }) {
  const period = hour >= 12 ? "pm" : "am";
  const hour12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return `${hour12.toString().padStart(2, "0")}:${minute
    .toString()
    .padStart(2, "0")} ${period}`;
}

// Comparison for while loop
function isTimeBefore(start, end) {
  return (
    start.hour < end.hour ||
    (start.hour === end.hour && start.minute < end.minute)
  );
}

function convertToMilitaryFormat(timeString) {
  const [time, period] = timeString.split(" ");
  let [hours, minutes] = time.split(":");

  hours = parseInt(hours);
  minutes = parseInt(minutes);

  if (period === "pm" && hours !== 12) {
    hours += 12;
  } else if (period === "am" && hours === 12) {
    hours = 0;
  }

  timeString = `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:00`;

  return timeString;
}

const filteredEndTimeOptions = computed(() => {
  if (arrayStartTime.value) {
    if (Array.isArray(setCompleteAvailabilityData.value) && props.isEdit) {
      if (currentStartTime.value.length != 0) {
        return endTimeBoundaries.value.filter(
          (endTime) =>
            get24HourTimeString(endTime) >
            get24HourTimeString(currentStartTime.value)
        );
      }
    } else {
      if (arrayStartTime.value == "") {
        return endTimeBoundaries.value;
      } else {
        return endTimeBoundaries.value.filter(
          (endTime) =>
            get24HourTimeString(endTime) >
            get24HourTimeString(arrayStartTime.value)
        );
      }
    }
  }
  return endTimeBoundaries.value;
});

async function getUsers() {
  await UserRoleDataService.getRolesForRoleId(
    2,
    "lastName,firstName",
    "ASC",
    "Active"
  )
    .then((response) => {
      userRoles.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  await UserRoleDataService.getRolesForRoleId(
    4,
    "lastName,firstName",
    "ASC",
    "Active"
  )
    .then((response) => {
      response.data.forEach((role) => {
        role.user.lastName = role.user.lastName + " (Accompanist)";
      });
      userRoles.value = userRoles.value.concat(response.data);
    })
    .catch((err) => {
      console.log(err);
    });
}
async function getAvailforUserRoleAndEvent() {
  await AvailabilityDataService.getByUserRoleAndEvent(
    workingRole.value.id,
    props.eventData.id
  )
    .then((response) => {
      userAvailability.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
async function setupUserData() {
  arrayStartTime.value = [];
  arrayEndTime.value = [];
  currentStartTime.value = [];
  currentEndTime.value = [];
  await getAvailforUserRoleAndEvent();

  if (props.isEdit) {
    setAvailabilityData.value = userAvailability.value;
    setCompleteAvailabilityData.value = userAvailability.value;
  } else {
    setAvailabilityData.value = { startTime: null, endTime: null };
    setCompleteAvailabilityData.value = userAvailability.value;
  }

  setAvailabilityTimes();
}

watch(selectedRole, async () => {
  workingRole.value = selectedRole.value;
  await setupUserData();
});

onBeforeMount(() => {
  setTimeBoundaries();
  setAvailabilityTimes();
  getUsers();
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
        </v-row>
      </v-card-title>
      <div v-if="isAdmin">
        <v-card-subtitle class="pl-0 pb-2 font-weight-semi-bold text-darkBlue">
          Instructor/Acompanist
        </v-card-subtitle>
        <v-autocomplete
          clearable
          color="darkBlue"
          variant="plain"
          class="font-weight-bold text-blue pt-0 mt-0 bg-white flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
          v-model="selectedRole"
          :items="userRoles"
          :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
          item-value="id"
          return-object
          :rules="[(v) => !!v || 'This field is required']"
        >
        </v-autocomplete>
      </div>
      <v-card-text class="pt-4" v-if="isAdmin && selectedRole == null">
        <v-card-actions class="d-flex justify-center">
          <v-spacer></v-spacer>
          <v-btn
            flat
            class="font-weight-semi-bold mt-0 ml-3 text-none text-white bg-red flatChipBorder"
            @click="emits('closeAvailabilityDialogEvent')"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card-text>
      <v-card-text
        class="pt-4"
        v-if="!isAdmin || (isAdmin && selectedRole != null)"
      >
        <div
          v-if="Array.isArray(setAvailabilityData)"
          v-for="(time, index) in arrayStartTime"
          @click="initializeCurrentVariables(index)"
        >
          <div class="d-flex justify-center align-center">
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-bold text-darkBlue"
              style="font-size: 18px"
            >
              Availability {{ index + 1 }}
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
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Start Time:
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mx-0 mb-4"
              v-model="arrayStartTime[index]"
              :items="startTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            ></v-select>
            <v-card-subtitle
              class="ml-5 pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              End Time:
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mb-4"
              v-model="arrayEndTime[index]"
              :items="filteredEndTimeOptions"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>
          </div>
          <div class="mb-8"></div>
        </div>

        <div v-else>
          <div class="d-flex align-center">
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Start Time
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mx-0 mb-4"
              v-model="arrayStartTime"
              :items="startTimeBoundaries"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            ></v-select>
            <v-card-subtitle
              class="ml-5 pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              End Time
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue bg-white flatCardBorder pl-4 pr-2 my-0 mx-0 mb-4"
              v-model="arrayEndTime"
              return-object
              :items="filteredEndTimeOptions"
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>
          </div>
        </div>
        <div v-if="!AvailabilityNoError">
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-red"
            style="white-space: normal; word-wrap: break-word"
          >
            Time slot overlaps with the time for a previous selected
            availability
          </v-card-subtitle>
        </div>
        <v-card-actions class="d-flex justify-center">
          <v-spacer></v-spacer>

          <v-btn
            flat
            class="font-weight-semi-bold mt-0 text-none text-white bg-teal flatChipBorder"
            @click="checkAvailability()"
          >
            {{ props.isEdit ? "Save" : "Add" }}
          </v-btn>
          <v-btn
            flat
            class="font-weight-semi-bold mt-0 ml-3 text-none text-white bg-red flatChipBorder"
            @click="emits('closeAvailabilityDialogEvent')"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card-text>
    </v-form>
  </v-card>

  <v-dialog v-model="deleteAvailabilityDialog" max-width="500">
    <v-card class="pa-2 bg-lightBlue flatCardBorder">
      <v-card-title class="pt-0 mt-0 text-blue font-weight-bold text-h6"
        >Confirm Delete</v-card-title
      >
      <v-card-text class="font-weight-semi-bold text-darkBlue">
        Are you sure you want to delete this availability?
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn
          flat
          class="font-weight-semi-bold mt-4 ml-2 mr-4 text-none text-white bg-maroon flatChipBorder"
          @click="deleteAvailability(currentIndex)"
        >
          Delete</v-btn
        >
        <v-btn
          flat
          class="font-weight-semi-bold mt-4 ml-2 ml-4 text-none text-white bg-red flatChipBorder"
          @click="deleteAvailabilityDialog = false"
        >
          Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="displayEventReady" max-width="500">
    <v-card class="pa-2 bg-lightBlue flatCardBorder">
      <v-card-title class="pt-0 mt-0 text-blue font-weight-bold text-h6"
        >Cannot Delete</v-card-title
      >
      <v-card-text class="font-weight-semi-bold text-darkBlue">
        This event is already visible for students. Please contact the admin if
        you want to change your availability time.
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-4 ml-2 ml-auto text-none text-white bg-blue flatChipBorder"
          @click="
            displayEventReady = false;
            deleteAvailabilityDialog = false;
          "
        >
          Back</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
