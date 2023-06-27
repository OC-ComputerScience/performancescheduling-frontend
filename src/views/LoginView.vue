<script setup>
import OClogo from "../assets/oc_logo.svg";
import SocialLogin from "../components/SocialLogin.vue";
import { ref } from "vue";

const logoURL = ref(OClogo);
</script>

<template>
  <v-container fluid class="loginGrid fill-height">
    <v-row align="center" justify="center">
      <v-col>
        <v-card class="mainCardBorder pa-8 mx-auto" max-width="400px">
          <v-row align="center">
            <v-col>
              <v-img height="50" width="50" :src="logoURL"></v-img>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-title class="font-weight-bold text-maroon text-h5"
                >Performance Management</v-card-title
              >
            </v-col>
          </v-row>
          <v-card-actions class="mt-2 mb-0 pb-0">
            <SocialLogin class="mx-auto mb-0 pb-0" />
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
* {
  padding: 0;
  margin: 0;
}

.loginGrid {
  background: url(../../public/music_dept.jpg) no-repeat center center fixed;
  background-size: cover;
}
</style>
