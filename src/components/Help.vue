<script setup>
// import { ref, onMounted } from "vue";
// import { useLoginStore } from "../stores/LoginStore.js";
// import { storeToRefs } from "pinia";
import VuePdfEmbed from 'vue-pdf-embed';
import 'vue-pdf-embed/dist/style/index.css'


const pdfSource = 'https://drive.google.com/file/d/1FrcHfkSbgyX60g5FlLGL8cZyEHiXZwl1/preview'

</script>

<template>

<VuePdfEmbed :source="pdfSource" />

</template>