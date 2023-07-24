<script setup>
import { useRouter } from "vue-router";

const router = useRouter();
const props = defineProps({
  itemCount: { type: [Number], required: true },
  text: { type: [String], required: true },
  link: { type: [String], required: true },
});

function redirectPage() {
  router.push({ path: props.link });
}
</script>

<template>
  <v-card
    flat
    class="flatCardBorder bg-lightDarkBlue mt-4"
    @click="redirectPage"
  >
    <v-card-text>
      <v-row class="pa-2">
        <v-sheet class="bg-darkBlue px-2" rounded>
          <span class="text-lightDarkBlue">{{ itemCount }}</span>
        </v-sheet>
        <p class="ml-2 text-h8">{{ text }}</p>
        <v-spacer></v-spacer>
        <v-icon color="darkBlue" icon="mdi-pencil"></v-icon>
      </v-row>
    </v-card-text>
  </v-card>
</template>
