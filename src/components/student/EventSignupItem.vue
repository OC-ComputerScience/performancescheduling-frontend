<script setup>
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import { getHourWordFromNumber } from "../../composables/timeFormatter";
import StudentEventSignupEditDialog from "./StudentEventSignupEditDialog.vue";
import { defineProps, defineEmits, ref, onMounted } from "vue";
import StudentInstrumentSignupDataService from "../../services/StudentInstrumentSignupDataService";

const editSignUp = ref(false);
const emits = defineEmits(["refreshEvents"]);
const props = defineProps({
  eventData: { type: [Object], required: true },
  eventSignupData: { type: [Object], required: true },
  studentInstrumentSignupData: { type: [Object], required: true },
  isSignup: { type: [Boolean], required: true },
});
const names = ref("");

onMounted(() => {
  if (props.eventSignupData.studentInstrumentSignups.length > 1) {
    let comma = "";
    for (
      let i = 0;
      i < props.eventSignupData.studentInstrumentSignups.length;
      i++
    ) {
      StudentInstrumentSignupDataService.getAllDataById(
        props.eventSignupData.studentInstrumentSignups[i].id
      )
        .then((response) => {
          names.value +=
            comma +
            response.data.studentInstrument.studentRole.user.firstName +
            " " +
            response.data.studentInstrument.studentRole.user.lastName;
          comma = ", ";
        })
        .catch((e) => {
          console.log(e);
        });
    }
  }
});
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
                  <v-col cols="auto" align-self="end" v-if="isSignup">
                    <!-- Signup Time Data -->
                    <v-card-subtitle class="font-weight-semi-bold pl-0">
                      <v-icon
                        class="mr-1"
                        :icon="
                          'mdi-clock-time-' +
                          getHourWordFromNumber(
                            get12HourTimeStringFromString(
                              eventSignupData.startTime
                            ).split(':')[0]
                          )
                        "
                      ></v-icon>

                      {{
                        get12HourTimeStringFromString(eventSignupData.startTime)
                      }}
                    </v-card-subtitle>
                  </v-col>
                  <v-col cols="auto" align-self="end" v-if="!isSignup">
                    <!-- Event Times (for availability version) -->
                    <v-card-subtitle>
                      {{ get12HourTimeStringFromString(eventData.startTime) }} -
                      {{ get12HourTimeStringFromString(eventData.endTime) }}
                    </v-card-subtitle>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-subtitle v-if="names.length > 0">with {{ names }}</v-card-subtitle>
    <v-card-text class="pt-4 pb-0">
      <v-row class="pb-0 mb-0">
        <v-col cols="12" lg="6" v-if="props.isSignup" class="mb-0 pb-0">
          <v-row>
            <v-card-title class="font-weight-semi-bold text-maroon">
              Signup Information
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
        </v-col>
        <!-- Musical Selection Data -->
        <v-col cols="12" lg="6" v-if="props.isSignup">
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
            <v-col cols="1" align-self="center">
              <v-avatar size="30" color="darkBlue">
                <img referrerpolicy="no-referrer" />
              </v-avatar>
            </v-col>
            <v-col cols="10">
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
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="pt-0 mt-0">
      <!-- Edit Signup/Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
        @click="editSignUp = true"
      >
        Edit {{ isSignup ? "signup" : "availability" }}
      </v-btn>
    </v-card-actions>
  </v-card>
  <v-dialog v-model="editSignUp" persistent max-width="1050px">
    <StudentEventSignupEditDialog
      :event-data="eventData"
      :event-sign-up-data="eventSignupData"
      :student-instrument-signup-data="studentInstrumentSignupData"
      @closeDialogEvent="editSignUp = false"
      @refreshEvents="emits('refreshEvents')"
    >
    </StudentEventSignupEditDialog>
  </v-dialog>
</template>
