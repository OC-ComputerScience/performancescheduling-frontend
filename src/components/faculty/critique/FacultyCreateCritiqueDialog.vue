<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../../stores/LoginStore.js";
import { get12HourTimeStringFromString } from "../../../composables/timeFormatter";
import CritiqueDataService from "../../../services/CritiqueDataService.js";
import UserRoleDataService from "../../../services/UserRoleDataService.js";
import StudentInstrumentSignupDataService from "../../../services/StudentInstrumentSignupDataService.js";

const emits = defineEmits(["closeDialogEvent"]);

const props = defineProps(["signup"]);
const LoginStore = useLoginStore();

const critiquesByFaculty = ref([]);
const studentNames = ref("");
const selectedStudentPiece = ref({});
const critique = ref({});
const errorSnackbar = ref(false);
const majorName = ref("Several Majors");
const studentSignups = ref([]);
const instructorName = ref("");
const accompanistName = ref("");
const students = ref([]);

async function getSISData() {
  await StudentInstrumentSignupDataService.getAllDataByEventSingupId(
    props.signup.id
  )
    .then((response) => {
      for (let i = 0; i < response.data.length; i++)
        studentSignups.value.push(response.data[i]);
    })
    .catch((error) => {
      console.log(error);
    });

  instructorName.value =
    studentSignups.value[0].instructorRoleSignup.user.lastName +
    ", " +
    studentSignups.value[0].instructorRoleSignup.user.firstName;
  accompanistName.value =
    studentSignups.value[0].accompanistRoleSignup == null
      ? null
      : studentSignups.value[0].accompanistRoleSignup.user.lastName +
        ", " +
        studentSignups.value[0].accompanistRoleSignup.user.firstName;
}

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

async function getMajor(roleId) {
  await UserRoleDataService.get(roleId)
    .then((response) => {
      majorName.value = response.data.major.name;
    })
    .catch((error) => {
      console.log(error);
    });
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
function getLevel(studentInstrument) {
  if (studentInstrument.levelId != null) {
    return studentInstrument.level.name;
  } else {
    return "None";
  }
}
onMounted(async () => {
  await getSISData();
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

  students.value = studentSignups.value.map(
    (stuSignup) =>
      stuSignup.studentInstrument.studentRole.user.lastName +
      ", " +
      stuSignup.studentInstrument.studentRole.user.firstName +
      " (" +
      stuSignup.studentInstrument.instrument.name +
      ", Level: " +
      getLevel(stuSignup.studentInstrument) +
      ", Hours: " +
      stuSignup.studentInstrument.privateHours +
      ")"
  );
  if (students.value.length == 1) {
    let studentRoleId =
      studentSignups.value[0].studentInstrument.studentRole.id;
    await getMajor(studentRoleId);
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
        <v-row class="mt-0 mb-0">
          <v-col class="d-flex align-center" cols="8">
            <div
              v-for="student in students"
              class="font-weight-bold text-maroon my-0 py-1 text-h4"
            >
              {{ student }}
            </div>
          </v-col>
          <v-col class="d-flex justify-end align-center" cols="4">
            <v-card color="lightMaroon" elevation="0">
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
          </v-col>
        </v-row>
        <v-row class="mt-4">
          <v-col cols="6">
            <v-row>
              <p class="font-weight-bold text-black text-h8 ml-4">Major:</p>
              <p class="ml-1">{{ majorName }}</p>
            </v-row>
            <v-row class="mt-4">
              <p class="font-weight-bold text-black text-h8 ml-4">Instructor:</p>
              <p class="ml-1">{{ instructorName }}</p>
            </v-row>
            <v-row
              v-if="accompanistName != null"
              class="mt-4"
            >
              <p class="font-weight-bold text-black text-h8 ml-4">Accomp:</p>
              <p class="ml-1">{{ accompanistName }}</p>
            </v-row>
            <v-row class="font-weight-bold text-maroon text-h6 mt-5 ml-1">
              Musical Selection
            </v-row>
            <v-row class="mt-2">
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
              <v-row class="font-weight-bold text-maroon ml-1 mt-2">
                Poetic Translation
              </v-row>
              <v-row>
                <v-textarea
                  class="text-darkBlue bg-lightBlue ml-4 mr-12"
                  v-model="selectedStudentPiece.piece.poeticTranslation"
                >
                </v-textarea>
              </v-row>
              <v-row class="font-weight-bold text-maroon ml-1 mt-6">
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

            <!-- Tone -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Tone</p>
              <p class="text-maroon mt-2 mr-1">
                (beauty, control/clarity, vibrato, warmth)
              </p>
              <v-radio-group v-model="critique.toneGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.toneComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>

            <!-- Accuracy -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Accuracy/Intonation
              </p>
            </v-row>
            <v-row class="ml-1">
              <p class="text-maroon mt-2 mr-1">
                (correct notes with correct rhythm, tuning with keyboard and/or
                ensemble)
              </p>
              <v-radio-group v-model="critique.accuracyGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.accuracyComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
            <!-- Balance -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Balance Blend
              </p>
              <p class="text-maroon mt-2 mr-1">
                (with accompanist or within ensemble)
              </p>
              <v-radio-group v-model="critique.balanceGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.balanceComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
            <!-- Deportment -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Deportment
              </p>
              <p class="text-maroon mt-2 mr-1">(poise, entrance/exit bow)</p>
              <v-radio-group v-model="critique.deportmentGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.deportmentComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
            <!-- Diction -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">Diction</p>
              <p class="text-maroon mt-2 mr-1">(vocal)</p>
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                / Articulation
              </p>
              <p class="text-maroon mt-2 mr-1">(instrumental)</p>
              <p class="text-maroon mt-2 mr-1">
                (vowels; consonants - legato, double/triple tongue)
              </p>
              <v-radio-group v-model="critique.dictionGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.dictionComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
            <!-- Interpretation -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Interpretation, Musicianship
              </p>
              <p class="text-maroon mt-2 mr-1">
                (phrasing, tempo, dynamics communication, rapport)
              </p>
              <v-radio-group v-model="critique.interpretationGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.interpretationComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
            <!-- Technique -->
            <v-row class="ml-1">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Technique
              </p>
              <p class="text-maroon mt-2 mr-1">
                (attacks, releases, flexibility, range, resonance, placement,
                support, agility)
              </p>
              <v-radio-group v-model="critique.techniqueGrade" inline>
                <v-radio label="Excellent" value="Excellent" color="green">
                </v-radio>
                <v-radio label="Good" value="Good" color="blue"> </v-radio>
                <v-radio label="Fair" value="Fair" color="yellow"> </v-radio>
                <v-radio label="Poor" value="Poor" color="red"></v-radio>
              </v-radio-group>
            </v-row>
            <v-textarea
              v-model="critique.techniqueComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            ></v-textarea>
            <!-- Overall -->
            <v-row class="ml-1 mb-3">
              <p class="font-weight-semi-bold text-maroon mt-2 mr-1">
                Performance and Suggestions
              </p>
              <p class="text-maroon mt-2 mr-1">
                (overall readiness to perform)
              </p>
            </v-row>
            <v-textarea
              v-model="critique.overallComment"
              label="Comment"
              dense
              rows="2"
              auto-grow
              :maxlength="600"
            >
            </v-textarea>
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
