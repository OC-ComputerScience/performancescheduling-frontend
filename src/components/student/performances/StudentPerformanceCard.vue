<script setup>
import { ref } from "vue";
import { formatDate } from "./../../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "./../../../composables/timeFormatter";
import { getHourWordFromNumber } from "./../../../composables/timeFormatter";
import PerformanceDialogBody from "./PerformanceDialogBody.vue";

PerformanceDialogBody;
const viewCritique = ref(false);
const pieceData = ref(null);

const props = defineProps({
  eventData: { type: [Object], required: true },
  eventSignupData: { type: [Object], required: true },
  studentInstrumentSignupData: { type: [Object], required: true },
});

function openDialog(piece) {
  pieceData.value = piece;
  viewCritique.value = true;
}

function closePerformanceDialog() {
  viewCritique.value = false;
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
              <v-card-title class="font-weight-bold text-maroon text-h4">
                {{ eventData.name }}
              </v-card-title>
              <!-- Event Location -->
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
                {{ eventData.location.roomName }}
              </v-card-subtitle>
              <v-card-subtitle class="font-weight-semi-bold text-maroon">
                {{ eventData.semester.name }}
              </v-card-subtitle>
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
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-4 pb-0">
      <v-row class="pb-0 mb-0">
        <v-col cols="12" class="mb-0 pb-0">
          <v-row>
            <v-card-title class="font-weight-semi-bold text-maroon">
              Performance Information
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
                  studentInstrumentSignupData.studentInstrument.instrument.name
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
                  studentInstrumentSignupData.instructorRoleSignup.user.lastName
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

          <!-- Musical Selection Data -->

          <v-row>
            <v-card-title class="font-weight-semi-bold text-maroon">
              Musical Selection
            </v-card-title>
          </v-row>
          <v-row
            v-for="eventSignupPiece of studentInstrumentSignupData.eventSignup
              .eventSignupPieces"
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
            <v-col cols="3">
              <v-btn
                flat
                size="small"
                class="font-weight-semi-bold ml-auto mr-2 bg-darkBlue text-none"
                @click="openDialog(eventSignupPiece)"
              >
                View Critique
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="viewCritique" persistent max-width="600px">
    <PerformanceDialogBody
      :event-name="eventData.name"
      :piece-data="pieceData"
      @closePerformanceDialog="closePerformanceDialog"
    ></PerformanceDialogBody>
  </v-dialog>
</template>
