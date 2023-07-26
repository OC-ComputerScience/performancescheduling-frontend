<script setup>
const emits = defineEmits(["closePerformandceDialog"]);

const props = defineProps({
  eventName: { type: String, required: true },
  pieceData: { type: [Object], required: true },
});
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-card-title>
      <v-row class="pt-0 mt-0 text-maroon font-weight-bold text-h4">
        View Critique
      </v-row>
    </v-card-title>

    <v-row class="pt-0 mt-0">
      <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
        {{ pieceData.piece.title }}
      </v-card-title>
    </v-row>
    <v-row v-if="!pieceData.critiques" class="pt-2 pb-4 mt-0">
      <v-card-title class="text-darkBlue py-0 my-0">
        No critiques have been submitted for this piece.
      </v-card-title>
    </v-row>

    <v-expansion-panels class="pt-6">
      <v-expansion-panel
        v-for="critique in pieceData.critiques"
        :key="critique.id"
      >
        <v-expansion-panel-title class="text-darkBlue font-weight-bold">
          >{{ critique.userRole.user.firstName }}
          {{ critique.userRole.user.lastName }}</v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >Overall
            </v-card-subtitle>
          </v-row>
          <v-row class="pt-0 pb-2 pl-6 mt-0">
            <v-card-text>
              {{ critique.overallComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Accuracy
            </v-card-subtitle>
          </v-row>
          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.accuracyGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.accuracyComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Balance</v-card-subtitle
            >
          </v-row>
          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.balanceGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.balanceComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Deportment</v-card-subtitle
            >
          </v-row>
          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.deportmentGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.deportmentComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Diction
            </v-card-subtitle>
          </v-row>
          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.dictionGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.dictionComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Interpretation</v-card-subtitle
            >
          </v-row>
          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.interpretationGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.interpretationComment }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pl-6 mt-0">
            <v-card-subtitle
              class="pl-0 pb-0 font-weight-semi-bold text-darkBlue"
              >Tone</v-card-subtitle
            >
          </v-row>

          <v-row class="pt-0 pb-0 pl-6 mt-0">
            <v-card-text class="pb-0">
              {{ critique.toneGrade }}
            </v-card-text>
          </v-row>
          <v-row class="pt-0 pb-3 pl-6 mt-0">
            <v-card-text>
              {{ critique.toneComment }}
            </v-card-text>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        @click="emits('closePerformanceDialog')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
