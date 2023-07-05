<script setup>
import MainNav from "../components/MainNav.vue";

import StudentHome from "../components/student/StudentHome.vue";
import StudentPerformances from "../components/student/StudentPerformances.vue";
import StudentSettings from "../components/student/StudentSettings.vue";

import FacultyHome from "../components/faculty/FacultyHome.vue";

import AdminHome from "../components/admin/AdminHome.vue";
import MaintainUsers from "../components/admin/maintain/users/MaintainUsers.vue";
import MaintainMajors from "../components/admin/maintain/majors/MaintainMajors.vue";
import MaintainSemesters from "../components/admin/maintain/semesters/MaintainSemesters.vue";
import MaintainEvents from "../components/admin/maintain/events/MaintainEvents.vue";
</script>

<template>
  <v-container fluid class="fill-height">
    <v-row class="fill-height">
      <v-col class="bg-lightGray">
        <MainNav></MainNav>
        <!-- Student pages -->
        <StudentHome
          v-if="this.$route.fullPath === '/studentHome'"
        ></StudentHome>
        <StudentSettings
          v-if="this.$route.fullPath === '/studentSettings'"
        ></StudentSettings>
        <StudentPerformances
          v-if="this.$route.fullPath === '/studentPerformances'"
        ></StudentPerformances>
        <!-- Faculty/Accompanist pages -->
        <FacultyHome
          v-if="
            this.$route.fullPath === '/facultyHome' ||
            this.$route.fullPath === '/accompanistHome'
          "
        >
        </FacultyHome>
        <!-- Admin pages -->
        <AdminHome v-if="this.$route.fullPath === '/adminHome'"> </AdminHome>
        <MaintainUsers
          v-if="this.$route.fullPath === '/adminUsers'"
        ></MaintainUsers>
        <MaintainMajors
          v-if="this.$route.fullPath === '/adminMajors'"
        ></MaintainMajors>
        <MaintainSemesters
          v-if="this.$route.fullPath === '/adminSemesters'"
        ></MaintainSemesters>
        <MaintainEvents
          v-if="this.$route.fullPath === '/adminEvents'"
        ></MaintainEvents>
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
