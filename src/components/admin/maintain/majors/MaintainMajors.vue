<script setup>
import { ref, onMounted, computed } from "vue";
import MajorDataService from "./../../../../services/MajorDataService";
import MaintainMajorCard from "./MaintainMajorCard.vue";
import MajorDialogBody from "./MajorDialogBody.vue";

const addMajorDialog = ref(false);

// Major Data
const majors = ref([]);
const filteredMajors = ref([]);

async function getMajors() {
  await MajorDataService.getAll("name")
    .then((response) => {
      majors.value = response.data;
      filteredMajors.value = majors.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshMajors() {
  await getMajors();
  await filterMajors();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of majors by first and last name, based on searchInput
function searchFilteredList() {
  filteredMajors.value = majors.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredMajors.value = filteredMajors.value.filter((major) =>
    major.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

const roleFilterSelection = ref([]);

const majorTypeFilterOptions = [
  { title: "Music", value: "true" },
  { title: "Non-Music", value: "false" },
];
const majorTypeFilterSelection = ref([]);

function filterMajors() {
  // Never clear the serach filter, so filter by that first, then the actual filters
  searchFilteredList();
  // Filter by status
  if (statusFilterSelection.value) {
    filteredMajors.value = filteredMajors.value.filter(
      (u) => u.status === statusFilterSelection.value
    );
  }

  // Filter by student type, only available if student role filter is active
  if (majorTypeFilterSelection.value.length > 0) {
    // For each studentType filter selected, filter filteredMajors by major.majorRoles.
    // {role that is a student}.studentRole.{check if any of these studentRoles.instrument.
    // type are the type we are looking for.}
    for (let type of majorTypeFilterSelection.value) {
      filteredMajors.value = filteredMajors.value.filter(
        (major) =>
          major.isMusicMajor ===
          type
            .find((sur) => sur.roleId === 1)
            .studentRole.some((sr) => sr.instrument.type === type)
      );
    }
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredMajors.value = majors.value;
  statusFilterSelection.value = null;
  majorTypeFilterSelection.value = [];
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredMajors.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getMajors();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Majors</h1>

      <input
        type="text"
        v-model="searchInput"
        @input="searchFilteredList"
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
            Filter majors
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
              <v-list-item
                v-if="roleFilterSelection.some((r) => r.id === 1)"
                class="pa-0 font-weight-semi-bold text-darkBlue"
              >
                Major Type
                <v-select
                  multiple
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="majorTypeFilterSelection"
                  :items="majorTypeFilterOptions"
                  item-title="title"
                  item-value="value"
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterMajors(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                statusFilterSelection ||
                roleFilterSelection != 0 ||
                studentTypeFilterSelection != 0
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
        v-if="statusFilterSelection || majorTypeFilterSelection != 0"
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
        @click="addMajorDialog = true"
      >
        Add new major
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="major in currentPageData"
              :key="major.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainMajorCard
                :major-data="major"
                @refreshMajorsEvent="refreshMajors()"
              ></MaintainMajorCard>
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
              filteredMajors.length % perPage == 0
                ? filteredMajors.length / perPage
                : Math.floor(filteredMajors.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addMajorDialog" persistent max-width="600px">
    <MajorDialogBody
      :is-edit="false"
      :major-data="{
        id: null,
        name: null,
        isMusicMajor: false,
        status: 'Active',
      }"
      @closeAddMajorDialogEvent="addMajorDialog = false"
      @addMajorSuccessEvent="(addMajorDialog = false), refreshMajors()"
    ></MajorDialogBody>
  </v-dialog>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
