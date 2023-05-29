<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";

import StudentPerformanceCard from "./StudentPerformanceCard.vue";
import EventSignupDataService from "./../../services/EventSignupDataService";

const loginStore = useLoginStore();
const performances = ref([]);
const filteredPerforamces = ref([]);
let instrumentFilter = "";
let semesterFilter = "";

async function getStudentEvents() {
  await EventSignupDataService.getByStudent(loginStore.user.userId)
    .then((response) => {
      performances.value = response.data;
      filteredPerforamces.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getStudentEvents();
});
</script>
<template>
  <v-container fluid class="ma-0 pa-4">
    <v-row>
      <h1 class="text-maroon font-weight">Performances</h1>
      <v-menu v-model="menu" :close-on-content-click="false" location="end">
        <template v-slot:activator="{ props }">
          <v-btn color="indigo" v-bind="props"> Filters </v-btn>
        </template>

        <v-card min-width="300">
          <v-list>
            <v-list-item title="Semester">
              <template v-slot:append>
                <v-select></v-select>
              </template>
            </v-list-item>
            <v-list-item title="Instrument">
              <template v-slot:append>
                <v-select></v-select>
              </template>
            </v-list-item>
            <v-list-item title="Event Type">
              <template v-slot:append>
                <v-select></v-select>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5" elevation="0">
          <v-row>
            <v-col v-for="performance in filteredPerforamces">
              <StudentPerformanceCard
                :performance="performance"
              ></StudentPerformanceCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style></style>
