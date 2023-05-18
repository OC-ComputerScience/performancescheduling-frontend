<script setup>
import { ref, onMounted } from "vue";

const props = defineProps(["performance"]);

onMounted(() => {
  console.log("sub-event", props.performance);
});
</script>
<template>
  <v-card color="lightMaroon" class="pa-2">
    <v-card-text>
      <v-row>
        <!-- event details -->
        <v-col cols="3">
          <v-row>
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '20px' }"
            >
              {{ props.performance.event.eventType.description }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.date }}
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.eventSignups[0].startTime }}
            </p>
          </v-row>
          <v-row class="mt-2">
            <p
              class="font-weight-bold text-maroon"
              :style="{ fontSize: '14px' }"
            >
              {{ props.performance.event.location.roomName }}
            </p>
          </v-row>
          <v-row class="mt-4">
            <v-btn
              class="font-weight-bold"
              density="compact"
              size="small"
              color="darkBlue"
              :style="{ width: '85px', fontSize: '9px' }"
              >view details</v-btn
            >
          </v-row>
        </v-col>
        <!-- instrument/people -->
        <v-col cols="3">
          <v-row align="center" no-gutters>
            <v-col cols="3">
              <v-icon icon="mdi-music-box-multiple" color="darkBlue"></v-icon>
            </v-col>
            <v-col>
              <p class="text-darkBlue mb-0" :style="{ fontSize: '18px' }">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .studentInstrument.instrument.name
                }}
              </p>
              <p class="text-blue mt-0" :style="{ fontSize: '12px' }">
                Instrument
              </p>
            </v-col>
          </v-row>
          <v-row align="center" no-gutters>
            <v-col cols="3">
              <v-avatar
                color="maroon"
                class="with-outline"
                size="x-small"
                v-if="
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.picture
                "
              >
                <img
                  referrerpolicy="no-referrer"
                  :src="
                    props.performance.studentInstrumentSignups[0]
                      .instructorRoleSignup.user.picture
                  "
                />
              </v-avatar>
            </v-col>
            <v-col>
              <p class="text-darkBlue mb-0" :style="{ fontSize: '18px' }">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.lastName
                }}
              </p>
              <p class="text-blue mt-0" :style="{ fontSize: '9px' }">
                Private Instructor
              </p>
            </v-col>
          </v-row>
          <v-row
            align="center"
            no-gutters
            v-if="
              props.performance.studentInstrumentSignups[0].accompanistRoleId
            "
          >
            <v-col cols="3">
              <v-avatar
                color="maroon"
                class="with-outline"
                size="x-small"
                v-if="
                  props.performance.studentInstrumentSignups[0]
                    .instructorRoleSignup.user.picture
                "
              >
                <img
                  referrerpolicy="no-referrer"
                  :src="
                    props.performance.studentInstrumentSignups[0]
                      .instructorRoleSignup.user.picture
                  "
                />
              </v-avatar>
            </v-col>
            <v-col>
              <p class="text-darkBlue mb-0" :style="{ fontSize: '18px' }">
                {{
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.firstName +
                  " " +
                  props.performance.studentInstrumentSignups[0]
                    .accompanistRoleSignup.user.lastName
                }}
              </p>
              <p class="text-blue mt-0" :style="{ fontSize: '9px' }">
                Accompanist
              </p>
            </v-col>
          </v-row>
        </v-col>
        <!-- pieces -->
        <v-col>
          <p class="font-weight-bold text-maroon" :style="{ fontSize: '18px' }">
            Musical Selection
          </p>
          <div v-for="piece in props.performance.eventSignupPieces">
            <p
              class="font-weight-bold text-darkBlue"
              :style="{ fontSize: '18px' }"
            >
              {{ piece.piece.title }}
            </p>
            <p
              class="text-blue"
              :style="{ fontSize: '10px' }"
              v-if="piece.piece.composer.lastName"
            >
              {{
                piece.piece.composer.lastName +
                ", " +
                piece.piece.composer.firstName
              }}
            </p>
            <p class="text-blue" :style="{ fontSize: '10px' }" v-else>
              {{ piece.piece.composer.firstName }}
            </p>
          </div>
        </v-col>
        <!-- jurors -->
        <v-col> 4</v-col>
        <!-- buttons -->
        <v-col> 5</v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<style>
.with-outline {
  border: 2px solid white;
}
</style>
