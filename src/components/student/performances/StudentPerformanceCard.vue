<script setup>
import { ref } from "vue";
import { useLoginStore } from "../../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import { formatDate } from "./../../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "./../../../composables/timeFormatter";
import { getHourWordFromNumber } from "./../../../composables/timeFormatter";
import PerformanceDialogBody from "./PerformanceDialogBody.vue";
import FacultyCreateCritiqueDialog from "../../faculty/critique/FacultyCreateCritiqueDialog.vue";
import FacultyGradeCritiqueDialog from "../../faculty/critique/FacultyGradeCritiqueDialog.vue";
import FacultyEndingLevelCritiqueDialog from "../../faculty/critique/FacultyEndingLevelCritiqueDialog.vue";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);
const emits = defineEmits(["dialogClosedEvent"]);

const viewCritique = ref(false);
const pieceData = ref(null);
const isCritiqued = ref(false);
const gradeDialog = ref(false);
const endingLevelDialog = ref(false);
const critiqueDialog = ref(false);

const props = defineProps({
  eventData: { type: [Object], required: true },
  eventSignupData: { type: [Object], required: true },
  studentInstrumentSignupData: { type: [Object], required: true },
});

function openDialog(piece) {
  pieceData.value = piece;
  viewCritique.value = true;
}

