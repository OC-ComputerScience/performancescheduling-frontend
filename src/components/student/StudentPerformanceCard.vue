<script setup>
import { onMounted } from "vue";
import { useDisplay } from "vuetify";

const { lg, smAndUp, mdAndUp } = useDisplay();

const props = defineProps(["performance"]);

onMounted(() => {
  console.log("event", props.performance);
});
</script>
<template>
  <v-card color="lightMaroon" class="pa-2" elevation="0">
    <v-card-text>
      <v-row class="pa-2">
        <!-- event details -->
        <v-col>
          <v-row>
            <p class="font-weight-bold text-maroon" style="font-size: 160%">
              {{ props.performance.event.eventType.description }}
            </p>
          </v-row>
          <v-row class="mt-7">
            <p class="font-weight-bold text-maroon" style="font-size: 110%">
              {{ props.performance.event.date }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <p class="font-weight-bold text-maroon" style="font-size: 110%">
              {{ props.performance.startTime }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <p class="font-weight-bold text-maroon" style="font-size: 110%">
              {{ props.performance.event.location.roomName }}
            </p>
          </v-row>
          <v-row class="mt-7">
            <v-btn
              class="font-weight-bold"
              size="small"
              color="darkBlue"
              style="font-size: 80%"
              width="40%"
            >
              view details
            </v-btn>
          </v-row>
        </v-col>
        <!-- instrument/people -->
        <v-col>
          <v-row align="center" no-gutters>
            <v-col cols="2">
              <v-icon icon="mdi-music-box-multiple" color="darkBlue"></v-icon>
            </v-col>
            <v-col>
              <p class="text-darkBlue mb-0" style="font-size: 140%">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .studentInstrument.instrument.name
                }}
              </p>
              <p class="text-blue mt-0" style="font-size: 90%">Instrument</p>
            </v-col>
          </v-row>
          <v-row align="center" no-gutters class="mt-2">
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
            <v-col>
              <p class="text-darkBlue mb-0" style="font-size: 140%">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.lastName
                }}
              </p>
              <p class="text-blue mt-0" style="font-size: 90%">
                Private Instructor
              </p>
            </v-col>
          </v-row>
          <v-row
            align="center"
            no-gutters
            class="mt-2"
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
            <v-col>
              <p class="text-darkBlue mb-0" style="font-size: 140%">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.lastName
                }}
              </p>
              <p class="text-blue mt-0" style="font-size: 90%">Accompanist</p>
            </v-col>
          </v-row>
        </v-col>
        <!-- pieces -->
        <v-col v-if="smAndUp">
          <p class="font-weight-bold text-maroon" style="font-size: 150%">
            Musical Selection
          </p>
          <div
            v-for="piece in props.performance.eventSignupPieces"
            class="mt-2"
          >
            <p class="font-weight-bold text-darkBlue" style="font-size: 110%">
              {{ piece.piece.title }}
            </p>
            <p
              class="text-blue"
              style="font-size: 90%"
              v-if="piece.piece.composer.lastName"
            >
              {{
                piece.piece.composer.lastName +
                ", " +
                piece.piece.composer.firstName
              }}
            </p>
            <p class="text-blue" style="font-size: 90%" v-else>
              {{ piece.piece.composer.firstName }}
            </p>
          </div>
        </v-col>
        <!-- jurors -->
        <v-col v-if="mdAndUp">
          <p class="font-weight-bold text-maroon" style="font-size: 150%">
            Jurors
          </p>
          <v-row
            align="center"
            class="mt-2"
            no-gutters
            v-for="critique in props.performance.critiques"
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
              <p class="text-darkBlue" style="font-size: 110%">
                {{
                  critique.userRole.user.firstName +
                  " " +
                  critique.userRole.user.lastName
                }}
              </p>
            </v-col>
          </v-row>
        </v-col>
        <!-- buttons -->
        <v-col cols="2">
          <v-row v-if="props.performance.pass != null" justify="end">
            <v-btn v-if="props.performance.pass" color="teal" :ripple="false">
              Passed
            </v-btn>
            <v-btn v-else color="maroon" :ripple="false"> Failed </v-btn>
          </v-row>
          <v-row justify="end">
            <v-btn
              v-if="props.performance.critiques.length == 0"
              color="maroon"
              :ripple="false"
            >
              Feedback Pending
            </v-btn>
            <v-btn
              v-else
              color="maroon"
              :ripple="false"
              class="font-weight-bold"
              size="small"
              width="65%"
              style="font-size: 80%"
            >
              Critiques Available
            </v-btn>
          </v-row>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style>
.with-outline {
  border: 2px solid white;
}
</style>
