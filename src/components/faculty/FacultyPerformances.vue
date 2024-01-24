<script setup>
import { ref, onBeforeMount, computed } from "vue";
import StudentInstrumentSignupDataService from "../../services/StudentInstrumentSignupDataService.js";
import StudentPerformanceCard from "../student/performances/StudentPerformanceCard.vue";
import SemesterDataService from "./../../services/SemesterDataService";
import UserRoleDataService from "./../../services/UserRoleDataService";
import { useLoginStore } from "../../stores/LoginStore.js";

const performances = ref([]);
const filteredPerformances = ref([]);
const filterMenuBool = ref(false);

const searchInput = ref("");

// Filter options
const semesterFilterOptions = ref([]);
const semesterFilterSelection = ref(null);
const instructorFilterOptions = ref([]);
const instructorFilterSelection = ref(null);

// Pagination
const currentPage = ref(1);
const perPage = 9;

async function getSemesters() {
  await SemesterDataService.getAll().then((response) => {
    semesterFilterOptions.value = response.data;
  });
}

async function getInstructor() {
  await UserRoleDataService.getRolesForRoleId(2, null, null, "All").then(
    (response) => {
      instructorFilterOptions.value = response.data;
      instructorFilterOptions.value.forEach((instructor) => {
        instructor.name =
          instructor.user.firstName + " " + instructor.user.lastName;
      });
    }
  );
}

async function getPerformances() {
  await StudentInstrumentSignupDataService.getAllData().then((response) => {
    performances.value = response.data;
  });

  filteredPerformances.value = performances.value;
}

async function refreshPerformances() {
  await getPerformances();
  filterPerformances();
}

function filterPerformances() {
  filteredPerformances.value = performances.value;
  if (searchInput.value != "") {
    filteredPerformances.value = performances.value.filter(
      (studentInstrumentSignup) =>
        (
          studentInstrumentSignup.studentInstrument.studentRole.user.firstName.toLowerCase() +
          " " +
          studentInstrumentSignup.studentInstrument.studentRole.user.lastName.toLowerCase()
        ).includes(searchInput.value.toLowerCase())
    );
  }

  if (semesterFilterSelection.value != null) {
    filteredPerformances.value = filteredPerformances.value.filter(
      (performance) =>
        performance.eventSignup.event.semesterId ===
        semesterFilterSelection.value.id
    );
  }
  if (instructorFilterSelection.value != null) {
    filteredPerformances.value = filteredPerformances.value.filter(
      (performance) =>
        performance.instructorRoleId === instructorFilterSelection.value.id
    );
  }
}

function clearFilters() {
  currentPage.value = 1;
  filteredPerformances.value = performances.value;
  searchInput.value = "";
  semesterFilterSelection.value = null;
  instructorFilterSelection.value = null;
}

const currentPageData = computed(() => {
  return filteredPerformances.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

const filerContents = computed(() => {
  let fc = "";
  if (searchInput.value != "") {
    fc += "Student: " + searchInput.value + ", ";
  } else {
    fc += "Student: All, ";
  }
  if (semesterFilterSelection.value != null) {
    fc += "Semester: " + semesterFilterSelection.value.name + ", ";
  } else {
    fc += "Semester: All, ";
  }
  if (instructorFilterSelection.value != null) {
    fc += "Instructor: " + instructorFilterSelection.value.name;
  } else {
    fc += "Instructor: All";
  }

  return fc;
});

onBeforeMount(async () => {
  getSemesters();
  getInstructor();

  refreshPerformances();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">Performances</h1>
      <input
        type="text"
        v-model="searchInput"
        @input="filterPerformances"
        class="ml-6 px-4 my-1 mainCardBorder text-blue bg-white font-weight-semi-bold"
        style="outline: none"
        append-icon="mdi-magnify"
        placeholder="Search for Student"
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
            Filter performances
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Semester
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="semesterFilterSelection"
                  :items="semesterFilterOptions"
                  item-title="name"
                  item-value="id"
                  return-object
                ></v-select>
                <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                </v-list-item>
                Instructor
                <v-autocomplete
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instructorFilterSelection"
                  :items="instructorFilterOptions"
                  item-title="name"
                  item-value="id"
                  return-object
                ></v-autocomplete>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterPerformances(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="semesterFilterSelection"
              @click="clearFilters"
              class="bg-maroon ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="semesterFilterSelection"
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
    </v-row>
    <v-row class="ml-6"> Displaying : {{ filerContents }}</v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              cols="6"
              sm="12"
              lg="6"
              v-for="studentInstrumentSignup in currentPageData"
              :key="studentInstrumentSignup.id"
            >
              <StudentPerformanceCard
                :key="studentInstrumentSignup.id"
                :event-data="studentInstrumentSignup.eventSignup.event"
                :event-signup-data="studentInstrumentSignup.eventSignup"
                :student-instrument-signup-data="studentInstrumentSignup"
                @dialogClosedEvent="getPerformances()"
              >
              </StudentPerformanceCard>
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
              filteredPerformances.length % perPage == 0
                ? filteredPerformances.length / perPage
                : Math.floor(filteredPerformances.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
