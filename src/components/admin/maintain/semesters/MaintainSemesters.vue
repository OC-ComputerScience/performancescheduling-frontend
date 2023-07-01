<script setup>
import { ref, onMounted, computed } from "vue";
import SemesterDataService from "./../../../../services/SemesterDataService";
import MaintainSemesterCard from "./MaintainSemesterCard.vue";
import SemesterDialogBody from "./SemesterDialogBody.vue";

const addSemesterDialog = ref(false);

// Semester Data
const semesters = ref([]);
const filteredSemesters = ref([]);

async function getSemesters() {
  await SemesterDataService.getAll("name")
    .then((response) => {
      semesters.value = response.data;
      filteredSemesters.value = semesters.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshSemesters() {
  await getSemesters();
}

const searchInput = ref("");

// Search filter
// Filters the list of Semesters by first and last name, based on searchInput
function searchFilteredList() {
  filteredSemesters.value = semesters.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredSemesters.value = filteredSemesters.value.filter((semester) =>
    semester.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredSemesters.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getSemesters();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Semesters</h1>

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
        @click="addSemesterDialog = true"
      >
        Add new Semester
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="semester in currentPageData"
              :key="semester.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainSemesterCard
                :semester-data="semester"
                @refreshSemestersEvent="refreshSemesters()"
              ></MaintainSemesterCard>
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
              filteredSemesters.length % perPage == 0
                ? filteredSemesters.length / perPage
                : Math.floor(filteredSemesters.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addSemesterDialog" persistent max-width="600px">
    <SemesterDialogBody
      :is-edit="false"
      :semester-data="{
        id: null,
        name: null,
        startDate: null,
        endDate: null,
        status: 'Active',
      }"
      @closeAddSemesterDialogEvent="addSemesterDialog = false"
      @addSemesterSuccessEvent="(addSemesterDialog = false), refreshSemesters()"
    ></SemesterDialogBody>
  </v-dialog>
</template>

<style scoped></style>
