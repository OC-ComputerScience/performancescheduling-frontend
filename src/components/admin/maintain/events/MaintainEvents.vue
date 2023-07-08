<script setup>
import { ref, onMounted, computed } from "vue";
import { formatDate } from "../../../../composables/dateFormatter";
import EventDataService from "../../../../services/EventDataService.js";
import EventDialogBody from "./EventDialogBody.vue";
import MaintainEventCard from "./MaintainEventCard.vue";

const addEventDialog = ref(false);

// event data
const events = ref([]);
const filteredEvents = ref([]);

async function getData() {
  await EventDataService.getAll("date", false)
    .then((response) => {
      events.value = response.data;
      filteredEvents.value = events.value;
    })
    .catch((err) => {
      console.log(err);
    });

  semesterFilterOptions.value = Array.from(
    events.value
      .reduce(
        (acc, event) => acc.set(event.semester.id, event.semester),
        new Map()
      )
      .values()
  );
  locationFilterOptions.value = Array.from(
    events.value
      .reduce(
        (acc, event) => acc.set(event.location.id, event.location),
        new Map()
      )
      .values()
  );
}

async function refreshEvents() {
  await getData();
  filterEvents();
}

const searchInput = ref("");

// Search filter
function searchFilteredList() {
  filterEvents(true);
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredEvents.value = filteredEvents.value.filter((event) => {
    return (
      event.name.toLowerCase().includes(searchInput.value.toLowerCase()) ||
      formatDate(event.date).includes(searchInput.value)
    );
  });
}

const filterMenuBool = ref(false);
const semesterFilterOptions = ref([]);
const semesterFilterSelection = ref(null);
const locationFilterOptions = ref([]);
const locationFilterSelection = ref(null);

function filterEvents(fromSearch = false) {
  filteredEvents.value = events.value;

  filteredEvents.value = filteredEvents.value.filter((event) => {
    return (
      (!semesterFilterSelection.value ||
        event.semester.id === semesterFilterSelection.value.id) &&
      (!locationFilterSelection.value ||
        event.location.id === locationFilterSelection.value.id)
    );
  });

  if (!fromSearch) {
    // Never clear the serach filter, so filter by that first, then the actual filters
    searchFilteredList();
  }
}

function clearFilters() {
  currentPage.value = 1;
  filteredEvents.value = events.value;
  semesterFilterSelection.value = null;
  locationFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination
const currentPage = ref(1);
const perPage = 9;

const currentPageData = computed(() => {
  return filteredEvents.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getData();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">Events</h1>

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
            Filter events
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
                Location
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="locationFilterSelection"
                  :items="locationFilterOptions"
                  item-title="roomName"
                  return-object
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterEvents(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="semesterFilterSelection || locationFilterSelection"
              @click="clearFilters"
              class="bg-maroon ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="semesterFilterSelection || locationFilterSelection"
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
        @click="addEventDialog = true"
      >
        Add new Event
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="event in currentPageData"
              :key="event.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainEventCard
                :event-data="event"
                @refreshEventsEvent="refreshEvents()"
              ></MaintainEventCard>
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
              filteredEvents.length % perPage == 0
                ? filteredEvents.length / perPage
                : Math.floor(filteredEvents.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addEventDialog" persistent max-width="600px">
    <EventDialogBody
      :is-edit="false"
      :event-data="{
        id: null,
        name: null,
        date: null,
        startTime: null,
        endTime: null,
        isReady: false,
        eventTypeId: null,
        semesterId: null,
        locationId: null,
      }"
      @closeAddEventDialogEvent="addEventDialog = false"
      @addEventSuccessEvent="(addEventDialog = false), refreshEvents()"
    ></EventDialogBody>
  </v-dialog>
</template>
