<script setup>
import { ref, onMounted, computed } from "vue";
import PieceDataService from "./../../../../services/PieceDataService";
import ComposerDataService from "./../../../../services/ComposerDataService";
import MaintainPieceCard from "./MaintainPieceCard.vue";
import PieceDialogBody from "./PieceDialogBody.vue";
import { useLoginStore } from "../../../../stores/LoginStore.js";

const loginStore = useLoginStore();
const isAdmin = ref(loginStore.currentRole.roleId === 3 ? true : false);
console.log(isAdmin);

const addPieceDialog = ref(false);

// Piece Data
const pieces = ref([]);
const filteredPieces = ref([]);
const composers = ref([]);

async function getPieces() {
  await PieceDataService.getAll("title")
    .then((response) => {
      pieces.value = response.data;
      filteredPieces.value = pieces.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshPieces() {
  await getPieces();
  await searchAndFilterList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of pieces by first and last name, based on searchInput
function searchAndFilterList() {
  filteredPieces.value = pieces.value;
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value != "")
    filteredPieces.value = filteredPieces.value.filter((piece) =>
      (
        piece.title.toLowerCase() +
        " " +
        piece.composer.firstName.toLowerCase() +
        " " +
        piece.composer.lastName.toLowerCase()
      ).includes(searchInput.value.toLowerCase())
    );

  filterPieces();
}

const statusFilterOptions = ["Active", "Disabled", "Pending"];
const statusFilterSelection = ref(null);

function filterPieces() {
  // Filter by status
  if (statusFilterSelection.value) {
    filteredPieces.value = filteredPieces.value.filter(
      (piece) => piece.status === statusFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredPieces.value = pieces.value;
  statusFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredPieces.value.slice(
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
  await getPieces();
  await getComposers();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Pieces</h1>

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
            Filter pieces
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
        @click="addPieceDialog = true"
      >
        Add new piece
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="piece in currentPageData"
              :key="piece.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainPieceCard
                :piece-data="piece"
                :pieces-data="pieces"
                :composers-data="composers"
                @refreshPiecesEvent="refreshPieces()"
              ></MaintainPieceCard>
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
              filteredPieces.length % perPage == 0
                ? filteredPieces.length / perPage
                : Math.floor(filteredPieces.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addPieceDialog" persistent max-width="600px">
    <PieceDialogBody
      :is-edit="false"
      :is-admin="isAdmin"
      :piece-data="{
        id: null,
        title: null,
        originalLanguage: null,
        poeticTranslation: null,
        literalTranslation: null,
        status: isAdmin ? 'Active' : 'Pending',
      }"
      :pieces-data="pieces"
      @closeAddPieceDialogEvent="addPieceDialog = false"
      @addPieceSuccessEvent="(addPieceDialog = false), refreshPieces()"
    ></PieceDialogBody>
  </v-dialog>
</template>
