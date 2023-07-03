<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted, computed } from "vue";

import StudentPerformanceCard from "./StudentPerformanceCard.vue";
import EventSignupDataService from "./../../services/EventSignupDataService";

const loginStore = useLoginStore();
const performances = ref([]);
const filteredPerformances = ref([]);

async function getStudentEvents() {
  await EventSignupDataService.getByStudent(loginStore.user.userId)
    .then((response) => {
      performances.value = response.data;
      filteredPerformances.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Filtering
const filterMenuBool = ref(false);

const semesterFilterOptions = ref([]);
const instrumentFilterOptions = ref([]);
const eventTypeFilterOptions = ref([]);

const semesterFilterSelection = ref([]);
const instrumentFilterSelection = ref([]);
const eventTypeFilterSelection = ref([]);

function getSemesterFilterOptions() {
  semesterFilterOptions.value = [
    ...new Map(
      performances.value.map((p) => [p.event.semester.id, p.event.semester])
    ).values(),
  ];
}

function getInstrumentFilterOptions() {
  instrumentFilterOptions.value = [
    ...new Map(
      performances.value.map((p) => [
        p.studentInstrumentSignups[0].studentInstrument.instrument.id,
        p.studentInstrumentSignups[0].studentInstrument.instrument,
      ])
    ).values(),
  ];
}

function getEventTypeFilterOptions() {
  eventTypeFilterOptions.value = [
    ...new Map(
      performances.value.map((p) => [p.event.eventType.id, p.event.eventType])
    ).values(),
  ];
}

function filterPerformances() {
  filteredPerformances.value = performances.value;

  if (semesterFilterSelection.value.length != 0) {
    filteredPerformances.value = performances.value.filter(
      (p) => p.event.semester.id === semesterFilterSelection.value.id
    );
  }

  if (instrumentFilterSelection.value.length != 0) {
    filteredPerformances.value = filteredPerformances.value.filter(
      (p) =>
        p.studentInstrumentSignups[0].studentInstrument.instrument.id ===
        instrumentFilterSelection.value.id
    );
  }

  if (eventTypeFilterSelection.value.length != 0) {
    filteredPerformances.value = filteredPerformances.value.filter(
      (p) => p.event.eventType.id === eventTypeFilterSelection.value.id
    );
  }
}

function clearFilters() {
  filteredPerformances.value = performances.value;
  semesterFilterSelection.value = [];
  instrumentFilterSelection.value = [];
  eventTypeFilterSelection.value = [];
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredPerformances.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getStudentEvents();
  getSemesterFilterOptions();
  getInstrumentFilterOptions();
  getEventTypeFilterOptions();
});
</script>
<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Performances</h1>
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
                  return-object
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Instrument
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instrumentFilterSelection"
                  :items="instrumentFilterOptions"
                  item-title="name"
                  return-object
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Event Type
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="eventTypeFilterSelection"
                  :items="eventTypeFilterOptions"
                  item-title="type"
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
              v-if="
                semesterFilterSelection.length != 0 ||
                instrumentFilterSelection.length != 0 ||
                eventTypeFilterSelection.length != 0
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
          semesterFilterSelection.length != 0 ||
          instrumentFilterSelection.length != 0 ||
          eventTypeFilterSelection.length != 0
        "
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="performance in currentPageData"
              :key="performance.id"
              cols="12"
            >
              <StudentPerformanceCard
                :performance="performance"
              ></StudentPerformanceCard>
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
