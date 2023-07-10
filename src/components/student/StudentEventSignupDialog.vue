<script setup>
import moment from "moment";
import { ref, onMounted, watch } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import StudentPieceDataService from "../../services/StudentPieceDataService.js";
import MajorDataService from "../../services/MajorDataService.js";
import AvailabilityDataService from "../../services/AvailabilityDataService.js";
import EventSignupDataService from "../../services/EventSignupDataService.js";

const emits = defineEmits(["closeDialogEvent"]);
const props = defineProps({
  eventData: { type: [Object], required: true },
});
const loginStore = useLoginStore();

// event variable
const eventTypeLabel = ref("");
// student instrument variables
const instruments = ref([]);
const selectedStudentInstrument = ref(null);
const selectedInstructor = ref(null);
const instructorName = ref(null);
const selectedAccompanist = ref(null);
const accompanistName = ref(null);
// student piece variables
const searchInput = ref("");
const studentPieces = ref([]);
const studentInstrumentStudentPieces = ref([]);
const filteredStudentPieces = ref([]);
const selectedStudentPieces = ref([]);
// timeslot variables
const isMusicMajor = ref(false);
const timeslotLength = ref(0);
const selectedTimeslot = ref("");
const timeslots = ref([]);
const instructorAvailability = ref([]);
const accompanistAvailability = ref([]);
const existingSignups = ref([]);

async function getData() {
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

function getTimeslotLength() {
  if (selectedStudentInstrument.value.instrument.type === "Vocal") {
    if (isMusicMajor.value) {
      timeslotLength.value =
        selectedStudentInstrument.value.privateHours == 1 ? 10 : 15;
    } else {
      timeslotLength.value =
        selectedStudentInstrument.value.privateHours == 1 ? 5 : 10;
    }
  } else {
    timeslotLength.value = 10;
  }
}

function getTimeslots() {
  timeslots.value = [];
  var startTime = moment(props.eventData.startTime, "HH:mm:ss");
  var endTime = moment(props.eventData.endTime, "HH:mm:ss");

  while (startTime <= endTime) {
    if (isAvailable(startTime)) {
      timeslots.value.push(new moment(startTime).format("HH:mma"));
    }
    startTime.add(timeslotLength.value, "minutes");
  }
}

function isAvailable(time) {
  const endTimeSlot = moment(time).add(timeslotLength.value, "minutes");
  const isInstructorAvailable = instructorAvailability.value.some(
    (availability) => {
      const startTimeMoment = moment(availability.startTime, "HH:mm:ss");
      const endTimeMoment = moment(availability.endTime, "HH:mm:ss");
      return (
        (time.isBetween(startTimeMoment, endTimeMoment) ||
          time.isSame(startTimeMoment)) &&
        (endTimeSlot.isBetween(startTimeMoment, endTimeMoment) ||
          endTimeSlot.isSame(endTimeMoment))
      );
    }
  );
  if (!isInstructorAvailable) {
    return false;
  }
  if (selectedStudentInstrument.value.instrument.type === "Instrument") {
    return true;
  }
  return accompanistAvailability.value.some((availability) => {
    const startTimeMoment = moment(availability.startTime, "HH:mm:ss");
    const endTimeMoment = moment(availability.endTime, "HH:mm:ss");
    return (
      (time.isBetween(startTimeMoment, endTimeMoment) ||
        time.isSame(startTimeMoment)) &&
      (endTimeSlot.isBetween(startTimeMoment, endTimeMoment) ||
        endTimeSlot.isSame(endTimeMoment))
    );
  });
}

function hasExistingSignup(timeslot) {
  return existingSignups.value.some(
    (signup) => signup.startTime <= timeslot && signup.endTime > timeslot
  );
}

function getChipClass(timeslot) {
  if (selectedTimeslot.value === timeslot) {
    return hasExistingSignup(timeslot)
      ? "bg-white text-blue pl-1"
      : "bg-blue text-white";
  } else if (hasExistingSignup(timeslot)) {
    return "bg-white text-mediumGray pl-1";
  } else {
    return "bg-teal text-white";
  }
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
  selectedAccompanist.value = selectedStudentInstrument.value.accompanistRole;
  accompanistName.value = selectedAccompanist.value
    ? selectedAccompanist.value.user.firstName +
      " " +
      selectedAccompanist.value.user.lastName
    : null;

  // get availability for instructor and accompanist
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

  if (selectedAccompanist.value) {
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

  // update student pieces
  selectedStudentPieces.value = [];
  studentInstrumentStudentPieces.value = studentPieces.value.filter(
    (studentPiece) =>
      studentPiece.studentInstrumentId == selectedStudentInstrument.value.id
  );
  searchStudentPieces();

  // update timeslots
  getTimeslotLength();
  getTimeslots();
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
            <v-text-field
              label="Accompanist"
              v-model="accompanistName"
              variant="plain"
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              readonly
            ></v-text-field>
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
              <v-col cols="5" class="pl-0">
                <v-card color="lightBlue" elevation="0">
                  <v-card-text class="text-blue py-2 font-weight-bold text-h8">
                    Selected: {{ selectedTimeslot }}
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-btn class="font-weight-bold text-none px-5" color="blue">
                  Request additional
                </v-btn>
              </v-col>
            </v-row>
            <v-row class="mt-6">
              <v-col class="pl-0">
                <v-card
                  style="height: 250px"
                  class="bg-lightTeal"
                  elevation="0"
                >
                  <v-card-text>
                    <v-row class="pl-4">
                      <v-col cols="3" v-for="timeslot in timeslots">
                        <v-chip
                          @click="selectedTimeslot = timeslot"
                          label
                          flat
                          class="font-weight-bold flatChipBorder"
                          :class="getChipClass(timeslot)"
                        >
                          <v-icon
                            icon="mdi-account"
                            :color="
                              selectedTimeslot == timeslot
                                ? 'blue'
                                : 'lightMaroon'
                            "
                            v-if="hasExistingSignup(timeslot)"
                          ></v-icon>
                          {{ timeslot }}
                        </v-chip>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
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
          @click="emits('closeDialogEvent')"
        >
          Signup
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
