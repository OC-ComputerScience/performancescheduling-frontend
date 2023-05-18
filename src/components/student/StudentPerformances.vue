<script setup>
import { useLoginStore } from "../../stores/LoginStore.js";
import { ref, onMounted } from "vue";

import StudentPerformanceCard from "./StudentPerformanceCard.vue";
import EventDataService from "../../services/EventDataService";

const loginStore = useLoginStore();
const events = ref([]);

async function getStudentEvents() {
  await EventDataService.getByStudent(loginStore.user.userId)
    .then((response) => {
      events.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getStudentEvents();
  console.log("events", events.value);
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
            <v-col cols="6">
              <StudentPerformanceCard></StudentPerformanceCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<style></style>
