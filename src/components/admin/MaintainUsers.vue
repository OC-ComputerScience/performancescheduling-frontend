<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";

const loginStore = useLoginStore();
const performances = ref([]);
const filteredPerforamces = ref([]);
const filterMenuBool = ref(false);
let semesterFilterArray = [];
let instrumentFilterArray = [];
let eventTypeFilterArray = [];

const semesterFilter = ref({ id: 0, name: "" });
const instrumentFilter = ref({ id: 0, name: "" });
const eventTypeFilter = ref({ id: 0, type: "" });

function fillFilterArrays() {
  semesterFilterArray = [{ id: 0, name: "" }];
  instrumentFilterArray = [{ id: 0, name: "" }];
  eventTypeFilterArray = [{ id: 0, type: "" }];
  for (const performance of performances.value) {
    if (
      !semesterFilterArray.find(
        (obj) => obj.id === performance.event.semester.id
      )
    ) {
      semesterFilterArray.push(performance.event.semester);
    }

    if (
      !instrumentFilterArray.find(
        (obj) =>
          obj.id ===
          performance.studentInstrumentSignups[0].studentInstrument.instrument
            .id
      )
    ) {
      instrumentFilterArray.push(
        performance.studentInstrumentSignups[0].studentInstrument.instrument
      );
    }

    if (
      !eventTypeFilterArray.find(
        (obj) => obj.id === performance.event.eventType.id
      )
    ) {
      eventTypeFilterArray.push(performance.event.eventType);
    }
  }

  clearFilters();
}

function clearFilters() {
  semesterFilter.value = semesterFilterArray[0];
  instrumentFilter.value = instrumentFilterArray[0];
  eventTypeFilter.value = eventTypeFilterArray[0];
  updateFilter();
}

function updateFilter() {
  filteredPerforamces.value = [];

  performances.value.forEach((performance) => {
    if (
      (semesterFilter.value.id === 0 ||
        semesterFilter.value.id === performance.event.semester.id) &&
      (instrumentFilter.value.id === 0 ||
        instrumentFilter.value.id ===
          performance.studentInstrumentSignups[0].studentInstrument.instrument
            .id) &&
      (eventTypeFilter.value.id === 0 ||
        eventTypeFilter.value.id === performance.event.eventType.id)
    ) {
      filteredPerforamces.value.push(performance);
    }
  });
}

onMounted(async () => {});
</script>
<template>
  <v-container fluid class="ma-0 pa-4">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Performances</h1>
      <v-menu v-model="filterMenuBool" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            size="small"
            class="font-weight-bold text-darkBlue mt-3 ml-6"
            v-bind="props"
            width="13%"
            elevation="1"
            style="font-size: 80%"
          >
            <template v-slot:append>
              <v-icon
                :icon="filterMenuBool ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></v-icon>
            </template>
            Filter and Sort
          </v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item title="Semester">
              <v-select
                v-model="semesterFilter"
                @update:model-value="updateFilter"
                :items="semesterFilterArray"
                item-title="name"
                return-object
              ></v-select>
            </v-list-item>
            <v-list-item title="Instrument">
              <v-select
                v-model="instrumentFilter"
                @update:model-value="updateFilter"
                :items="instrumentFilterArray"
                item-title="name"
                return-object
              ></v-select>
            </v-list-item>
            <v-list-item title="Event Type">
              <v-select
                v-model="eventTypeFilter"
                @update:model-value="updateFilter"
                :items="eventTypeFilterArray"
                item-title="type"
                return-object
              ></v-select>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <v-btn
        v-if="
          semesterFilter.id != 0 ||
          instrumentFilter.id != 0 ||
          eventTypeFilter.id != 0
        "
        size="small"
        color="maroon"
        class="font-weight-bold mt-3 ml-6"
        width="13%"
        elevation="1"
        style="font-size: 80%"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5" elevation="0">
          <v-row>
            <v-col v-for="performance in filteredPerforamces" cols="12">
              <StudentPerformanceCard
                :performance="performance"
              ></StudentPerformanceCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
