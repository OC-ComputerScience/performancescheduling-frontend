<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "../../../stores/LoginStore";
import EventDataService from "../../../services/EventDataService";
import FacultyCritiqueCard from "./FacultyCritiqueCard.vue";

const router = useRouter();
const LoginStore = useLoginStore();

//user variable
const currentFaculty = ref({});
//event variables
const eventData = ref({});
const event = ref({});
const filteredSignups = ref([]);
//filter variables
const filterMenuBool = ref(false);
const feedbackFilterArray = ["All", "Not Given", "Given"];
const feedbackFilterSelection = ref("All");
const gradeFilterArray = ["All", "Not Given", "Given"];
const gradeFilterSelection = ref("All");

async function getData() {
  const eventId = router.currentRoute.value.query.eventId;
  currentFaculty.value = LoginStore.currentRole;

  await EventDataService.getById(eventId)
    .then((response) => {
      event.value = response.data;
    })
    .catch((error) => {
      console.log(error);
    });

  await EventDataService.getStudentTimeslotsForEvent(eventId)
    .then((response) => {
      eventData.value = response.data[0];
    })
    .catch((error) => {
      console.log(error);
    });

  filterSignups();
}

function filterSignups() {
  filteredSignups.value = eventData.value.eventSignups.filter((signup) => {
    var matchesFilter = true;

    //filter by pass/not passed first because it is less resource intensive
    if (gradeFilterSelection.value !== "All") {
      matchesFilter =
        gradeFilterSelection.value === "Given"
          ? signup.pass != null
          : signup.pass == null;
    }

    if (matchesFilter && feedbackFilterSelection.value !== "All") {
      const feedbackGiven = signup.eventSignupPieces.some((signupPiece) =>
        signupPiece.critiques.some(
          (critique) => critique.userRoleId == currentFaculty.value.id
        )
      );

      matchesFilter =
        feedbackFilterSelection.value === "Given"
          ? feedbackGiven
          : !feedbackGiven;
    }

    return matchesFilter;
  });
}

function clearFilters() {
  feedbackFilterSelection.value = "All";
  gradeFilterSelection.value = "All";

  filteredSignups.value = eventData.value.eventSignups;
}

onMounted(async () => {
  await getData();
  filterSignups();
});
</script>
<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">
        {{ event.name }} Critiques
      </h1>

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
            Filter Signups
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Your Feedback
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="feedbackFilterSelection"
                  :items="feedbackFilterArray"
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Pass/Not Pass Grade
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="gradeFilterSelection"
                  :items="gradeFilterArray"
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterSignups(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                feedbackFilterSelection != 'All' ||
                gradeFilterSelection != 'All'
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
        v-if="feedbackFilterSelection != 'All' || gradeFilterSelection != 'All'"
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear Filters
      </v-btn>
    </v-row>
    <v-row class="ml-1"
      ><v-text class="text-maroon font-weight-bold text-h5">
        {{ event.date }}</v-text
      ></v-row
    >
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col v-for="signup in filteredSignups" :key="signup.id" cols="12">
              <FacultyCritiqueCard
                :signup="signup"
                :eventData="eventData"
                @dialogClosedEvent="getData()"
              ></FacultyCritiqueCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
