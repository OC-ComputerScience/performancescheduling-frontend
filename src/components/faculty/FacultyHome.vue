<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

function goToEvent() {
  router.push({ path: "facultyCreateCritique", query: { eventId: 377 } });
}
</script>
<template>
  <v-btn @click="goToEvent"> Button </v-btn>
</template>
