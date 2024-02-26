<script setup>
import { ref, onMounted, computed } from "vue";
import StudentPieceDataService from "./../../../services/StudentPieceDataService";
import SemesterDataService from "./../../../services/SemesterDataService";
import MaintainStudentPieceCard from "./MaintainStudentPieceCard.vue";
import InstrumentDataService from "./../../../services/InstrumentDataService";
import StudentPieceDialogBody from "./StudentPieceDialogBody.vue";
import { useLoginStore } from "./../../../stores/LoginStore.js";

const addStudentPieceDialog = ref(false);
const loginStore = useLoginStore();
// StudentStudentPiece Data
const studentpieces = ref([]);
const filteredStudentPieces = ref([]);
const semesters = ref([]);

const emits = defineEmits(["closeRepertoireDialogEvent"]);

const props = defineProps({
  userData: {
    type: [Object],
    reqired: false,
  },
  isDialog: {
    type: Boolean,
    required: false,
  },
  selectedStudentRoleId: {
    type: Number,
    required: false,
  },
});

var userId;
var studentRoleId;
if (props.isDialog) {
  userId = props.userData.id;
  studentRoleId = props.selectedStudentRoleId;
} else {
  userId = loginStore.currentRole.userId;
  studentRoleId = loginStore.currentRole.id;
}

async function getStudentPieces() {
  await StudentPieceDataService.getByUser(userId)
    .then((response) => {
      studentpieces.value = response.data;
      filteredStudentPieces.value = studentpieces.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getSemesters() {
  await SemesterDataService.getAll("name", false)
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getInstruments() {
  await InstrumentDataService.getAll("name", true)
    .then((response) => {
      instrumentFilterOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}
function closeDialog() {
  emits("closeRepertoireDialogEvent");
}
async function refreshStudentPieces() {
  await getStudentPieces();
  await searchAndFilterList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of studentpieces by first and last name, based on searchInput
function searchAndFilterList() {
  filteredStudentPieces.value = studentpieces.value;
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value != "")
    filteredStudentPieces.value = filteredStudentPieces.value.filter(
      (studentpiece) =>
        studentpiece.piece.title
          .toLowerCase()
          .includes(searchInput.value.toLowerCase()) ||
        (
          studentpiece.piece.composer.lastName.toLowerCase() +
          " " +
          studentpiece.piece.composer.firstName.toLowerCase()
        ).includes(searchInput.value.toLowerCase())
    );

  filterStudentPieces();
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);
const semesterFilterSelection = ref(null);
const instrumentFilterSelection = ref(null);
const instrumentFilterOptions = ref([]);

function filterStudentPieces() {
  // Filter by status
  if (statusFilterSelection.value) {
    filteredStudentPieces.value = filteredStudentPieces.value.filter(
      (studentpiece) => studentpiece.status === statusFilterSelection.value
    );
  }
  if (semesterFilterSelection.value) {
    filteredStudentPieces.value = filteredStudentPieces.value.filter(
      (studentpiece) =>
        studentpiece.semesterId === semesterFilterSelection.value
    );
  }
  if (instrumentFilterSelection.value) {
    filteredStudentPieces.value = filteredStudentPieces.value.filter(
      (studentpiece) =>
        studentpiece.studentInstrument.instrumentId ===
        instrumentFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredStudentPieces.value = studentpieces.value;
  statusFilterSelection.value = null;
  semesterFilterSelection.value = null;
  searchInput.value = "";
  instrumentFilterSelection.value = null;
}

// Pagination

const currentPage = ref(1);
var perPage = 15;
if (props.isDialog) {
  perPage = 9;
}
const currentPageData = computed(() => {
  return filteredStudentPieces.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getStudentPieces();
  await getSemesters();
  await getInstruments();
});
</script>

<template>
  <!-- <v-container fluid class="pa-8"> -->
  <v-card class="ma-6 pa-2 bg-lightGray elevation-0">
    <v-row class="ml-1">
      <h1 v-if="isDialog" class="mt-4 text-maroon font-weight">
        {{ userData.firstName }} {{ userData.lastName }}
      </h1>
    </v-row>
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Repertoire</h1>

      <input
        type="text"
        v-model="searchInput"
        @input="searchAndFilterList"
        class="ml-6 px-4 my-1 mainCardBorder text-blue bg-white font-weight-semi-bold"
        style="outline: none"
        append-icon="mdi-magnify"
        placeholder="Search"
        single-line
        hide-details
      />

      <v-menu v-model="filterMenuBool" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            size="medium"
            class="font-weight-semi-bold text-darkBlue ml-6 px-2 my-1 mainCardBorder text-none"
            v-bind="props"
          >
            <template v-slot:append>
              <v-icon
                :icon="filterMenuBool ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></v-icon>
            </template>
            Filter Repertoire
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Instrument
                <v-autocomplete
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instrumentFilterSelection"
                  :items="instrumentFilterOptions"
                  item-title="name"
                  item-value="id"
                  clearable
                ></v-autocomplete>
              </v-list-item>
            </v-list>

            <v-list>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Status
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="statusFilterSelection"
                  :items="statusFilterOptions"
                  clearable
                ></v-select>
              </v-list-item>
            </v-list>

            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Semester
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="semesterFilterSelection"
                  :items="semesters"
                  item-title="name"
                  item-value="id"
                  clearable
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="searchAndFilterList(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                statusFilterSelection != null ||
                semesterFilterSelection != null ||
                instrumentFilterSelection != null
              "
              @click="clearFilters"
              class="bg-maroon ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="
          statusFilterSelection != null ||
          semesterFilterSelection != null ||
          instrumentFilterSelection != null
        "
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
      <v-btn
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addStudentPieceDialog = true"
      >
        Add new Piece
      </v-btn>
      <v-btn
        v-if="isDialog"
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="closeDialog"
      >
        Close
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="studentpiece in currentPageData"
              :key="studentpiece.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainStudentPieceCard
                :studentpiece-data="studentpiece"
                :student-pieces="studentpieces"
                :student-role-id="studentRoleId"
                @refreshStudentPiecesEvent="refreshStudentPieces()"
              ></MaintainStudentPieceCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="pt-3">
      <v-col>
        <v-card class="mainCardBorder">
          <v-pagination
            color="blue"
            class="font-weight-bold"
            :length="
              filteredStudentPieces.length % perPage == 0
                ? filteredStudentPieces.length / perPage
                : Math.floor(filteredStudentPieces.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-card>
  <!-- </v-container> -->
  <v-dialog v-model="addStudentPieceDialog" persistent max-width="600px">
    <StudentPieceDialogBody
      :is-edit="false"
      :studentpiece-data="{
        id: null,
        pieceId: null,
        semesterId: null,
        studentIntstrumentId: null,
        status: 'Active',
      }"
      :student-role-id="studentRoleId"
      :student-pieces="studentpieces"
      @closeAddStudentPieceDialogEvent="addStudentPieceDialog = false"
      @addStudentPieceSuccessEvent="
        (addStudentPieceDialog = false), refreshStudentPieces()
      "
    ></StudentPieceDialogBody>
  </v-dialog>
</template>
