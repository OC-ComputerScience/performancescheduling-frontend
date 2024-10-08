<script setup>
import { ref, onMounted, computed } from "vue";
import StudentInstrumentSignupDataService from "../../../services/StudentInstrumentSignupDataService.js";
import StudentPerformanceCard from "./StudentPerformanceCard.vue";
import { useLoginStore } from "../../../stores/LoginStore.js";

const performances = ref([]);
const filteredPerformances = ref([]);
const filterMenuBool = ref(false);

const loginStore = useLoginStore();

// Filter options
const semesterFilterOptions = ref([]);
const semesterFilterSelection = ref(null);
const instrumentFilterOptions = ref([]);
const instrumentFilterSelection = ref(null);

// Pagination
const currentPage = ref(1);
const perPage = 9;

async function getPerformances() {
  await StudentInstrumentSignupDataService.getByUserRoleId(
    loginStore.currentRole.id,
    new Date(),
    "LTE",
    "desc"
  ).then((response) => {
    performances.value = [];

    response.data.forEach((studentInstrumentSignup) => {
      performances.value.push(studentInstrumentSignup);
    });
  });

  filteredPerformances.value = performances.value;

  buildSemesterList();
  buildInstrumentList();
}

function buildSemesterList() {
  semesterFilterOptions.value = [];
  performances.value.forEach((performance) => {
    if (
      !semesterFilterOptions.value.some(function callback(item) {
        return item.name == performance.eventSignup.event.semester.name;
      })
    ) {
      semesterFilterOptions.value.push({
        id: performance.eventSignup.event.semesterId,
        name: performance.eventSignup.event.semester.name,
      });
    }
  });
}
function buildInstrumentList() {
  instrumentFilterOptions.value = [];
  performances.value.forEach((performance) => {
    if (
      !instrumentFilterOptions.value.some(function callback(item) {
        return item.name == performance.studentInstrument.instrument.name;
      })
    ) {
      instrumentFilterOptions.value.push({
        id: performance.studentInstrument.instrument.id,
        name: performance.studentInstrument.instrument.name,
      });
    }
  });
}

async function refreshPerformances() {
  await getPerformances();
  filterPerformances();
}

function filterPerformances() {
  filteredPerformances.value = performances.value;
  if (semesterFilterSelection.value != null) {
    filteredPerformances.value = performances.value.filter(
      (performance) =>
        performance.eventSignup.event.semesterId ===
        semesterFilterSelection.value.id
    );
  }
  if (instrumentFilterSelection.value != null) {
    filteredPerformances.value = filteredPerformances.value.filter(
      (performance) =>
        performance.studentInstrument.instrument.id ===
        instrumentFilterSelection.value.id
    );
  }
}

function clearFilters() {
  currentPage.value = 1;
  filteredPerformances.value = performances.value;
  semesterFilterSelection.value = null;
  instrumentFilterSelection.value = null;
}

const currentPageData = computed(() => {
  return filteredPerformances.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  refreshPerformances();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold">Performances</h1>

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
            Filter Performances
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
              </v-list-item>
            </v-list>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Instrument
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instrumentFilterSelection"
                  :items="instrumentFilterOptions"
                  item-title="name"
                  item-value="id"
                  return-object
                ></v-select>
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
        v-if="semesterFilterSelection || instrumentFilterSelection"
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
    </v-row>
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
