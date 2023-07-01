<script setup>
import { ref, onMounted, computed } from "vue";
import LevelDataService from "./../../../../services/LevelDataService";
import MaintainLevelCard from "./MaintainLevelCard.vue";
import LevelDialogBody from "./LevelDialogBody.vue";

const addLevelDialog = ref(false);

// Levels Data
const levels = ref([]);
const filteredLevels = ref([]);

async function getLevels() {
  await LevelDataService.getAll("name")
    .then((response) => {
      levels.value = response.data;
      filteredLevels.value = levels.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshLevels() {
  await getLevels();
}

const searchInput = ref("");

// Search filter
// Filters the list of Levelss by first and last name, based on searchInput
function searchFilteredList() {
  filteredLevels.value = levels.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredLevels.value = filteredLevels.value.filter((levels) =>
    levels.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredLevels.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getLevels();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Levels</h1>

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

      <v-btn
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addLevelDialog = true"
      >
        Add new Levels
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="level in currentPageData"
              :key="level.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainLevelCard
                :level-data="level"
                @refreshLevelsEvent="refreshLevels()"
              ></MaintainLevelCard>
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
              filteredLevels.length % perPage == 0
                ? filteredLevels.length / perPage
                : Math.floor(filteredLevels.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addLevelDialog" persistent max-width="600px">
    <LevelDialogBody
      :is-edit="false"
      :levelData="{
        id: null,
        name: null,
        description: null,
        hours: null,
        status: 'Active',
      }"
      @closeAddLevelDialogEvent="addLevelDialog = false"
      @addLevelSuccessEvent="(addLevelDialog = false), refreshLevels()"
    ></LevelDialogBody>
  </v-dialog>
</template>
