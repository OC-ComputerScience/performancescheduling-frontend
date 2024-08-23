<script setup>
import { ref, onMounted, computed } from "vue";
import LocationDataService from "./../../../../services/LocationDataService";
import MaintainLocationCard from "./MaintainLocationCard.vue";
import LocationDialogBody from "./LocationDialogBody.vue";

const addLocationDialog = ref(false);

// Location Data
const locations = ref([]);
const filteredLocations = ref([]);

async function getLocations() {
  await LocationDataService.getAll("roomName")
    .then((response) => {
      locations.value = response.data;
      filteredLocations.value = locations.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshLocations() {
  await getLocations();
  await searchAndFilterList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of locations by first and last name, based on searchInput
function searchAndFilterList() {
  filteredLocations.value = locations.value;
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value != "")
    filteredLocations.value = filteredLocations.value.filter((location) =>
      location.roomName.toLowerCase().includes(searchInput.value.toLowerCase())
    );

  filterLocations();
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

function filterLocations() {
  filteredLocations.value = filteredLocations.value.filter(
    (location) =>
      !statusFilterSelection.value ||
      location.status === statusFilterSelection.value
  );
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredLocations.value = locations.value;
  statusFilterSelection.value = null;

  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredLocations.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getLocations();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">Locations</h1>

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
            Filter Locations
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
              v-if="
                statusFilterSelection != null ||
                locationTypeFilterSelection != null
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
          statusFilterSelection != null || locationTypeFilterSelection != null
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
        @click="addLocationDialog = true"
      >
        Add new Location
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="location in currentPageData"
              :key="location.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainLocationCard
                :location-data="location"
                @refreshLocationsEvent="refreshLocations()"
              ></MaintainLocationCard>
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
              filteredLocations.length % perPage == 0
                ? filteredLocations.length / perPage
                : Math.floor(filteredLocations.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addLocationDialog" persistent max-width="600px">
    <LocationDialogBody
      :is-edit="false"
      :location-data="{
        id: null,
        roomName: null,
        roomNumber: null,
        building: null,
        status: 'Active',
      }"
      @closeAddLocationDialogEvent="addLocationDialog = false"
      @addLocationSuccessEvent="(addLocationDialog = false), refreshLocations()"
    ></LocationDialogBody>
  </v-dialog>
</template>
