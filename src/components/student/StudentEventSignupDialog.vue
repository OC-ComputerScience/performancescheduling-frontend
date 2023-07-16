<script setup>
import { ref, onMounted, watch } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import {
  generateTimeSlots,
  addMinsToTime,
} from "../../composables/timeManipulator";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import StudentPieceDataService from "../../services/StudentPieceDataService.js";
import MajorDataService from "../../services/MajorDataService.js";
import AvailabilityDataService from "../../services/AvailabilityDataService.js";
import EventSignupDataService from "../../services/EventSignupDataService.js";
import StudentInstrumentSignupDataService from "../../services/StudentInstrumentSignupDataService.js";
import UserRoleDataService from "../../services/UserRoleDataService.js";
import UserNotificationDataService from "../../services/UserNotificationDataService.js";

const emits = defineEmits(["closeDialogEvent"]);
const props = defineProps({
  eventData: { type: [Object], required: true },
});
const loginStore = useLoginStore();

// event variable
const eventTypeLabel = ref("");
const errorMessage = ref("");
const groupSignup = ref(false);
const activeAccompanists = ref([]);
// student instrument variables
const instruments = ref([]);
const selectedStudentInstrument = ref(null);
const selectedInstructor = ref(null);
const instructorName = ref(null);
const selectedAccompanist = ref(null);
// student piece variables
const searchInput = ref("");
const studentPieces = ref([]);
const studentInstrumentStudentPieces = ref([]);
const filteredStudentPieces = ref([]);
const selectedStudentPieces = ref([]);
// timeslot variables
const isMusicMajor = ref(false);
const timeslotLength = ref(0);
const selectedTimeslot = ref(null);
const timeslots = ref([]);
const instructorAvailability = ref([]);
const accompanistAvailability = ref([]);
const existingSignups = ref([]);
// confirmation dialog variables
const existingSignup = ref(null);
const confimationDialog = ref(false);
const otherSignupDialog = ref(false);
const dialogMessage = ref("");
// snackbar variables
const snackbar = ref(false);
const snackbarMessage = ref("");

async function getData() {
  // due to the watch statements, accompanists must be gotten before student instruments
  await UserRoleDataService.getRolesForRoleId(4)
    .then((response) => {
      activeAccompanists.value = response.data;
      activeAccompanists.value.map(
        (accompanist) =>
          (accompanist.fullName =
            accompanist.user.firstName + " " + accompanist.user.lastName)
      );
    })
    .catch((err) => {
      console.log(err);
    });

  await StudentInstrumentDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      if (props.eventData.eventType.instrumentType === "Instrument") {
        instruments.value = response.data.filter(
          (data) => data.instrument.type === "Instrument"
        );
      } else if (props.eventData.eventType.instrumentType === "Vocal") {
        instruments.value = response.data.filter(
          (data) => data.instrument.type === "Vocal"
        );
      } else {
        instruments.value = response.data;
      }

      selectedStudentInstrument.value = instruments.value[0];
    })
    .catch((e) => {
      console.log(e);
    });

  await StudentPieceDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      studentPieces.value = response.data.filter(
        (studentPiece) => studentPiece.semesterId === props.eventData.semesterId
      );

      studentPieces.value.forEach(function (studentPiece) {
        var fullName = "";
        if (studentPiece.piece.composer.lastName) {
          fullName = studentPiece.piece.composer.lastName;
          if (studentPiece.piece.composer.firstName) {
            fullName += ", " + studentPiece.piece.composer.firstName;
          }
        } else {
          fullName = studentPiece.piece.composer.firstName;
        }
        studentPiece.piece.composer.fullName = fullName;
      });

      filteredStudentPieces.value = studentPieces.value;
    })
    .catch((e) => {
      console.log(e);
    });

  await MajorDataService.getById(loginStore.currentRole.majorId)
    .then((response) => {
      isMusicMajor.value = response.data.isMusicMajor;
    })
    .catch((e) => {
      console.log(e);
    });

  await EventSignupDataService.getByEvent(props.eventData.id)
    .then((response) => {
      existingSignups.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });
}

