<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../stores/LoginStore.js";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";

import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";
import StudentPieceDataService from "../../services/StudentPieceDataService.js";
import EventSignupDataService from "../../services/EventSignupDataService.js";
import StudentInstrumentSignupDataService from "../../services/StudentInstrumentSignupDataService.js";
import UserRoleDataService from "../../services/UserRoleDataService.js";
import EventSignupPieceDataService from "../../services/EventSignupPieceDataService.js";
import StudentPieceDialogBody from "../student/repertoire/StudentPieceDialogBody.vue";

const emits = defineEmits(["closeDialogEvent", "refreshEvents"]);
const props = defineProps({
  eventData: { type: [Object], required: true },
  eventSignUpData: { type: [Object], required: true },
  studentInstrumentSignupData: { type: [Object], required: true },
});

const eventSignups = ref([]);
const eventSignup = ref(null);
const studentsInSignup = ref("");
const studentInstrumentSignup = ref(
  Object.assign({}, props.studentInstrumentSignupData)
);
const loginStore = useLoginStore();

const accompianist =
  studentInstrumentSignup.value.accompanistRoleSignup === null
    ? "None"
    : studentInstrumentSignup.value.accompanistRoleSignup.user.firstName +
      " " +
      studentInstrumentSignup.value.accompanistRoleSignup.user.lastName;
const instructor =
  studentInstrumentSignup.value.instructorRoleSignup.user.firstName +
  " " +
  studentInstrumentSignup.value.instructorRoleSignup.user.lastName;
const eventTypeLabel = ref("");
const errorMessage = ref("");

const groupSignup = ref(studentInstrumentSignup.value.eventSignup.isGroupEvent);

// student piece variables

const studentPieces = ref([]);

const filteredStudentPieces = ref([]);
const selectedStudentPieces = ref([]);

// confirmation dialog variables

const confimationDialog = ref(false);

const addStudentPieceDialog = ref(false);
// snackbar variables
const snackbar = ref({ show: false, color: "", message: "" });

async function getData() {
  await getStudentPieces();
  await getEventSignup();
}

