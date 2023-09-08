<script setup>
import { ref, onMounted, computed } from "vue";
import StudentInstrumentDataService from "./../../../services/StudentInstrumentDataService";
import UserInstrumentDialogBody from "./../../admin/maintain/users/UserInstrumentDialogBody.vue";
import UserInstrumentCard from "./../../admin/maintain/users/UserInstrumentCard.vue";
import { useLoginStore } from "./../../../stores/LoginStore.js";

const addStudentInstrumentDialog = ref(false);
const loginStore = useLoginStore();
// Student Instrument Data
const studentinstruments = ref([]);
const filteredStudentInstruments = ref([]);

async function getStudentInstruments() {
  await StudentInstrumentDataService.getByUser(loginStore.currentRole.userId)
    .then((response) => {
      studentinstruments.value = response.data;
      filteredStudentInstruments.value = studentinstruments.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

const filterMenuBool = ref(false);

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

async function refreshStudentInstruments() {
  await getStudentInstruments();
  filterStudentInstruments();
}

// Filtering

function filterStudentInstruments() {
  // Filter by status
  if (statusFilterSelection.value) {
    currentPage.value = 1;
    filteredStudentInstruments.value = studentinstruments.value;
    filteredStudentInstruments.value = filteredStudentInstruments.value.filter(
      (studentinstrument) =>
        studentinstrument.status === statusFilterSelection.value
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredStudentInstruments.value = studentinstruments.value;
  statusFilterSelection.value = null;
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredStudentInstruments.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

function closeAddInstrumentDialog() {
  addStudentInstrumentDialog.value = false;
}

onMounted(async () => {
  await getStudentInstruments();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Instruments</h1>

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
            Filter Instruments
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
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterStudentInstruments(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                statusFilterSelection != null || semesterFilterSelection != null
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
        v-if="statusFilterSelection != null"
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
        @click="addStudentInstrumentDialog = true"
      >
        Add new Instrument
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="studentinstrument in currentPageData"
              :key="studentinstrument.id"
              cols="12"
              md="6"
              lg="4"
            >
              <UserInstrumentCard
                :student-instrument-data="studentinstrument"
                @refreshStudentInstrumentsEvent="refreshStudentInstruments()"
              ></UserInstrumentCard>
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
              filteredStudentInstruments.length % perPage == 0
                ? filteredStudentInstruments.length / perPage
                : Math.floor(filteredStudentInstruments.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addStudentInstrumentDialog" persistent max-width="600px">
    <UserInstrumentDialogBody
      :is-edit="false"
      :student-instrument-data="{
        id: null,
        status: 'Active',
        levelId: null,
        studentRoleId: loginStore.currentRole.id,
        instructorRoleId: null,
        accompanistRoleId: null,
        instrumentId: null,
        instructorRole: null,
        accompanistRole: null,
        instrument: null,
        level: null,
      }"
      @addInstrumentSuccessEvent="
        closeAddInstrumentDialog(), refreshStudentInstruments()
      "
      @closeUserInstrumentDialogEvent="closeAddInstrumentDialog"
    ></UserInstrumentDialogBody>
  </v-dialog>
</template>
