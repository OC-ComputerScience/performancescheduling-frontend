<script setup>
import { ref, onMounted, computed } from "vue";
import EventTypeDataService from "../../../../services/EventTypeDataService.js";
import MaintainEventTypeCard from "./MaintainEventTypeCard.vue";
import EventTypeDialogBody from "./EventTypeDialogBody.vue";

const addEventTypeDialog = ref(false);

// Event Type Data
const eventTypes = ref([]);
const filteredEventTypes = ref([]);

async function getEventTypes() {
  await EventTypeDataService.getAll("type")
    .then((response) => {
      eventTypes.value = response.data;
      filteredEventTypes.value = eventTypes.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshEventTypes() {
  await getEventTypes();
  await filterEventTypes();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of eventTypes by type, based on searchInput
function searchFilteredList() {
  filteredEventTypes.value = eventTypes.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredEventTypes.value = filteredEventTypes.value.filter((et) =>
    et.type.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

const slotTypeFilterOptions = ["Flexible", "Fixed"];

const slotTypeFilterSelection = ref(null);

const instrumentTypeFilterOptions = ["Instrument", "Vocal", "Both"];

const instrumentTypeFilterSelection = ref(null);

function filterEventTypes() {
  // Never clear the search filter, so filter by that first, then the actual filters
  searchFilteredList();
  // Filter by status
  if (statusFilterSelection.value) {
    filteredEventTypes.value = filteredEventTypes.value.filter(
      (et) => et.status === statusFilterSelection.value
    );
  }

  // Filter by slot type
  if (slotTypeFilterSelection.value) {
    filteredEventTypes.value = filteredEventTypes.value.filter(
      (et) => et.slotType === slotTypeFilterSelection.value
    );
  }

  // Filter by instrument type
  if (instrumentTypeFilterSelection.value) {
    filteredEventTypes.value = filteredEventTypes.value.filter(
      (et) => et.instrumentType === instrumentTypeFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredEventTypes.value = eventTypes.value;
  statusFilterSelection.value = null;
  slotTypeFilterSelection.value = null;
  instrumentTypeFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredEventTypes.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getEventTypes();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Event Types</h1>

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
            Filter Event Types
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
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Slot Type
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="slotTypeFilterSelection"
                  :items="slotTypeFilterOptions"
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Instrument Type
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instrumentTypeFilterSelection"
                  :items="instrumentTypeFilterOptions"
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterEventTypes(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                statusFilterSelection ||
                slotTypeFilterSelection ||
                instrumentTypeFilterSelection
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
          statusFilterSelection ||
          slotTypeFilterSelection ||
          instrumentTypeFilterSelection
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
        @click="addEventTypeDialog = true"
      >
        Add new event type
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="eventType in currentPageData"
              :key="eventType.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainEventTypeCard
                :event-type-data="eventType"
                @refreshEventTypesEvent="refreshEventTypes()"
              ></MaintainEventTypeCard>
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
            :length="Math.round(filteredEventTypes.length / perPage + 1)"
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addEventTypeDialog" persistent max-width="600px">
    <EventTypeDialogBody
      :is-edit="false"
      :event-type-data="{
        id: null,
        type: null,
        slotType: null,
        instrumentType: null,
        description: null,
        defaultSlotDuration: null,
        isPrivate: false,
        allowGrade: false,
        allowEndingLeve: false,
        status: 'Active',
      }"
      @closeAddEventTypeDialogEvent="addEventTypeDialog = false"
      @addEventTypeSuccessEvent="
        (addEventTypeDialog = false), refreshEventTypes()
      "
    ></EventTypeDialogBody>
  </v-dialog>
</template>
