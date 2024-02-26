<script setup>
const emits = defineEmits(["closePerformanceDialog"]);

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

    <v-row class="pt-0 mt-2">
      <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
        {{ pieceData.piece.title }}
      </v-card-title>
    </v-row>
    <v-row v-if="!pieceData.critiques" class="pt-2 pb-4 mt-0">
      <v-card-title class="text-darkBlue py-0 my-0">
        No critiques have been submitted for this piece.
      </v-card-title>
    </v-row>

    <v-expansion-panels v-if="pieceData.critiques" class="pt-6">
      <v-expansion-panel
        v-for="critique in pieceData.critiques"
        :key="critique.id"
      >
        <v-expansion-panel-title class="text-darkBlue font-weight-bold">
          {{ critique.userRole.user.firstName }}
          {{ critique.userRole.user.lastName }}</v-expansion-panel-title
        >
        <v-expansion-panel-text>
          <v-row class="pt-0 pl-3 mt-0">
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >Overall Performance and Suggestion
            </v-card-subtitle>
          </v-row>
          <v-row class="pt-0 pb-1 pl-3 mt-0">
            <v-card-text>
              {{ critique.overallComment }}
            </v-card-text>
          </v-row>

          

          <v-row>
            <v-col cols="6">
              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle class="pl-0 pb-0 font-weight-semi-bold">
                  <v-text class="text-darkBlue">
                  Tone - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.toneGrade === 'Excellent',
                    'text-blue': critique.toneGrade === 'Good',
                    'text-yellow': critique.toneGrade === 'Fair',
                    'text-red': critique.toneGrade === 'Poor'
                  }">
                  {{ critique.toneGrade }}
                  </v-text>
                  </v-card-subtitle
                >
              </v-row>
              <v-row class="pt-0 pb-0 pl-3 mt-0">
                <v-card-text>
                  {{ critique.toneComment }}
                </v-card-text>
              </v-row>

              <v-divider class="mb-2"></v-divider>

              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle class="pl-0 pb-0 font-weight-semi-bold">
                  <v-text class="text-darkBlue">
                    Accuracy/Intonation - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.accuracyGrade === 'Excellent',
                    'text-blue': critique.accuracyGrade === 'Good',
                    'text-yellow': critique.accuracyGrade === 'Fair',
                    'text-red': critique.accuracyGrade === 'Poor'
                  }">
                  {{ critique.accuracyGrade }}
                  </v-text>
                </v-card-subtitle>
              </v-row>
              <v-row class="pt-0 pb-1 pl-3 mt-0">
                <v-card-text>
                  {{ critique.accuracyComment }}
                </v-card-text>
              </v-row>

              <v-divider class="mb-2"></v-divider>

              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle
                  class="pl-0 pb-0 font-weight-semi-bold"
                  ><v-text class="text-darkBlue">
                    Balance Blend - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.balanceGrade === 'Excellent',
                    'text-blue': critique.balanceGrade === 'Good',
                    'text-yellow': critique.balanceGrade === 'Fair',
                    'text-red': critique.balanceGrade === 'Poor'
                  }">
                  {{ critique.balanceGrade }}
                  </v-text>
                </v-card-subtitle>
              </v-row>
              <v-row class="pt-0 pb-1 pl-3 mt-0">
                <v-card-text>
                  {{ critique.balanceComment }}
                </v-card-text>
              </v-row>

              <v-divider class="mb-2"></v-divider>

              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle class="pl-0 pb-0 font-weight-semi-bold">
                  <v-text class="text-darkBlue">
                    Deportment - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.deportmentGrade === 'Excellent',
                    'text-blue': critique.deportmentGrade === 'Good',
                    'text-yellow': critique.deportmentGrade === 'Fair',
                    'text-red': critique.deportmentGrade === 'Poor'
                  }">
                  {{ critique.deportmentGrade }}
                  </v-text>
                </v-card-subtitle>
              </v-row>
              <v-row class="pt-0 pb-1 pl-3 mt-0">
                <v-card-text> 
                  {{ critique.deportmentComment }}
                </v-card-text>
              </v-row>
              
              <v-divider class="mb-2"></v-divider>

              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle class="pl-0 pb-0 font-weight-semi-bold">
                  <v-text class=" text-darkBlue">
                    Diction/Articulation - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.dictionGrade === 'Excellent',
                    'text-blue': critique.dictionGrade === 'Good',
                    'text-yellow': critique.dictionGrade === 'Fair',
                    'text-red': critique.dictionGrade === 'Poor'
                  }">
                  {{ critique.dictionGrade }}
                  </v-text>
                </v-card-subtitle>
              </v-row>
              <v-row class="pt-0 pb-1 pl-3 mt-0">
                <v-card-text>
                  {{ critique.dictionComment }}
                </v-card-text>
              </v-row>

              <v-divider class="mb-2"></v-divider>

              <v-row class="pt-0 pl-3 mt-0">
                <v-card-subtitle class="pl-0 pb-0 font-weight-semi-bold">
                  <v-text class="text-darkBlue">
                    Interpretation, Musicianship - Grade: 
                  </v-text>
                  <v-text :class="{
                    'text-green': critique.interpretationGrade === 'Excellent',
                    'text-blue': critique.interpretationGrade === 'Good',
                    'text-yellow': critique.interpretationGrade === 'Fair',
                    'text-red': critique.interpretationGrade === 'Poor'
                  }">
                  {{ critique.interpretationGrade }}
                  </v-text>
                </v-card-subtitle>
              </v-row>
              <v-row class="pt-0 pb-1 pl-3 mt-0">
                <v-card-text>
                  {{ critique.interpretationComment }}
                </v-card-text>
              </v-row>
            </v-col>
          </v-row>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-2 ml-auto text-none text-white bg-blue flatChipBorder"
        @click="emits('closePerformanceDialog')"
      >
        Close
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