function searchStudentPieces() {
  filteredStudentPieces.value = studentInstrumentStudentPieces.value;
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredStudentPieces.value = filteredStudentPieces.value.filter(
    (studentPiece) => {
      return (
        studentPiece.piece.title
          .toLowerCase()
          .includes(searchInput.value.toLowerCase()) ||
        studentPiece.piece.composer.fullName
          .toLowerCase()
          .includes(searchInput.value.toLowerCase())
      );
    }
  );
}

function selectStudentPiece(studentPiece) {
  if (!isStudentPieceSelected(studentPiece)) {
    selectedStudentPieces.value.push(studentPiece);
  } else {
    selectedStudentPieces.value.splice(
      selectedStudentPieces.value.findIndex((x) => x.id === studentPiece.id),
      1
    );
  }
}

function isStudentPieceSelected(studentPiece) {
  return (
    selectedStudentPieces.value.findIndex((x) => x.id === studentPiece.id) !==
    -1
  );
}

function generateTimeslots() {
  timeslots.value = generateTimeSlots(
    props.eventData.startTime,
    props.eventData.endTime,
    props.eventData.eventType.defaultSlotDuration
  );

  timeslots.value.forEach((timeslot) => {
    timeslot.hasExistingSignup = hasExistingSignup(
      timeslot.time,
      addMinsToTime(
        props.eventData.eventType.defaultSlotDuration,
        timeslot.time
      )
    );
  });
  disableTimeslots();
}

// Disabled timeslots are determined by the length the user needs to sign up for
function disableTimeslots() {
  timeslots.value.forEach((timeslot) => {
    const timeslotEnd = addMinsToTime(timeslotLength.value, timeslot.time);
    timeslot.isDisabled =
      timeslotEnd >
        addMinsToTime(
          props.eventData.eventType.defaultSlotDuration,
          timeslots.value[timeslots.value.length - 1].time
        ) ||
      (hasExistingSignup(timeslot.time, timeslotEnd) &&
        findExistingSignup(timeslot.time, timeslotEnd) == undefined) ||
      !withinAvailability(timeslot.time, timeslotEnd);
  });
}

function withinAvailability(timeslotStart, timeslotEnd) {
  var isAvailable = instructorAvailability.value.some(
    (avail) => avail.startTime <= timeslotStart && avail.endTime >= timeslotEnd
  );

  if (isAvailable && accompanistAvailability.value.length > 0) {
    isAvailable = accompanistAvailability.value.some(
      (avail) =>
        avail.startTime <= timeslotStart && avail.endTime >= timeslotEnd
    );
  }

  return isAvailable;
}

function getTimeslotLength() {
  if (props.eventData.eventType.slotType === "Fixed") {
    timeslotLength.value = props.eventData.eventType.defaultSlotDuration;
  } else {
    if (selectedStudentInstrument.value.instrument.type === "Vocal") {
      if (isMusicMajor.value) {
        timeslotLength.value =
          selectedStudentInstrument.value.privateHours == 1 ? 10 : 15;
      } else {
        timeslotLength.value =
          selectedStudentInstrument.value.privateHours == 1 ? 5 : 10;
      }
    } else {
      timeslotLength.value = props.eventData.eventType.defaultSlotDuration;
    }
  }
}

function hasExistingSignup(timeslotStart, timeslotEnd) {
  return existingSignups.value.some(
    (signup) => signup.endTime > timeslotStart && timeslotEnd > signup.startTime
  );
}

function findExistingSignup(timeslotStart, timeslotEnd) {
  return existingSignups.value.find(
    (signup) =>
      signup.startTime === timeslotStart && signup.endTime === timeslotEnd
  );
}

function getChipClass(timeslot) {
  // if the timeslot is selected
  if (selectedTimeslot.value === timeslot) {
    return timeslot.hasExistingSignup
      ? "bg-white text-blue pl-1"
      : "bg-blue text-white";
  }

  // if the timeslot is already reserved
  if (timeslot.hasExistingSignup) {
    return "bg-maroon text-white pl-1";
  }

  // if the timeslot would not provide enough time for the student
  if (timeslot.isDisabled) {
    return "bg-white text-mediumGray";
  }

  // default
  return "bg-teal text-white";
}