function closeDialogs() {
  viewCritique.value = false;
  critiqueDialog.value = false;
  gradeDialog.value = false;
  endingLevelDialog.value = false;
  emits("dialogClosedEvent");
}
function hasCritiques(piece) {
  if (piece.critiques.length > 0) {
    isCritiqued.value = true;
    return true;
  } else {
    isCritiqued.value = false;
    return false;
  }
}
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title>
      <v-row>
        <v-col class="pl-0">
          <v-row class="pa-0 ma-0">
            <v-col cols="auto" class="pa-0 ma-0">
              <!-- Event Name -->
              <v-card-title class="font-weight-bold text-maroon text-h5">
                {{ eventData.name }}
              </v-card-title>
              <!-- Event Location -->
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
                {{ eventData.location.roomName }}
              </v-card-subtitle>
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
                {{ eventData.semester.name }}
              </v-card-subtitle>
              <div v-if="currentRole.roleId == 2">
                <v-card-subtitle
                  class="font-weight-semi-bold text-darkblue mt-4 text-h6"
                >
                  {{
                    studentInstrumentSignupData.studentInstrument.studentRole
                      .user.firstName
                  }}
                  {{
                    studentInstrumentSignupData.studentInstrument.studentRole
                      .user.lastName
                  }}
                </v-card-subtitle>
              </div>
            </v-col>
            <v-spacer></v-spacer>
            <v-col cols="auto" class="mt-0 pt-2 mr-0 pr-0">
              <v-card
                flat
                rounded="md"
                class="bg-darkBlue py-2 px-0 text-white mt-0"
              >
                <v-row>
                  <v-spacer></v-spacer>

                  <v-col cols="auto">
                    <!-- Event Date -->
                    <v-card-subtitle class="font-weight-semi-bold pr-0">
                      <v-icon class="mr-1" icon="mdi-calendar"></v-icon>
                      {{ formatDate(eventData.date) }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="auto" align-self="end">
                    <!-- Signup Time Data -->
                    <v-card-subtitle class="font-weight-semi-bold pl-0">
                      <v-icon
                        class="mr-1"
                        :icon="
                          'mdi-clock-time-' +
                          getHourWordFromNumber(
                            eventSignupData.startTime.split(':')[0]
                          )
                        "
                      ></v-icon>

                      {{
                        get12HourTimeStringFromString(eventSignupData.startTime)
                      }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
              <v-row v-if="eventData.eventType.allowGrade">
                <v-card-title class="font-weight-semi-bold text-maroon mt-5">
                  Grade:
                  {{
                    eventSignupData.pass == null
                      ? "Grade pending"
                      : eventSignupData.pass
                      ? "Passed"
                      : "Failed"
                  }}
                </v-card-title>
              </v-row>
              <v-row v-if="eventData.eventType.allowEndingLevel">
                <v-card-title class="font-weight-semi-bold text-maroon mt-5">
                  Ending Level:
                  {{
                    eventSignupData.endingLevelId == null
                      ? "Level pending"
                      : eventSignupData.endingLevelEventSignup.name
                  }}
                </v-card-title>
              </v-row>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-4 pb-0">
      <v-row class="pb-6 mb-0">
        <v-col cols="12" class="mb-0 pb-0">
          <v-row>
            <v-col cols="4">
              <v-row>
                <v-card-title class="font-weight-semi-bold text-maroon">
                  Performance Info
                </v-card-title>
              </v-row>

              <v-row class="pl-2 pt-0 mt-0">
                <v-col cols="1" align-self="center">
                  <v-avatar size="30" color="lightBlue">
                    <v-icon
                      size="35"
                      class="text-darkBlue"
                      icon="mdi-music-circle"
                    ></v-icon>
                  </v-avatar>
                </v-col>
                <v-col cols="10">
                  <v-card-subtitle
                    class="font-weight-semi-bold text-h6 text-darkBlue"
                  >
                    {{
                      studentInstrumentSignupData.studentInstrument.instrument
                        .name
                    }}
                  </v-card-subtitle>
                  <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                    Instrument
                  </v-card-text>
                </v-col>
              </v-row>
              <v-row class="pt-0 mt-0 pl-2">
                <v-col cols="1" align-self="center">
                  <v-avatar size="30" color="darkBlue">
                    <img
                      referrerpolicy="no-referrer"
                      :src="
                        studentInstrumentSignupData.instructorRoleSignup.user
                          .picture
                      "
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="10">
                  <v-card-subtitle
                    class="font-weight-semi-bold text-h7 text-darkBlue"
                  >
                    {{
                      studentInstrumentSignupData.instructorRoleSignup.user
                        .firstName
                    }}
                    {{
                      studentInstrumentSignupData.instructorRoleSignup.user
                        .lastName
                    }}
                  </v-card-subtitle>
                  <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                    Private Instructor
                  </v-card-text>
                </v-col>
              </v-row>

              <v-row
                class="pt-0 mt-0 pl-2"
                v-if="studentInstrumentSignupData.accompanistRoleSignup"
              >
                <v-col cols="1" align-self="center">
                  <v-avatar size="30" color="darkBlue">
                    <img
                      referrerpolicy="no-referrer"
                      :src="
                        studentInstrumentSignupData.accompanistRoleSignup.user
                          .picture
                      "
                    />
                  </v-avatar>
                </v-col>
                <v-col cols="10">
                  <v-card-subtitle
                    class="font-weight-semi-bold text-h7 text-darkBlue"
                  >
                    {{
                      studentInstrumentSignupData.accompanistRoleSignup.user
                        .firstName
                    }}
                    {{
                      studentInstrumentSignupData.accompanistRoleSignup.user
                        .lastName
                    }}
                  </v-card-subtitle>
                  <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                    Accompanist
                  </v-card-text>
                </v-col>
              </v-row>
            </v-col>
            <v-col cols="8">
              <!-- Musical Selection Data -->
              <v-row>
                <v-card-title class="font-weight-semi-bold text-maroon">
                  Musical Selection
                </v-card-title>
              </v-row>
              <v-row
                v-for="eventSignupPiece of studentInstrumentSignupData
                  .eventSignup.eventSignupPieces"
                :key="eventSignupPiece.id"
                class="pt-0 mt-0 pl-2"
              >
                <v-col align-self="center" cols="1">
                  <v-avatar size="30" color="darkBlue">
                    <img referrerpolicy="no-referrer" />
                  </v-avatar>
                </v-col>
                <v-col cols="8">
                  <v-card-subtitle
                    class="font-weight-semi-bold text-h7 text-darkBlue"
                  >
                    {{ eventSignupPiece.piece.title }}
                  </v-card-subtitle>
                  <v-card-text class="text-weight-medium text-blue pt-1 pb-0">
                    {{ eventSignupPiece.piece.composer.firstName }}
                    {{ eventSignupPiece.piece.composer.lastName }}
                  </v-card-text>
                </v-col>
                <v-col
                  v-if="hasCritiques(eventSignupPiece)"
                  cols="3"
                  min-width="95"
                >
                  <v-btn
                    flat
                    size="small"
                    class="font-weight-semi-bold ml-auto mr-2 bg-darkBlue text-none"
                    @click="openDialog(eventSignupPiece)"
                  >
                    Critiques
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-row>
          <v-row>
            <v-spacer></v-spacer>
            <v-btn
              v-if="!isCritiqued && currentRole.roleId == 2"
              flat
              size="small"
              :min-width="95"
              class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none text-white"
              @click="critiqueDialog = true"
            >
              Add Critique
            </v-btn>
            <v-btn
              v-if="
                eventData.eventType.allowGrade &&
                eventSignupData.pass == null &&
                currentRole.roleId == 2
              "
              flat
              size="small"
              :min-width="95"
              class="font-weight-semi-bold mr-2 bg-blue text-none text-white"
              @click="gradeDialog = true"
            >
              Add Grade
            </v-btn>
            <v-btn
              v-if="
                eventData.eventType.allowGrade &&
                eventSignupData.pass != null &&
                currentRole.roleId == 2
              "
              flat
              size="small"
              :min-width="95"
              class="font-weight-semi-bold mr-2 bg-blue text-none text-white"
              @click="gradeDialog = true"
            >
              Edit Grade
            </v-btn>

            <v-btn
              v-if="
                eventData.eventType.allowEndingLevel &&
                eventSignupData.endingLevelId == null &&
                currentRole.roleId == 2
              "
              flat
              size="small"
              :min-width="95"
              class="font-weight-semi-bold mr-2 bg-blue text-none text-white"
              @click="endingLevelDialog = true"
            >
              Add End Level
            </v-btn>
            <v-btn
              v-if="
                eventData.eventType.allowEndingLevel &&
                eventSignupData.endingLevelId != null &&
                currentRole.roleId == 2
              "
              flat
              size="small"
              :min-width="95"
              class="font-weight-semi-bold mr-2 bg-blue text-none text-white"
              @click="endingLevelDialog = true"
            >
              Edit End Level
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="viewCritique" persistent max-width="600px">
    <PerformanceDialogBody
      :event-name="eventData.name"
      :piece-data="pieceData"
      @closePerformanceDialog="closeDialogs()"
    ></PerformanceDialogBody>
  </v-dialog>
  <v-dialog v-model="critiqueDialog" persistent max-width="1050px">
    <FacultyCreateCritiqueDialog
      :signup="props.studentInstrumentSignupData.eventSignup"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyCreateCritiqueDialog>
  </v-dialog>
  <v-dialog v-model="gradeDialog" persistent max-width="800px">
    <FacultyGradeCritiqueDialog
      :signup="props.studentInstrumentSignupData.eventSignup"
      :time="props.eventSignupData"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyGradeCritiqueDialog>
  </v-dialog>
  <v-dialog v-model="endingLevelDialog" persistent max-width="800px">
    <FacultyEndingLevelCritiqueDialog
      :signup="props.studentInstrumentSignupData.eventSignup"
      :time="props.eventSignupData"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyEndingLevelCritiqueDialog>
  </v-dialog>
</template>
