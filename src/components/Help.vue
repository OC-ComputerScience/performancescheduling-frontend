<script setup>
import { VPdfViewer } from "@vue-pdf-viewer/viewer";
import { VuePDF, usePDF } from "@tato30/vue-pdf";
import { ref, computed } from "vue";
import { useLoginStore } from "../stores/LoginStore.js";

const loginStore = useLoginStore();

const studentTutorialPath = "/StudentTutorial.pdf";
const instructorTutorialPath = "/InstructorTutorial.pdf";
const adminTutorialPath = "/AdminTutorial.pdf";
const accompTutorialPath = "/AccompanistTutorial.pdf";

const selectedPdfPath = computed(() => {
  return loginStore.currentRole.roleId === 1
    ? studentTutorialPath
    : loginStore.currentRole.roleId === 3
    ? adminTutorialPath
    : loginStore.currentRole.roleId === 4
    ? accompTutorialPath
    : instructorTutorialPath;
});

</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">Help</h1>
    </v-row>
    <br />
    <v-card class="pa-5 mainCardBorder">
      <div class="d-flex justify-center align-center mb-3">
        <div :style="{ width: '1028px', height: '700px' }">
          <VPdfViewer
            :src="selectedPdfPath"
          />
        </div>
      </div>
    </v-card>
  </v-container>
</template>
