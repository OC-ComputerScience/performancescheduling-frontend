<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";

import StudentPerformanceCard from "./StudentPerformanceCard.vue";
import EventSignupDataService from "./../../services/EventSignupDataService";

const loginStore = useLoginStore();
const performances = ref([]);

async function getStudentEvents() {
  await EventSignupDataService.getByStudent(loginStore.user.userId)
    .then((response) => {
      performances.value = response.data;
      console.log(response.data);
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
      <v-col>
        <h1 class="text-maroon font-weight">Performances</h1>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5">
          <v-row>
            <v-col cols="6" v-for="performance in performances">
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
