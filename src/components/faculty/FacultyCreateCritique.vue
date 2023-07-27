<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useLoginStore } from "../../stores/LoginStore";
import EventDataService from "../../services/EventDataService";
import FacultyCritiqueCard from "./FacultyCritiqueCard.vue";

const router = useRouter();
const LoginStore = useLoginStore();

//user variable
const currentFaculty = ref({});
//event variables
const eventData = ref({});
const filteredSignups = ref([]);
//filter variables
const filterMenuBool = ref(false);
const feedbackFilterArray = ["Not Given", "Given", "All"];
const feedbackFilterSelection = ref("Not Given");
const gradeFilterArray = ["Not Given", "Given", "All"];
const gradeFilterSelection = ref("Not Given");

async function getData() {
  const eventId = router.currentRoute.value.query.eventId;

  await EventDataService.getStudentTimeslotsForEvent(eventId)
    .then((response) => {
      eventData.value = response.data[0];
      clearFilters();
    })
    .catch((error) => {
      console.log(error);
    });

  currentFaculty.value = LoginStore.currentRole;
}

function filterSignups() {
  filteredSignups.value = eventData.value.eventSignups.filter((signup) => {
    var matchesFilter = true;

    //filter by pass/fail first because it is less resource intensive
    if (gradeFilterSelection.value !== "All") {
      matchesFilter =
        gradeFilterSelection.value === "Given"
          ? signup.pass != null
          : signup.pass == null;
    }

    if (matchesFilter && feedbackFilterArray.value !== "All") {
      const feedbackGiven = signup.critiques.some(
        (critique) => critique.userRoleId == currentFaculty.value.id
      );

      matchesFilter =
        feedbackFilterArray.value === "Given" ? feedbackGiven : !feedbackGiven;
    }

    return matchesFilter;
  });
}

function clearFilters() {
  feedbackFilterSelection.value = "Not Given";
  gradeFilterSelection.value = "Not Given";

  filteredSignups.value = eventData.value.eventSignups.filter(
    (signup) =>
      signup.pass == null &&
      !signup.eventSignupPieces.some((signupPiece) =>
        signupPiece.critiques.some(
          (critique) => critique.userRoleId == currentFaculty.value.id
        )
      )
  );
}

onMounted(async () => {
  await getData();
});
</script>
<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">
        Faculty Event Critiques
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
            Filter signups
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
                Pass/Fail Grade
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
                feedbackFilterSelection != 'Not Given' ||
                gradeFilterSelection != 'Not Given'
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
          feedbackFilterSelection != 'Not Given' ||
          gradeFilterSelection != 'Not Given'
        "
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col v-for="signup in filteredSignups" :key="signup.id" cols="12">
              <FacultyCritiqueCard :signup="signup"></FacultyCritiqueCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
