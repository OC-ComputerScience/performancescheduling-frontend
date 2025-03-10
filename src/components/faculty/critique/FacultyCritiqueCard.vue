<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../../stores/LoginStore";
import { get12HourTimeStringFromString } from "../../../composables/timeFormatter";
import FacultyCreateCritiqueDialog from "./FacultyCreateCritiqueDialog.vue";
import FacultyGradeCritiqueDialog from "./FacultyGradeCritiqueDialog.vue";
import FacultyEndingLevelCritiqueDialog from "./FacultyEndingLevelCritiqueDialog.vue";

const emits = defineEmits(["dialogClosedEvent"]);
const props = defineProps(["signup", "eventData"]);
const LoginStore = useLoginStore();

const feedbackDialog = ref(false);
const gradeDialog = ref(false);
const endingLevelDialog = ref(false);
const eventSignupPieces = ref([]);

function sortPieces() {
  eventSignupPieces.value = props.signup.eventSignupPieces;
  eventSignupPieces.value.sort((a, b) => {
    return a.isFirst === b.isFirst ? 0 : a.isFirst > b.isFirst ? -1 : 1;
  });
}
function signupHasFeedbackByFaculty() {
  return props.signup.eventSignupPieces.some((signupPiece) =>
    signupPiece.critiques.some(
      (critique) => critique.userRoleId == LoginStore.currentRole.id
    )
  );
}

function closeDialogs() {
  feedbackDialog.value = false;
  gradeDialog.value = false;
  endingLevelDialog.value = false;
  emits("dialogClosedEvent");
}

onMounted(() => {
  sortPieces();
});
</script>
<template>
  <v-card color="lightMaroon" class="pa-2 flatCardBorder" elevation="0">
    <v-card-text>
      <v-row class="pa-2">
        <!-- timeslot -->
        <v-col cols="2">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 py-0 my-0 text-h6"
          >
            {{ "Time Slot" }}
          </v-card-title>
          <v-row>
            <v-card-subtitle
              class="text-darkBlue text-body-1 font-weight-bold mt-6"
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
        <v-col cols="2">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 py-0 my-0 text-h6"
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
                class="text-darkBlue mb-0 text-body-1 font-weight-bold pl-0 ml-0"
              >
                {{
                  studentInstrumentSignup.studentInstrument.studentRole.user
                    .lastName +
                  ", " +
                  studentInstrumentSignup.studentInstrument.studentRole.user
                    .firstName
                }}
                <br />
                {{
                  "(" +
                  studentInstrumentSignup.studentInstrument.instrument.name +
                  ")"
                }}
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-col>
        <!-- instructor/accompanist -->
        <v-col cols="2">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 py-0 my-0 text-h6"
          >
            Instructor
          </v-card-title>
          <v-card-subtitle
            class="text-darkBlue mb-0 text-body-1 font-weight-bold pl-0 ml-0"
          >
            {{
              props.signup.studentInstrumentSignups[0].instructorRoleSignup.user
                .lastName +
              ", " +
              props.signup.studentInstrumentSignups[0].instructorRoleSignup.user
                .firstName
            }}
          </v-card-subtitle>
          <div
            v-if="
              props.signup.studentInstrumentSignups[0].accompanistRoleSignup !=
              null
            "
          >
            <v-card-title
              class="font-weight-bold text-maroon pl-0 ml-0 py-0 mt-5 text-h6"
            >
              Accompanist
            </v-card-title>
            <v-card-subtitle
              class="text-darkBlue mb-0 text-body-1 font-weight-bold pl-0 ml-0"
            >
              {{
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.lastName +
                ", " +
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.firstName
              }}
            </v-card-subtitle>
          </div>
        </v-col>
        <!-- pieces -->
        <v-col cols="4">
          <v-card-title
            class="font-weight-bold text-maroon pl-0 ml-0 pt-0 mt-0 text-h6"
          >
            Musical Selection
          </v-card-title>
          <div v-for="(piece, index) in eventSignupPieces" :key="piece.id">
            <v-container class="pa-0 ma-0" v-if="index < 2">
              <v-card-subtitle
                class="font-weight-bold text-darkBlue text-body-1 pl-0 ml-0"
              >
                {{ piece.piece.title }}
                {{ piece.isFirst ? "(First Piece)" : "" }}
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
          </div>
        </v-col>
        <!-- buttons -->
        <v-col cols="2">
          <v-row justify="end">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="signupHasFeedbackByFaculty() ? 'bg-teal' : 'bg-darkOrange'"
            >
              {{
                signupHasFeedbackByFaculty()
                  ? "Feedback Given"
                  : "Feedback Pending"
              }}
            </v-chip>
          </v-row>
          <v-row v-if="props.eventData.eventType.allowGrade" justify="end">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-3 text-none text-white flatChipBorder"
              :class="props.signup.pass == null ? 'bg-darkOrange' : props.signup.pass ? 'bg-teal' : 'bg-maroon'"
            >
              {{
                props.signup.pass == null
                  ? "Grade pending"
                  : props.signup.pass
                  ? "Passed"
                  : "Not Passed"
              }}
            </v-chip>
          </v-row>
          <v-row
            v-if="props.eventData.eventType.allowEndingLevel"
            justify="end"
          >
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-3 text-none text-white flatChipBorder"
              :class="
                props.signup.endingLevelId == null ? 'bg-darkOrange' : 'bg-teal'
              "
            >
              {{
                props.signup.endingLevelId == null
                  ? "Ending Level pending"
                  : "Ending Level " + props.signup.endingLevelEventSignup.name
              }}
            </v-chip>
          </v-row>
        </v-col>
      </v-row>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          @click="feedbackDialog = true"
        >
          {{ signupHasFeedbackByFaculty() ? "Edit Critique" : "Add Critique" }}
        </v-btn>
        <v-btn
          v-if="props.eventData.eventType.allowGrade"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          @click="gradeDialog = true"
        >
          {{ props.signup.pass == null ? "Add Grade" : "Edit Grade" }}
        </v-btn>
        <v-btn
          v-if="props.eventData.eventType.allowEndingLevel"
          flat
          size="small"
          class="font-weight-semi-bold ml-auto mr-2 bg-blue text-none"
          @click="endingLevelDialog = true"
        >
          {{
            props.signup.endingLevelId == null
              ? "Add End Level"
              : "Edit End Level"
          }}
        </v-btn>
      </v-row>
    </v-card-text>
  </v-card>
  <v-dialog v-model="feedbackDialog" persistent max-width="1050px">
    <FacultyCreateCritiqueDialog
      :signup="props.signup"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyCreateCritiqueDialog>
  </v-dialog>
  <v-dialog v-model="gradeDialog" persistent max-width="800px">
    <FacultyGradeCritiqueDialog
      :signup="props.signup"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyGradeCritiqueDialog>
  </v-dialog>
  <v-dialog v-model="endingLevelDialog" persistent max-width="800px">
    <FacultyEndingLevelCritiqueDialog
      :signup="props.signup"
      @closeDialogEvent="closeDialogs()"
    >
    </FacultyEndingLevelCritiqueDialog>
  </v-dialog>
</template>