function openDialog() {
  // validation checks
  if (selectedStudentInstrument.value == null) {
    errorMessage.value = "Please select an instrument.";
    return;
  }
  if (selectedStudentPieces.value.length == 0) {
    errorMessage.value = "Please select at least one piece.";
    return;
  }
  if (selectedTimeslot.value == null) {
    errorMessage.value = "Please select a timeslot.";
    return;
  }

  // reset error message
  errorMessage.value = "";

  const timeslotEndTime = addMinsToTime(
    timeslotLength.value,
    selectedTimeslot.value.time
  );

  existingSignup.value = findExistingSignup(
    selectedTimeslot.value.time,
    timeslotEndTime
  );

  if (existingSignup.value == null) {
    // there is no existing signup

    // set confirmation message
    dialogMessage.value = `Event: ${formatDate(
      props.eventData.date
    )} (${new Date(props.eventData.date).toLocaleDateString("default", {
      weekday: "long",
      timeZone: "UTC",
    })})
    \nTimeslot: ${get12HourTimeStringFromString(
      selectedTimeslot.value.time
    )} - ${get12HourTimeStringFromString(timeslotEndTime)}
    \nInstrument: ${selectedStudentInstrument.value.instrument.name}`;

    // open confirmation dialog
    confimationDialog.value = true;
  } else {
    // there is an existing signup
    const otherStudentsInSingup =
      existingSignup.value.studentInstrumentSignups.map(
        (x) =>
          x.studentInstrument.studentRole.user.firstName +
          " " +
          x.studentInstrument.studentRole.user.lastName
      );
    var studentsInSignup = "";
    if (otherStudentsInSingup.length == 1) {
      studentsInSignup = otherStudentsInSingup[0];
    } else if (otherStudentsInSingup.length == 2) {
      //joins all with "and" but no commas
      studentsInSignup = otherStudentsInSingup.join(" and ");
    } else {
      //joins all with commas, but last one gets ", and"
      studentsInSignup =
        otherStudentsInSingup.slice(0, -1).join(", ") +
        ", and " +
        otherStudentsInSingup.slice(-1);
    }

    if (existingSignup.value.isGroupEvent) {
      // set confirmation message
      dialogMessage.value = `Event: ${formatDate(
        props.eventData.date
      )} (${new Date(props.eventData.date).toLocaleDateString("default", {
        weekday: "long",
        timeZone: "UTC",
      })})
    \nTimeslot: ${get12HourTimeStringFromString(
      selectedTimeslot.value.time
    )} - ${get12HourTimeStringFromString(timeslotEndTime)}
    \nInstrument: ${selectedStudentInstrument.value.instrument.name}
    \nWith: ${studentsInSignup}`;

      // open confirmation dialog
      confimationDialog.value = true;
    } else {
      dialogMessage.value = `Event: ${formatDate(
        props.eventData.date
      )} (${new Date(props.eventData.date).toLocaleDateString("default", {
        weekday: "long",
        timeZone: "UTC",
      })})
    \nTimeslot: ${get12HourTimeStringFromString(
      selectedTimeslot.value.time
    )} - ${get12HourTimeStringFromString(timeslotEndTime)}
    \nIs already reserved by ${studentsInSignup}`;
      // open other signup dialog
      otherSignupDialog.value = true;
    }
  }
}

async function confirmSignup() {
  var eventSignupId;
  if (hasExistingSignup(selectedTimeslot.value)) {
    eventSignupId = existingSignups.value.find(
      (signup) =>
        signup.startTime <= selectedTimeslot.value &&
        signup.endTime > selectedTimeslot.value
    ).id;
  } else {
    const eventSignupData = {
      startTime: selectedTimeslot.time,
      endTime: addMinsToTime(selectedTimeslot.value, timeslotLength.value),
      eventId: props.eventData.id,
    };
    await EventSignupDataService.create(eventSignupData)
      .then((response) => {
        eventSignupId = response.data.id;
      })
      .catch((e) => {
        console.log(e);
      });
  }
  const studentInstrumentSignupData = {
    eventSignupId: eventSignupId,
    studentInstrumentId: selectedStudentInstrument.value.id,
    instructorRoleId: selectedInstructor.value.id,
    accompanistRoleId: selectedAccompanist.value
      ? selectedAccompanist.value.id
      : null,
  };

  await StudentInstrumentSignupDataService.create(studentInstrumentSignupData)
    .then(() => {
      confimationDialog.value = false;
      emits("closeDialogEvent");
    })
    .catch((e) => {
      console.log(e);
    });
}

