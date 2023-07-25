<script setup>
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";

const props = defineProps(["signup", "facultyUserRoleId"]);
</script>
<template>
  <v-card color="lightMaroon" class="pa-2 flatCardBorder" elevation="0">
    <v-card-text>
      <v-row class="pa-2">
        <!-- timeslot -->
        <v-col cols="2">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 py-0 my-0 text-h5"
          >
            {{ "Timeslot" }}
          </v-card-title>
          <v-row>
            <v-card-subtitle
              class="text-darkBlue text-body-2 font-weight-bold mt-6"
            >
              {{
                get12HourTimeStringFromString(props.signup.startTime) +
                "-" +
                get12HourTimeStringFromString(props.signup.endTime)
              }}
            </v-card-subtitle>
          </v-row>
        </v-col>
        <!-- student(s) -->
        <v-col cols="3">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 py-0 my-0 text-h5"
          >
            {{
              props.signup.studentInstrumentSignups.length > 1
                ? "Students"
                : "Student"
            }}
          </v-card-title>
          <v-row
            class="ml-0 pt-0 mt-0 pl-0"
            v-for="studentInstrumentSignup in props.signup
              .studentInstrumentSignups"
          >
            <v-col class="pl-0 ml-0">
              <v-card-subtitle
                class="text-darkBlue mb-0 text-body-2 font-weight-bold pl-0 ml-0"
              >
                {{
                  studentInstrumentSignup.studentInstrument.studentRole.user
                    .lastName +
                  ", " +
                  studentInstrumentSignup.studentInstrument.studentRole.user
                    .firstName +
                  " - (" +
                  studentInstrumentSignup.studentInstrument.instrument.name +
                  ")"
                }}
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <!-- pieces -->
        <v-col>
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 pt-0 mt-0 text-h5"
          >
            Musical Selection
          </v-card-title>
          <v-container
            class="pa-0 ma-0"
            v-for="piece in props.signup.eventSignupPieces"
            :key="piece.id"
          >
            <v-card-subtitle
              class="font-weight-bold text-darkBlue text-body-2 pl-0 ml-0"
            >
              {{ piece.piece.title }}
            </v-card-subtitle>
            <v-card-text
              class="text-blue font-weight-semi-bold pl-0 ml-0 pt-1"
              v-if="piece.piece.composer.lastName"
            >
              {{
                piece.piece.composer.lastName
                  ? piece.piece.composer.lastName +
                    ", " +
                    piece.piece.composer.firstName
                  : piece.piece.composer.firstName
              }}
            </v-card-text>
          </v-container>
        </v-col>
        <!-- buttons -->
        <v-col cols="2">
          <v-row justify="end">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="
                props.signup.critiques.length == 0 ? 'bg-maroon' : 'bg-teal'
              "
            >
              {{
                props.signup.critiques.length == 0
                  ? "Feedback Pending"
                  : "Critiques Available"
              }}
            </v-chip>
          </v-row>
          <v-row justify="end">
            <v-btn
              label
              flat
              size="small"
              class="font-weight-bold mt-3 text-none text-white flatChipBorder"
              :class="props.signup.pass == null ? 'bg-maroon' : 'bg-teal'"
            >
              {{
                props.signup.pass == null
                  ? "grade pending"
                  : props.signup.pass
                  ? "Passed"
                  : "Failed"
              }}
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
