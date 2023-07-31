<script setup>
import MainNav from "../components/MainNav.vue";

import StudentHome from "../components/student/StudentHome.vue";
import StudentPerformances from "../components/student/StudentPerformances.vue";
// import StudentSettings from "../components/student/StudentSettings.vue";

import FacultyHome from "../components/faculty/FacultyHome.vue";

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
console.log("fullPath.value: ", fullPath);
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col class="bg-lightGray">
        <MainNav></MainNav>
        <!-- Student pages -->
        <StudentHome v-if="fullPath === '/studentHome'"></StudentHome>
        <!-- <StudentSettings
          v-if="fullPath === '/studentSettings'"
        ></StudentSettings> -->
        <StudentPerformances
          v-if="fullPath === '/studentPerformances'"
        ></StudentPerformances>
        <!-- Faculty/Accompanist pages -->
        <FacultyHome
          v-if="fullPath === '/facultyHome' || fullPath === '/accompanistHome'"
        >
        </FacultyHome>
        <!-- Admin pages -->
        <AdminHome v-if="fullPath === '/adminHome'"> </AdminHome>
        <MaintainUsers v-if="fullPath === '/adminUsers'"></MaintainUsers>
        <MaintainComposers
          v-if="fullPath === '/adminComposers'"
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
        <MaintainPieces v-if="fullPath === '/adminPieces'"></MaintainPieces>
        <MaintainLocations
          v-if="fullPath === '/adminLocations'"
        ></MaintainLocations>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