function requestTimeslotFromStudent() {
  existingSignup.value.studentInstrumentSignups.forEach((student) => {
    const data = {
      text: `${loginStore.user.firstName} ${
        loginStore.user.lastName
      } has requested to join your timeslot for ${formatDate(
        props.eventData.date
      )} (${new Date(props.eventData.date).toLocaleDateString("default", {
        weekday: "long",
        timeZone: "UTC",
      })})`,
      data: `eventId=${props.eventData.id}&eventSignupId=${existingSignup.value.id}`,
      isCompleted: false,
      userRoleId: student.studentInstrument.studentRole.id,
      notificationId: 3,
    };
    UserNotificationDataService.create(data).catch((e) => {
      console.log(e);
    });
  });

  otherSignupDialog.value = false;
  snackbar.value = true;
  snackbarMessage.value = "Request sent";
}

async function requestTimeslotsFromAdmin() {
  var admins = [];
  await UserRoleDataService.getRolesForRoleId(3)
    .then((response) => {
      admins = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  admins.forEach((admin) => {
    const data = {
      text: `${loginStore.user.firstName} ${
        loginStore.user.lastName
      } has requested you create more timeslots for ${formatDate(
        props.eventData.date
      )} (${new Date(props.eventData.date).toLocaleDateString("default", {
        weekday: "long",
        timeZone: "UTC",
      })})`,
      data: `eventId=${props.eventData.id}`,
      isCompleted: false,
      userRoleId: admin.id,
      notificationId: 1,
    };
    UserNotificationDataService.create(data).catch((e) => {
      console.log(e);
    });
  });

  snackbar.value = true;
  snackbarMessage.value = "Request sent";
}

async function requestAvailabilityFromUserRole(userRole) {
  const data = {
    text: `${loginStore.user.firstName} ${
      loginStore.user.lastName
    } has requested you enter availability for ${formatDate(
      props.eventData.date
    )} (${new Date(props.eventData.date).toLocaleDateString("default", {
      weekday: "long",
      timeZone: "UTC",
    })})`,
    data: `eventId=${props.eventData.id}`,
    isCompleted: false,
    userRoleId: userRole.id,
    notificationId: 2,
  };
  UserNotificationDataService.create(data).catch((e) => {
    console.log(e);
  });

  snackbar.value = true;
  snackbarMessage.value = "Request sent";
}

watch(selectedStudentInstrument, async () => {
  if (selectedStudentInstrument.value == null) {
    return;
  }

  // update instructor and accompanist
  selectedInstructor.value = selectedStudentInstrument.value.instructorRole;
  instructorName.value = selectedInstructor.value
    ? selectedInstructor.value.user.firstName +
      " " +
      selectedInstructor.value.user.lastName
    : null;

  // get availability for instructor
  await AvailabilityDataService.getByUserRoleAndEvent(
    selectedInstructor.value.id,
    props.eventData.id
  )
    .then((response) => {
      instructorAvailability.value = response.data;
    })
    .catch((e) => {
      console.log(e);
    });

  selectedAccompanist.value = activeAccompanists.value.find(
    (accompanist) =>
      accompanist.id == selectedStudentInstrument.value.accompanistRole.id
  );

  // update student pieces
  selectedStudentPieces.value = [];
  studentInstrumentStudentPieces.value = studentPieces.value.filter(
    (studentPiece) =>
      studentPiece.studentInstrumentId == selectedStudentInstrument.value.id
  );
  searchStudentPieces();

  getTimeslotLength();
});

watch(selectedAccompanist, async () => {
  if (selectedAccompanist.value != null) {
    selectedAccompanist.value.fullName =
      selectedAccompanist.value.user.firstName +
      " " +
      selectedAccompanist.value.user.lastName;

    await AvailabilityDataService.getByUserRoleAndEvent(
      selectedAccompanist.value.id,
      props.eventData.id
    )
      .then((response) => {
        accompanistAvailability.value = response.data;
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    accompanistAvailability.value = [];
  }
  disableTimeslots();
});

onMounted(async () => {
  await getData();
  eventTypeLabel.value =
    props.eventData.eventType.instrumentType === "Both"
      ? "Vocal & Instrumental Event"
      : props.eventData.eventType.instrumentType === "Vocal"
      ? "Vocal Event"
      : "Instrumental Event";

  getTimeslotLength();

  generateTimeslots();
});
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-text>
        <v-row class="mt-1">
          <v-card-title class="font-weight-bold text-maroon text-h4">
            {{ eventData.name }}
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card color="lightMaroon" elevation="0">
            <v-card-text>
              <v-row class="pt-0 mt-0">
                <div class="text-maroon mx-2 mb-2 text-h7">
                  <v-icon icon="mdi-information"></v-icon>
                  {{ eventTypeLabel }}
                </div>
                <div class="text-maroon mx-2 text-h7">
                  <v-icon icon="mdi-calendar"></v-icon>
                  {{ formatDate(eventData.date) }}
                </div>
                <div class="text-maroon mx-2 text-h7">
                  <v-icon icon="mdi-clock"></v-icon>
                  {{
                    get12HourTimeStringFromString(eventData.startTime) +
                    " - " +
                    get12HourTimeStringFromString(eventData.endTime)
                  }}
                </div>
              </v-row>
            </v-card-text>
          </v-card>
        </v-row>
        <v-row class="mt-6">
          <v-col>
            <v-select
              label="Instrument"
              v-model="selectedStudentInstrument"
              :items="instruments"
              item-title="instrument.name"
              variant="plain"
              return-object
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            ></v-select>
          </v-col>
          <v-col>
            <v-text-field
              label="Instructor"
              v-model="instructorName"
              text-label="Instructor"
              variant="plain"
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              readonly
            ></v-text-field
          ></v-col>
          <v-col>
            <v-select
              clearable
              label="Accompanist"
              v-model="selectedAccompanist"
              :items="activeAccompanists"
              item-title="fullName"
              variant="plain"
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              return-object
            ></v-select>
          </v-col>
        </v-row>
        <v-row class="ml-1">
          <v-col cols="6">
            <v-row class="font-weight-bold text-maroon text-h6">
              Musical Selection
            </v-row>
            <v-row>
              <v-col cols="6" class="pl-0">
                <input
                  type="text"
                  v-model="searchInput"
                  @input="searchStudentPieces"
                  class="pa-3 mainCardBorder text-blue bg-lightBlue font-weight-bold"
                  style="outline: none"
                  append-icon="mdi-magnify"
                  placeholder="Search Repertoire"
                  single-line
                  hide-details
                />
              </v-col>
              <v-col cols="5">
                <v-btn
                  class="font-weight-bold text-none"
                  color="blue"
                  @click="emits('openDialogEvent')"
                >
                  Add To Repertoire
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-5">
              <v-col cols="11" class="pl-0">
                <v-list
                  style="height: 250px"
                  class="overflow-y-auto bg-lightBlue"
                >
                  <v-list-item
                    v-for="(studentPiece, index) in filteredStudentPieces"
                    :key="index"
                  >
                    <v-card
                      v-bind:class="{
                        'bg-blue': isStudentPieceSelected(studentPiece),
                        'bg-white': !isStudentPieceSelected(studentPiece),
                      }"
                      @click="selectStudentPiece(studentPiece)"
                    >
                      <v-card-text>
                        <v-row
                          no-gutters
                          class="text-blue font-weight-semi-bold"
                          v-bind:class="{
                            'text-white': isStudentPieceSelected(studentPiece),
                          }"
                        >
                          {{ studentPiece.piece.title }}
                        </v-row>
                        <v-row no-gutters class="text-teal">
                          {{ studentPiece.piece.composer.fullName }}
                        </v-row>
                      </v-card-text>
                    </v-card>
                  </v-list-item>
                </v-list>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="6">
            <v-row>
              <div class="font-weight-bold text-h6 text-maroon">
                Timeslots Available
              </div>
              <v-card color="lightMaroon" elevation="0" class="ml-2">
                <v-card-text
                  class="mt-1 py-0 font-weight-semi-bold text-maroon"
                >
                  {{ timeslotLength }} Min Timeslot Length
                </v-card-text>
              </v-card>
            </v-row>
            <v-row>
              <v-col cols="6" class="pl-0">
                <v-card color="lightBlue" elevation="0">
                  <v-card-text
                    class="text-blue py-2 font-weight-bold"
                    style="font-size: 0.95em"
                  >
                    <div v-if="selectedTimeslot != null">
                      Selected:
                      {{
                        selectedTimeslot.timeText +
                        "-" +
                        get12HourTimeStringFromString(
                          addMinsToTime(timeslotLength, selectedTimeslot.time)
                        )
                      }}
                    </div>
                    <div v-else>Selected: None</div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-btn
                  v-if="
                    instructorAvailability.length > 0 &&
                    (selectedAccompanist == null ||
                      accompanistAvailability.length > 0)
                  "
                  @click="requestTimeslotsFromAdmin"
                  class="font-weight-bold text-none px-5"
                  color="blue"
                >
                  Request additional
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-6">
              <v-col class="pl-0">
                <v-card
                  style="height: 175px"
                  class="overflow-y-auto bg-lightTeal"
                  elevation="0"
                >
                  <v-card-text
                    v-if="
                      instructorAvailability.length > 0 &&
                      (selectedAccompanist == null ||
                        accompanistAvailability.length > 0)
                    "
                  >
                    <v-row class="pl-4">
                      <v-col cols="3" v-for="timeslot in timeslots">
                        <v-chip
                          @click="
                            if (!timeslot.isDisabled)
                              selectedTimeslot = timeslot;
                          "
                          label
                          flat
                          class="font-weight-semi-bold flatChipBorder"
                          :class="getChipClass(timeslot)"
                        >
                          <v-icon
                            icon="mdi-account"
                            size="small"
                            :color="
                              selectedTimeslot == timeslot
                                ? 'blue'
                                : 'lightMaroon'
                            "
                            v-if="timeslot.hasExistingSignup"
                          ></v-icon>
                          {{ timeslot.timeText }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-text v-else>
                    <v-row v-if="instructorAvailability.length == 0">
                      <v-col cols="6">
                        <div
                          class="font-weight-semi-bold text-maroon text-body-1"
                        >
                          {{ instructorName }} has not setup availability for
                          this event.
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          class="font-weight-bold text-none px-5"
                          color="blue"
                          @click="
                            requestAvailabilityFromUserRole(selectedInstructor)
                          "
                        >
                          Request availability
                        </v-btn>
                      </v-col>
                    </v-row>
                    <v-row
                      v-if="
                        selectedAccompanist != null &&
                        accompanistAvailability.length == 0
                      "
                    >
                      <v-col cols="6">
                        <div
                          class="font-weight-semi-bold text-maroon text-body-1"
                        >
                          {{ selectedAccompanist.fullName }} has not setup
                          availability for this event.
                        </div>
                      </v-col>
                      <v-col cols="6">
                        <v-btn
                          class="font-weight-bold text-none px-5"
                          color="blue"
                          @click="
                            requestAvailabilityFromUserRole(selectedAccompanist)
                          "
                        >
                          Request availability
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-checkbox
                v-model="groupSignup"
                label="Allow other students to signup with you"
                class="text-body-1 font-weight-bold text-darkBlue"
              ></v-checkbox>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <div class="font-weight-bold mr-2 text-red text-h6">
          {{ errorMessage }}
        </div>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-lightMaroon text-maroon"
          @click="emits('closeDialogEvent')"
        >
          Cancel
        </v-btn>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          @click="openDialog"
        >
          Signup
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-dialog v-model="confimationDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold text-maroon">
        <div v-if="existingSignup == null">Confirm Signup</div>
        <div v-else>Confirm Group Signup</div>
      </v-card-title>
      <v-card-text
        class="text-h8 font-weight-semi-bold text-blue"
        style="white-space: pre"
      >
        {{ dialogMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="confimationDialog = false"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-lightMaroon text-maroon"
          >Cancel</v-btn
        >
        <v-btn
          @click="confirmSignup"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
        >
          <div v-if="existingSignup == null">Confirm</div>
          <div v-else>Confirm Group Signup</div>
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-dialog v-model="otherSignupDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold text-maroon">
        This timeslot is already taken
      </v-card-title>
      <v-card-text
        class="text-h8 font-weight-semi-bold text-blue"
        style="white-space: pre"
      >
        {{ dialogMessage }}
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="otherSignupDialog = false"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-lightMaroon text-maroon"
          >Cancel</v-btn
        >
        <v-btn
          @click="requestTimeslotFromStudent"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          >Request This Timeslot</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
  <v-snackbar v-model="snackbar" color="success" :timeout="3000" right>
    <v-icon left>mdi-check</v-icon>{{ snackbarMessage }}
  </v-snackbar>
</template>
