<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../../stores/LoginStore.js";
import { get12HourTimeStringFromString } from "../../../composables/timeFormatter";
import CritiqueDataService from "../../../services/CritiqueDataService.js";

const emits = defineEmits(["closeDialogEvent"]);

const props = defineProps(["signup"]);
const LoginStore = useLoginStore();

const critiquesByFaculty = ref([]);
const studentNames = ref("");
const selectedStudentPiece = ref({});
const critique = ref({});
const errorSnackbar = ref(false);

function clearCritique() {
  critique.value = {};
}

const eventSignupPieces = ref([]);

async function changeSelectedPiece(piece) {
  if (selectedStudentPiece.value.id != piece.id && (await saveCritique())) {
    selectedStudentPiece.value = piece;
    fillCritique();
  }
}

async function saveDialog() {
  if (await saveCritique()) {
    emits("closeDialogEvent");
  }
}

async function closeDialog() {
  emits("closeDialogEvent");
}

async function saveCritique() {
  const existingCritique = critiquesByFaculty.value.find(
    (critique) => critique.eventSignupPieceId == selectedStudentPiece.value.id
  );

  if (Object.values(critique.value).every((x) => x === "")) {
    if (existingCritique) {
      await CritiqueDataService.delete(existingCritique.id)
        .then(() => {
          modifyCritiqueArray(existingCritique, "delete");
        })
        .catch((error) => {
          console.log(error);
        });
    }
    return true;
  }

  //validate critique has an overall comment
  if (
    critique.value.overallComment == undefined ||
    critique.value.overallComment == ""
  ) {
    errorSnackbar.value = true;
    return false;
  }

  critique.value.userRoleId = LoginStore.currentRole.id;
  critique.value.eventSignupPieceId = selectedStudentPiece.value.id;

  if (existingCritique) {
    if (!hasCritiqueChanged(existingCritique)) {
      return true;
    }

    await CritiqueDataService.update(critique.value)
      .then((response) => {
        modifyCritiqueArray(response.data, "update");
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  } else {
    await CritiqueDataService.create(critique.value)
      .then((response) => {
        modifyCritiqueArray(response.data, "add");
      })
      .catch((error) => {
        console.log(error);
        return false;
      });
  }

  return true;
}

function hasCritiqueChanged(existingCritique) {
  if (critique.value.length != existingCritique.length) {
    return true;
  }

  Object.keys(critique.value).forEach((key) => {
    if (critique.value[key] != existingCritique[key]) {
      return true;
    }
  });

  return false;
}

async function fillCritique() {
  if (
    critiquesByFaculty.value.some(
      (critique) => critique.eventSignupPieceId == selectedStudentPiece.value.id
    )
  ) {
    critique.value = critiquesByFaculty.value.find(
      (critique) => critique.eventSignupPieceId == selectedStudentPiece.value.id
    );
  } else {
    clearCritique();
  }
}

function modifyCritiqueArray(critique, action) {
  if (action === "add") {
    critiquesByFaculty.value.push(critique);
    return;
  }

  const index = critiquesByFaculty.value.findIndex(
    (x) => x.eventSignupPieceId == selectedStudentPiece.value.id
  );

  if (action === "update") {
    critiquesByFaculty.value[index] = critique;
  } else if (action === "delete") {
    critiquesByFaculty.value.splice(index, 1);
  }
}

onMounted(async () => {
  critiquesByFaculty.value = props.signup.eventSignupPieces
    .filter((signupPiece) =>
      signupPiece.critiques.some(
        (critique) => critique.userRoleId == LoginStore.currentRole.id
      )
    )
    .map((signupPiece) =>
      signupPiece.critiques.find(
        (critique) => critique.userRoleId == LoginStore.currentRole.id
      )
    );

  selectedStudentPiece.value = props.signup.eventSignupPieces[0];

  fillCritique();

  let students = props.signup.studentInstrumentSignups.map(
    (stuSignup) =>
      stuSignup.studentInstrument.studentRole.user.lastName +
      ", " +
      stuSignup.studentInstrument.studentRole.user.firstName +
      " (" +
      stuSignup.studentInstrument.instrument.name +
      ", Level: " +
      stuSignup.studentInstrument.level.name +
      ", Hours: " +
      stuSignup.studentInstrument.privateHours +
      ")"
  );

  if (students.length == 1) {
    studentNames.value = students[0];
  } else if (students.length == 2) {
    //joins all with "and" but no commas
    studentNames.value = students.join(" and ");
  } else {
    //joins all with commas, but last one gets ", and"
    studentNames.value =
      students.slice(0, -1).join(", ") + ", and " + students.slice(-1);
  }
  eventSignupPieces.value = props.signup.eventSignupPieces;
  eventSignupPieces.value.sort((a, b) => {
    return a.isFirst === b.isFirst ? 0 : a.isFirst > b.isFirst ? -1 : 1;
  });

  selectedStudentPiece.value = eventSignupPieces.value[0];

  eventSignupPieces.value.forEach(function (studentPiece) {
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
    if (studentPiece.piece.poeticTranslation == null) {
      studentPiece.piece.poeticTranslation = "Not Available";
    }
    if (studentPiece.piece.literalTranslation == null) {
      studentPiece.piece.literalTranslation = "Not Available";
    }
  });
});
</script>
<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
      <v-card-text>
        <v-row class="mt-1 mb-4">
          <v-card-title class="font-weight-bold text-maroon text-h4">
            {{ studentNames }}
          </v-card-title>
          <v-spacer></v-spacer>
          <v-card color="lightMaroon" elevation="0" class="mr-2">
            <v-card-title>
              <div class="text-maroon font-weight-bold">
                {{
                  get12HourTimeStringFromString(props.signup.startTime) +
                  "-" +
                  get12HourTimeStringFromString(props.signup.endTime)
                }}
              </div>
            </v-card-title>
          </v-card>
        </v-row>
        <v-row class="mt-4">
          <v-col cols="6">
            <v-row class="font-weight-bold text-black text-h8 ml-1">
              Instructor:
              {{
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.lastName +
                ", " +
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.firstName
              }}
            </v-row>

            <v-row
              v-if="
                props.signup.studentInstrumentSignups[0]
                  .accompanistRoleSignup != null
              "
              class="font-weight-bold text-black pl-0 ml-0 py-0 mt-5 ml-1 text-h8"
            >
              Accomp:
              {{
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.lastName +
                ", " +
                props.signup.studentInstrumentSignups[0].accompanistRoleSignup
                  .user.firstName
              }}
            </v-row>
            <v-row class="font-weight-bold text-maroon text-h6 mt-5 ml-1">
              Musical Selection
            </v-row>
            <v-row class="mt-3">
              <v-col cols="11" class="ml-1">
                <v-list
                  style="height: 280px"
                  class="overflow-y-auto bg-lightBlue"
                >
                  <v-list-item
                    v-for="(studentPiece, index) in eventSignupPieces"
                    :key="index"
                  >
                    <v-card
                      v-bind:class="{
                        'bg-blue': selectedStudentPiece.id == studentPiece.id,
                        'bg-white': selectedStudentPiece.id != studentPiece.id,
                      }"
                      @click="changeSelectedPiece(studentPiece)"
                    >
                      <v-card-text>
                        <v-row
                          no-gutters
                          class="text-blue font-weight-semi-bold"
                          v-bind:class="{
                            'text-white':
                              selectedStudentPiece.id == studentPiece.id,
                          }"
                        >
                          {{ studentPiece.piece.title }}
                          {{ studentPiece.isFirst ? "(First Piece)" : "" }}
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
            <div v-if="selectedStudentPiece.piece != undefined">
              <v-row class="font-weight-bold text-maroon ml-1">
                Poetic Translation
              </v-row>
              <v-row>
                <v-textarea
                  class="text-darkBlue bg-lightBlue ml-4 mr-12"
                  v-model="selectedStudentPiece.piece.poeticTranslation"
                >
                </v-textarea>
              </v-row>
              <v-row class="font-weight-bold text-maroon ml-1">
                Literal Translation
              </v-row>
              <v-row>
                <v-textarea
                  class="text-darkBlue ml-4 mr-12 bg-lightBlue"
                  v-model="selectedStudentPiece.piece.literalTranslation"
                >
                </v-textarea>
              </v-row>
            </div>
          </v-col>
          <v-col cols="6">
            <v-row>
              <div class="font-weight-bold text-maroon text-h6 ml-1 mb-1">
                Critique
              </div>
              <v-spacer></v-spacer>
              <v-btn
                flat
                class="font-weight-semi-bold mt-0 mr-2 text-none text-white bg-blue flatChipBorder"
                @click="clearCritique()"
              >
                Clear Current Critique
              </v-btn>
            </v-row>

            <!-- Accuracy -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Accuracy
              </p>
              <v-radio-group v-model="critique.accuracyGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.accuracyComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Balance -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Balance</p>
              <v-radio-group v-model="critique.balanceGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.balanceComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Deportment -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Deportment
              </p>
              <v-radio-group v-model="critique.deportmentGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.deportmentComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Diction -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Diction</p>
              <v-radio-group v-model="critique.dictionGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.dictionComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Interpretation -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Interpretation
              </p>
              <v-radio-group v-model="critique.interpretationGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.interpretationComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Tone -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Tone</p>
              <v-radio-group v-model="critique.toneGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Poor" value="Poor" color="yellow"> </v-radio>
                <v-radio label="Bad" value="Bad" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-text-field
              v-model="critique.toneComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
            <!-- Overall -->
            <v-row class="ml-1 mb-3">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Overall</p>
            </v-row>
            <v-text-field
              v-model="critique.overallComment"
              label="Comment"
              dense
              rows="2"
            >
            </v-text-field>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-teal flatChipBorder"
          @click="saveDialog()"
        >
          Save
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          @click="closeDialog()"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-snackbar
    :timeout="2500"
    color="maroon"
    rounded="pill"
    v-model="errorSnackbar"
  >
    You must fill the overall comment or clear all fields.
    <template v-slot:actions>
      <v-btn @click="errorSnackbar = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </template>
  </v-snackbar>
</template>
