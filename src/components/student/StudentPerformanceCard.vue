<script setup>
import { useDisplay } from "vuetify";

const { smAndUp, mdAndUp } = useDisplay();

const props = defineProps(["performance"]);
</script>
<template>
  <v-card color="lightMaroon" class="pa-2 flatCardBorder" elevation="0">
    <v-card-text>
      <v-row class="pa-2">
        <!-- event details -->
        <v-col>
          <v-row>
            <v-col>
              <v-card-title
                class="font-weight-bold text-maroon pl-0 ml-0 pt-0 pb-2 text-h4"
              >
                {{ props.performance.event.eventType.description }}
              </v-card-title>
              <v-card-subtitle
                class="font-weight-semi-bold text-maroon pl-0 ml-0 pt-2 text-h7"
              >
                {{ props.performance.event.date }}
              </v-card-subtitle>
              <v-card-subtitle
                class="font-weight-semi-bold text-maroon pl-0 ml-0 pt-2 text-h7"
              >
                {{ props.performance.startTime }}
              </v-card-subtitle>
              <v-card-subtitle
                class="font-weight-semi-bold text-maroon pl-0 ml-0 pt-2 text-h7"
              >
                {{ props.performance.event.location.roomName }}
              </v-card-subtitle>
              <v-btn
                class="font-weight-bold flatChipBorder text-none bg-darkBlue text-white mt-4"
                elevation="0"
                size="small"
              >
                View details
              </v-btn>
            </v-col>
          </v-row>
        </v-col>
        <!-- instrument/people -->
        <v-col>
          <v-row align="center" no-gutters class="pt-0 mt-0 pl-0">
            <v-col cols="2">
              <v-icon icon="mdi-music-box-multiple" color="darkBlue"></v-icon>
            </v-col>
            <v-col class="pl-0 ml-0">
              <v-card-subtitle
                class="text-darkBlue mb-0 text-h7 font-weight-bold pl-0 ml-0"
              >
                {{
                  props.performance.studentInstrumentSignups[0]
                    .studentInstrument.instrument.name
                }}
              </v-card-subtitle>
              <v-card-text
                class="text-weight-semi-bold pt-1 pb-0 text-blue pl-0 ml-0"
              >
                Instrument
              </v-card-text>
            </v-col>
          </v-row>
          <v-row align="center" no-gutters class="pt-0 mt-0 pl-0">
            <v-col cols="2">
              <v-avatar color="darkBlue" size="x-small">
                <img
                  v-if="
                    props.performance.studentInstrumentSignups[0]
                      .instructorRoleSignup.user.picture
                  "
                  referrerpolicy="no-referrer"
                  :src="
                    props.performance.studentInstrumentSignups[0]
                      .instructorRoleSignup.user.picture
                  "
                />
                <v-icon v-else icon="mdi-account"></v-icon>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 ml-0 pt-2">
              <v-card-subtitle
                class="text-darkBlue mb-0 text-h7 font-weight-bold pl-0 ml-0"
              >
                {{
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.lastName
                }}
              </v-card-subtitle>
              <v-card-text
                class="text-weight-semi-bold pt-1 pb-0 text-blue pl-0 ml-0"
              >
                Private Instructor
              </v-card-text>
            </v-col>
          </v-row>
          <v-row
            align="center"
            no-gutters
            class="pt-0 mt-0 pl-0"
            v-if="
              props.performance.studentInstrumentSignups[0].accompanistRoleId
            "
          >
            <v-col cols="2">
              <v-avatar color="darkBlue" size="x-small">
                <img
                  v-if="
                    props.performance.studentInstrumentSignups[0]
                      .accompanistRoleSignup.user.picture
                  "
                  referrerpolicy="no-referrer"
                  :src="
                    props.performance.studentInstrumentSignups[0]
                      .accompanistRoleSignup.user.picture
                  "
                />
                <v-icon v-else icon="mdi-account"></v-icon>
              </v-avatar>
            </v-col>
            <v-col class="pl-0 ml-0 pt-2">
              <v-card-subtitle
                class="text-darkBlue mb-0 text-h7 font-weight-bold pl-0 ml-0"
              >
                {{
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.lastName
                }}
              </v-card-subtitle>
              <v-card-text
                class="text-weight-semi-bold pt-1 pb-0 text-blue pl-0 ml-0"
                >Accompanist</v-card-text
              >
            </v-col>
          </v-row>
        </v-col>
        <!-- pieces -->
        <v-col v-if="smAndUp" class="pt-1">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 pt-0 mt-0 text-h5"
          >
            Musical Selection
          </v-card-title>
          <v-container
            class="pa-0 ma-0"
            v-for="piece in props.performance.eventSignupPieces"
            :key="piece.id"
          >
            <v-card-subtitle
              class="font-weight-bold text-darkBlue text-h7 pl-0 ml-0"
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
        <!-- jurors -->
        <v-col v-if="mdAndUp" class="pt-1">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 pt-0 mt-0 text-h5"
          >
            Jurors
          </v-card-title>
          <v-row
            align="center"
            class="mt-2"
            no-gutters
            v-for="critique in props.performance.critiques"
            :key="critique.id"
          >
            <v-col cols="2">
              <v-avatar color="darkBlue" size="x-small">
                <img
                  v-if="critique.userRole.user.picture"
                  referrerpolicy="no-referrer"
                  :src="critique.userRole.user.picture"
                />
                <v-icon v-else icon="mdi-account"></v-icon>
              </v-avatar>
            </v-col>
            <v-col>
              <v-card-subtitle
                class="font-weight-bold text-darkBlue text-h7 pl-0 ml-0"
              >
                {{
                  critique.userRole.user.firstName +
                  " " +
                  critique.userRole.user.lastName
                }}
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <!-- buttons -->
        <v-col cols="2">
          <v-row v-if="props.performance.pass != null" justify="end">
            <v-btn
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder bg-teal"
            >
              {{ props.performance.pass ? "Passed" : "Failed" }}
            </v-btn>
          </v-row>
          <v-row justify="end">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="
                props.performance.critiques.length == 0
                  ? 'bg-maroon'
                  : 'bg-teal'
              "
            >
              {{
                props.performance.critiques.length == 0
                  ? "Feedback Pending"
                  : "Critiques Available"
              }}
            </v-chip>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
