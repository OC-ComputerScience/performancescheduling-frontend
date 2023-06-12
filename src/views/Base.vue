<template>
  <v-container fluid class="fill-height">
    <MainNav></MainNav>
    <v-row class="fill-height">
      <v-col class="bg-lightGray">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MainNav from "../components/MainNav.vue";
import StudentHome from "../components/student/StudentHome.vue";
import StudentPerformances from "../components/student/StudentPerformances.vue";
import StudentSettings from "../components/student/StudentSettings.vue";
import FacultyHome from "../components/faculty/FacultyHome.vue";
import AdminHome from "../components/admin/AdminHome.vue";
export default {
  name: "Base",
  components: {
    MainNav,
    //Student Component
    StudentHome,
    StudentPerformances,
    StudentSettings,
    //Faculty Component
    FacultyHome,
    //Admin Component
    AdminHome,
  },
};
</script>

<style scoped>
* {
  padding: 0;
  margin: 0;
}
</style>
