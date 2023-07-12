<script setup>
import { ref, onMounted, computed } from "vue";
import StudentPieceDataService from "./../../../../services/StudentPieceDataService";
import PieceDataService from "./../../../../services/PieceDataService";
import ComposerDataService from "./../../../../services/ComposerDataService";
import MaintainStudentPieceCard from "./MaintainStudentPieceCard.vue";
import StudentPieceDialogBody from "./StudentPieceDialogBody.vue";

const addStudentPieceDialog = ref(false);
const piecesData = ref([]);

// StudentStudentPiece Data
const studentpieces = ref([]);
const filteredStudentPieces = ref([]);
const composers = ref([]);

async function getStudentPieces() {
  await StudentPieceDataService.getAll()
    .then((response) => {
      studentpieces.value = response.data;
      filteredStudentPieces.value = studentpieces.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getPieces() {
  await PieceDataService.getAll()
    .then((response) => {
      piecesData.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
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
      (studentstudentpiece) =>
        (
          studentstudentpiece.title.toLowerCase() +
          " " +
          studentstudentpiece.title
        )
          .toLowerCase()
          .includes(searchInput.value.toLowerCase())
    );

  filterStudentPieces();
}

const statusFilterOptions = ["Active", "Disabled", "Pending"];
const statusFilterSelection = ref(null);

function filterStudentPieces() {
  // Filter by status
  if (statusFilterSelection.value) {
    filteredStudentPieces.value = filteredStudentPieces.value.filter(
      (studentstudentpiece) =>
        studentstudentpiece.status === statusFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredStudentPieces.value = studentpieces.value;
  statusFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredStudentPieces.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});
async function getComposers() {
  await ComposerDataService.getAll("lastName")
    .then((response) => {
      composers.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getStudentPieces();
  await getComposers();
  await getPieces();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">StudentPieces</h1>

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
            Filter studentpieces
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Status
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="statusFilterSelection"
                  :items="statusFilterOptions"
                  return-object
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
              v-if="statusFilterSelection != null"
              @click="clearFilters"
              class="bg-maroon ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="statusFilterSelection != null"
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
      <v-btn
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addStudentPieceDialog = true"
      >
        Add new studentstudentpiece
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="studentstudentpiece in currentPageData"
              :key="studentstudentpiece.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainStudentPieceCard
                :studentstudentpiece-data="studentstudentpiece"
                :studentpieces-data="studentpieces"
                :composers-data="composers"
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
  </v-container>
  <v-dialog v-model="addStudentPieceDialog" persistent max-width="600px">
    <StudentPieceDialogBody
      :is-edit="false"
      :studentpiece-data="{
        id: null,
        pieceId: null,
        semesterId: null,
        studentId: null,
        status: 'Active',
      }"
      :pieces-data="piecesDatsa"
      @closeAddStudentPieceDialogEvent="addStudentPieceDialog = false"
      @addStudentPieceSuccessEvent="
        (addStudentPieceDialog = false), refreshStudentPieces()
      "
    ></StudentPieceDialogBody>
  </v-dialog>
</template>
