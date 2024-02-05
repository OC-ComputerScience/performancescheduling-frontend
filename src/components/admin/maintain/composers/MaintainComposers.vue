<script setup>
import { ref, onMounted, computed } from "vue";
import ComposerDataService from "./../../../../services/ComposerDataService";
import MaintainComposerCard from "./MaintainComposerCard.vue";
import ComposerDialogBody from "./ComposerDialogBody.vue";

const addComposerDialog = ref(false);
const props = defineProps({
  query: {
    type: String,
    required: false,
  },
});

// Composer Data
const composers = ref([]);
const filteredComposers = ref([]);

async function getComposers() {
  await ComposerDataService.getAll("lastName", "firstName")
    .then((response) => {
      composers.value = response.data;
      filteredComposers.value = composers.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshComposers() {
  await getComposers();
  await searchAndFilterList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of composers by first and last name, based on searchInput
function searchAndFilterList() {
  filteredComposers.value = composers.value;
  // If the search input is empty, return the full list, otherwise filter

  if (searchInput.value != "") {
    filteredComposers.value = filteredComposers.value.filter((composer) => {
      let searchName = "";
      if (composer.firstName != null)
        searchName = composer.firstName.toLowerCase();
      if (composer.lastName != null)
        searchName += composer.lastName.toLowerCase();
      return searchName.includes(searchInput.value.toLowerCase());
    });
    filterComposers();
  }
}
const statusFilterOptions = ["Active", "Disabled", "Pending"];
const statusFilterSelection = ref(null);

function setStatusFilterSelection() {
  if (props.query) {
    statusFilterSelection.value = props.query;
  }
}

function filterComposers() {
  // Filter by status
  if (statusFilterSelection.value) {
    filteredComposers.value = filteredComposers.value.filter(
      (composer) => composer.status === statusFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredComposers.value = composers.value;
  statusFilterSelection.value = null;
  searchInput.value = "";
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredComposers.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  setStatusFilterSelection();
  refreshComposers();
});
</script>

<template>
  <div>
    <v-container fluid class="pa-8">
      <v-row class="ml-1">
        <h1 class="text-maroon font-weight">Composers</h1>

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
              Filter composers
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
          Clear Filters
        </v-btn>
        <v-btn
          size="medium"
          color="blue"
          class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
          @click="addComposerDialog = true"
        >
          Add new composer
        </v-btn>
      </v-row>
      <v-row>
        <v-col>
          <v-card class="pa-5 mainCardBorder">
            <v-row>
              <v-col
                v-for="composer in currentPageData"
                :key="composer.id"
                cols="12"
                md="6"
                lg="4"
              >
                <MaintainComposerCard
                  :composer-data="composer"
                  @refreshComposersEvent="refreshComposers()"
                ></MaintainComposerCard>
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
                filteredComposers.length % perPage == 0
                  ? filteredComposers.length / perPage
                  : Math.floor(filteredComposers.length / perPage) + 1
              "
              :total-visible="7"
              v-model="currentPage"
            ></v-pagination>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-dialog v-model="addComposerDialog" persistent max-width="600px">
      <ComposerDialogBody
        :is-edit="false"
        :is-admin="true"
        :composer-data="{
          id: null,
          firstName: null,
          lastName: null,
          dateOfBirth: null,
          dateOfDeath: null,
          nationality: null,
          status: 'Active',
        }"
        :composers-data="composers"
        @closeAddComposerDialogEvent="addComposerDialog = false"
        @addComposerSuccessEvent="
          (addComposerDialog = false), refreshComposers()
        "
      ></ComposerDialogBody>
    </v-dialog>
  </div>
</template>
