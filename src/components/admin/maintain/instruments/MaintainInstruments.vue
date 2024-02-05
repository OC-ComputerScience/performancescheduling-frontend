<script setup>
import { ref, onMounted, computed } from "vue";
import InstrumentDataService from "./../../../../services/InstrumentDataService";
import MaintainInstrumentCard from "./MaintainInstrumentCard.vue";
import InstrumentDialogBody from "./InstrumentDialogBody.vue";

const addInstrumentDialog = ref(false);

// Instrument Data
const instruments = ref([]);
const filteredInstruments = ref([]);

async function getInstruments() {
  await InstrumentDataService.getAll("name")
    .then((response) => {
      instruments.value = response.data;
      filteredInstruments.value = instruments.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshInstruments() {
  await getInstruments();
  await searchAndFilterList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of instruments by first and last name, based on searchInput
function searchAndFilterList() {
  filteredInstruments.value = instruments.value;
  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value != "")
    filteredInstruments.value = filteredInstruments.value.filter((instrument) =>
      instrument.name.toLowerCase().includes(searchInput.value.toLowerCase())
    );

  filterInstruments();
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

const instrumentTypeFilterOptions = ["Vocal", "Instrument"];

const instrumentTypeFilterSelection = ref(null);

function filterInstruments() {
  filteredInstruments.value = filteredInstruments.value.filter(
    (instrument) =>
      (!statusFilterSelection.value ||
        instrument.status === statusFilterSelection.value) &&
      (!instrumentTypeFilterSelection.value ||
        instrument.type === instrumentTypeFilterSelection.value)
  );
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredInstruments.value = instruments.value;
  statusFilterSelection.value = null;
  instrumentTypeFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredInstruments.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getInstruments();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Instruments</h1>

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
            Filter instruments
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
                Instrument Type
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instrumentTypeFilterSelection"
                  :items="instrumentTypeFilterOptions"
                  item-title="title"
                  item-value="value"
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
                instrumentTypeFilterSelection != null
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
          statusFilterSelection != null || instrumentTypeFilterSelection != null
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
        @click="addInstrumentDialog = true"
      >
        Add new instrument
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="instrument in currentPageData"
              :key="instrument.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainInstrumentCard
                :instrument-data="instrument"
                @refreshInstrumentsEvent="refreshInstruments()"
              ></MaintainInstrumentCard>
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
              filteredInstruments.length % perPage == 0
                ? filteredInstruments.length / perPage
                : Math.floor(filteredInstruments.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addInstrumentDialog" persistent max-width="600px">
    <InstrumentDialogBody
      :is-edit="false"
      :instrument-data="{
        id: null,
        name: null,
        isMusicInstrument: false,
        status: 'Active',
      }"
      @closeAddInstrumentDialogEvent="addInstrumentDialog = false"
      @addInstrumentSuccessEvent="
        (addInstrumentDialog = false), refreshInstruments()
      "
    ></InstrumentDialogBody>
  </v-dialog>
</template>
