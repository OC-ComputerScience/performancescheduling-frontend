<script setup>
import { VuePDF, usePDF } from '@tato30/vue-pdf'
import { ref, computed } from "vue";
import { useLoginStore } from "../stores/LoginStore.js";

const loginStore = useLoginStore();

const page = ref(0);
const studentTutorialPath = '../../public/StudentTutorial.pdf';
const instructorTutorialPath = '../../public/InstructorTutorial.pdf';

const selectedPdfPath = computed(() => {
  return loginStore.currentRole.roleId === 1 ? studentTutorialPath : instructorTutorialPath;
});

const { pdf, pages } = usePDF(selectedPdfPath.value);

function goToEnteredPage() {
  if (page.value >= 0 && page.value <= pages.value) {
  } else {
    page.value = Math.min(Math.max(page.value, 1), pages.value);
    alert('Invalid page number. Resetting to the nearest valid page.');
  }
}
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Help</h1>
    </v-row>
    <br />
    <div class="d-flex justify-center align-center mb-3">
      <v-btn flat size="small" class="font-weight-bold ml-4 mr-2 text-none text-white bg-blue flatChipBorder"
        @click="page = page > 0 ? page - 1 : page">
        Prev
      </v-btn>
      <input class="pl-1" type="number" min="1" :max="pages" v-model="page" @keydown.enter="goToEnteredPage" />
      <!-- <v-text-field
        class="mx-2 font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4 width-50"
        type="number" 
        min="0" 
        :max="pages" 
        v-model="page" 
        @keydown.enter="goToEnteredPage" 
        color="darkBlue"
        variant="plain" 
        single-line 
        hide-details>
      </v-text-field> -->
      <v-btn flat size="small" class="font-weight-bold ml-2 text-none text-white bg-blue flatChipBorder"
        @click="page = page < pages ? page + 1 : page">
        Next
      </v-btn>
    </div>
    <v-card>
      <VuePDF :pdf="pdf" :page="page + 1" fit-parent/>
    </v-card>

    <div class="navigation-controls d-flex justify-center align-center mt-3">
      <v-btn flat size="small" class="font-weight-bold ml-4 mr-2 text-none text-white bg-blue flatChipBorder"
        @click="page = page > 1 ? page - 1 : page">
        Prev
      </v-btn>
      <input class="pl-1" type="number" min="1" :max="pages" v-model="page" @keydown.enter="goToEnteredPage" />
      <v-btn flat size="small" class="font-weight-bold ml-2 text-none text-white bg-blue flatChipBorder"
        @click="page = page < pages ? page + 1 : page">
        Next
      </v-btn>
    </div>
  </v-container>
</template>
 
