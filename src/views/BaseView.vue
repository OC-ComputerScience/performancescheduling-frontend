<script setup>
import MainNav from "../components/MainNav.vue";
import UserSettings from "../components/UserSettings.vue"
import Help from "../components/Help.vue"

import StudentHome from "../components/student/StudentHome.vue";
import StudentPerformances from "../components/student/performances/StudentPerformances.vue";
import StudentRepertoire from "../components/student/repertoire/StudentRepertoire.vue";
import StudentInstruments from "../components/student/instruments/StudentInstruments.vue";

import FacultyHome from "../components/faculty/FacultyHome.vue";
import FacultyPerformances from "../components/faculty/FacultyPerformances.vue";
import FacultyCreateCritique from "../components/faculty/critique/FacultyCreateCritique.vue";

import AdminHome from "../components/admin/AdminHome.vue";
import MaintainUsers from "../components/admin/maintain/users/MaintainUsers.vue";
import MaintainEventTypes from "../components/admin/maintain/eventTypes/MaintainEventTypes.vue";
import MaintainLevels from "../components/admin/maintain/levels/MaintainLevels.vue";
import MaintainMajors from "../components/admin/maintain/majors/MaintainMajors.vue";
import MaintainSemesters from "../components/admin/maintain/semesters/MaintainSemesters.vue";
import MaintainEvents from "../components/admin/maintain/events/MaintainEvents.vue";
import MaintainInstruments from "../components/admin/maintain/instruments/MaintainInstruments.vue";
import MaintainComposers from "../components/admin/maintain/composers/MaintainComposers.vue";
import MaintainPieces from "../components/admin/maintain/pieces/MaintainPieces.vue";
import MaintainLocations from "../components/admin/maintain/locations/MaintainLocations.vue";

import { useRoute } from "vue-router";

import { computed } from "vue";

const route = useRoute();
const fullPath = computed(() => route.path);

const props = defineProps({
  query: {
    type: String,
    required: false,
  },
});
</script>

<template>
  <div>
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col class="bg-lightGray">
          <MainNav></MainNav>
          <UserSettings
          v-if="fullPath === '/userSettings'"
        ></UserSettings>
        <Help
          v-if="fullPath === '/help'"
        ></Help>
          <!-- Student pages -->
          <StudentHome v-if="fullPath === '/studentHome'"></StudentHome>
          <StudentPerformances
            v-if="fullPath === '/studentPerformances'"
          ></StudentPerformances>
          <StudentInstruments
            v-if="fullPath === '/studentInstruments'"
          ></StudentInstruments>

          <StudentRepertoire
            v-if="fullPath === '/studentRepertoire'"
          ></StudentRepertoire>
          <!-- Faculty/Accompanist pages -->
          <FacultyHome
            v-if="
              fullPath === '/facultyHome' || (fullPath === '/accompanistHome')
            "
          >
          </FacultyHome>

          <FacultyPerformances v-if="fullPath === '/facultyPerformances'">
          </FacultyPerformances>

          <FacultyCreateCritique
            v-if="fullPath === '/facultyCreateCritique'"
          ></FacultyCreateCritique>

          <MaintainPieces v-if="fullPath === '/facultyPieces'"></MaintainPieces>
          <MaintainUsers v-if="fullPath === '/facultyStudents'"></MaintainUsers>
          <!-- Admin pages -->
          <AdminHome v-if="fullPath === '/adminHome'"> </AdminHome>
          <MaintainUsers v-if="fullPath === '/adminUsers'"></MaintainUsers>
          <MaintainComposers
            v-if="fullPath === '/adminComposers'"
            :query="props.query"
          ></MaintainComposers>
          <MaintainEventTypes
            v-if="fullPath === '/adminEventTypes'"
          ></MaintainEventTypes>
          <MaintainLevels v-if="fullPath === '/adminLevels'"></MaintainLevels>
          <MaintainMajors v-if="fullPath === '/adminMajors'"></MaintainMajors>
          <MaintainSemesters
            v-if="fullPath === '/adminSemesters'"
          ></MaintainSemesters>
          <MaintainEvents v-if="fullPath === '/adminEvents'"></MaintainEvents>
          <MaintainInstruments
            v-if="fullPath === '/adminInstruments'"
          ></MaintainInstruments>
          <MaintainPieces
            v-if="fullPath === '/adminPieces'"
            :query="props.query"
          ></MaintainPieces>
          <MaintainLocations
            v-if="fullPath === '/adminLocations'"
          ></MaintainLocations>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
