<script setup>
// import { ref, onMounted } from "vue";
// import { useLoginStore } from "../stores/LoginStore.js";
// import { storeToRefs } from "pinia";
import VuePdfEmbed from 'vue-pdf-embed';
import 'vue-pdf-embed/dist/style/index.css'


const pdfSource = '../../public/StudentTutorial.pdf'

</script>

<template>

<VuePdfEmbed :width="1000" :source="pdfSource" />

</template>