async function getEventSignup() {
  await EventSignupDataService.getByEvent(props.eventData.id)
    .then((response) => {
      eventSignups.value = response.data;
      eventSignups.value.forEach((signUp) => {
        if (signUp.id === props.eventSignUpData.id) eventSignup.value = signUp;
      });

      const exitingStudentsInSingup =
        eventSignup.value.studentInstrumentSignups.map(
          (x) =>
            x.studentInstrument.studentRole.user.firstName +
            " " +
            x.studentInstrument.studentRole.user.lastName
        );
      studentsInSignup.value = "";
      if (exitingStudentsInSingup.length == 1) {
        studentsInSignup.value = exitingStudentsInSingup[0];
      } else if (exitingStudentsInSingup.length == 2) {
        //joins all with "and" but no commas
        studentsInSignup.value = exitingStudentsInSingup.join(" and ");
      } else {
        //joins all with commas, but last one gets ", and"
        studentsInSignup.value =
          exitingStudentsInSingup.slice(0, -1).join(", ") +
          ", and " +
          exitingStudentsInSingup.slice(-1);
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

async function getStudentPieces() {
  await StudentPieceDataService.getByUser(loginStore.user.userId)
    .then((response) => {
      studentPieces.value = response.data.filter(
        (studentPiece) =>
          studentPiece.semesterId === props.eventData.semesterId &&
          studentPiece.studentInstrumentId ===
            studentInstrumentSignup.value.studentInstrumentId
      );
      selectedStudentPieces.value = [];
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
      studentInstrumentSignup.value.eventSignup.eventSignupPieces.forEach(
        (studentPiece) => {
          selectedStudentPieces.value.push(studentPiece);
        }
      );

      filteredStudentPieces.value = studentPieces.value;
    })
    .catch((e) => {
      console.log(e);
    });
}

function selectStudentPiece(studentPiece) {
  if (!isStudentPieceSelected(studentPiece)) {
    selectedStudentPieces.value.push(studentPiece);
  } else {
    selectedStudentPieces.value.splice(
      selectedStudentPieces.value.findIndex(
        (x) => x.pieceId === studentPiece.pieceId
      ),
      1
    );
  }
}

function isStudentPieceSelected(studentPiece) {
  return (
    selectedStudentPieces.value.findIndex(
      (x) => x.pieceId === studentPiece.pieceId
    ) !== -1
  );
}

async function deleteSignup() {
  await StudentInstrumentSignupDataService.remove(
    studentInstrumentSignup.value.id
  )
    .then(() => {
      confimationDialog.value = false;
      // delete student pieces
      selectedStudentPieces.value.forEach((studentPiece) => {
        EventSignupPieceDataService.remove(studentPiece.id).catch((e) => {
          console.log(e);
        });
      });

      emits("closeDialogEvent");
      emits("refreshEvents");
    })
    .catch((e) => {
      console.log(e);
    });
}

async function saveSignup() {
  if (selectedStudentPieces.value.length == 0) {
    errorMessage.value =
      "You must select atleast one piece before saving this signup.";
    return;
  }
  const studentInstrumentSignupData = {
    id: studentInstrumentSignup.value.eventSignupId,
    isGroupEvent: groupSignup.value,
  };

  // update student signup
  await EventSignupDataService.update(studentInstrumentSignupData)
    .then(() => {
      confimationDialog.value = false;
    })
    .catch((e) => {
      console.log(e);
    });

  // delete student pieces

  studentInstrumentSignup.value.eventSignup.eventSignupPieces.forEach(
    (studentPiece) => {
      EventSignupPieceDataService.remove(studentPiece.id).catch((e) => {
        console.log(e);
      });
    }
  );
  //save student pieces
  selectedStudentPieces.value.forEach((studentPiece) => {
    const studentPieceData = {
      eventSignupId: props.eventSignUpData.id,
      pieceId: studentPiece.pieceId,
    };
    EventSignupPieceDataService.create(studentPieceData).catch((e) => {
      console.log(e);
    });
  });
  emits("closeDialogEvent");
  emits("refreshEvents");
}

onMounted(async () => {
  await getData();
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
            <v-text-field
              label="Instrument"
              v-model="
                studentInstrumentSignup.studentInstrument.instrument.name
              "
              variant="plain"
              read-only
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              label="Instructor"
              v-model="instructor"
              text-label="Instructor"
              variant="plain"
              class="bg-lightBlue text-darkBlue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              readonly
            ></v-text-field
          ></v-col>
          <v-col>
            <v-text-field
              label="Accompanist"
              v-model="accompianist"
              text-label="Accompanist"
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
              <v-col cols="6">
                <v-btn
                  class="font-weight-bold text-none"
                  color="blue"
                  @click="addStudentPieceDialog = true"
                >
                  Add To Repertoire
                </v-btn>
              </v-col>
            </v-row>
            <v-row>
              Only lists pieces from current semester and current instrument
            </v-row>
            <v-row class="mt-5">
              <v-col cols="11" class="pl-0">
                <v-list
                  style="height: 230px"
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
              <div class="font-weight-bold text-h6 text-maroon mb-4">
                Timeslot Selected
              </div>
            </v-row>
            <v-row>
              <v-card color="white" elevation="0">
                <v-card-text class="text-blue py-2 font-weight-bold text-h6">
                  <div>
                    {{
                      get12HourTimeStringFromString(eventSignUpData.startTime) +
                      " - " +
                      get12HourTimeStringFromString(eventSignUpData.endTime)
                    }}
                  </div>
                </v-card-text>
              </v-card>
            </v-row>
            <v-row class="mt-6">
              <v-col class="pl-0"> </v-col>
            </v-row>
            <v-row no-gutters>
              <v-checkbox
                v-model="groupSignup"
                label="Allow other students to signup with you"
                class="text-body-1 font-weight-bold text-darkBlue"
                readonly="eventSignup.length > 1"
              ></v-checkbox>
              <v-textbox v-if="groupSignUp">
                Students in Group : {{ studentsInSignup }}
              </v-textbox>
            </v-row>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-spacer></v-spacer>
          <div class="font-weight-bold mr-2 mt-4 text-red text-h6">
            {{ errorMessage }}
          </div>
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold mr-2 mt-4 bg-maroon text-none"
            @click="confimationDialog = true"
          >
            Delete
          </v-btn>
          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold mr-2 mt-4 bg-blue text-none"
            @click="saveSignup"
          >
            Save
          </v-btn>

          <v-btn
            flat
            size="small"
            class="font-weight-semi-bold mr-2 mt-4 bg-red text-none"
            @click="emits('closeDialogEvent')"
          >
            Cancel
          </v-btn>
        </v-row>
      </v-card-text>
    </v-form>
  </v-card>
  <v-dialog v-model="confimationDialog" persistent max-width="600px">
    <v-card>
      <v-card-title class="text-h6 font-weight-bold text-maroon">
        Confirm Signup Deletion
      </v-card-title>
      <v-card-text
        class="text-h8 font-weight-semi-bold text-blue"
        style="white-space: pre"
      >
        Are you sure you want to delete this signup? This action cannot be
        undone.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          @click="deleteSignup()"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
        >
          Confirm
        </v-btn>
        <v-btn
          @click="confimationDialog = false"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-red text-none"
          >Cancel</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>

  <v-dialog v-model="addStudentPieceDialog" persistent max-width="600px">
    <StudentPieceDialogBody
      :is-edit="false"
      :studentpiece-data="{
        id: null,
        pieceId: null,
        semesterId: eventData.semesterId,
        studentInstrumentId: studentInstrumentSignup.studentInstrument.id,
        status: 'Active',
      }"
      :student-pieces="studentPieces"
      @closeAddStudentPieceDialogEvent="addStudentPieceDialog = false"
      @addStudentPieceSuccessEvent="
        (addStudentPieceDialog = false), getStudentPieces()
      "
    ></StudentPieceDialogBody>
  </v-dialog>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="3000"
    right
  >
    <v-icon
      left
      :icon="snackbar.color === 'success' ? 'mdi-check' : 'mdi-alert'"
    >
    </v-icon>
    {{ snackbar.message }}
  </v-snackbar>
</template>
