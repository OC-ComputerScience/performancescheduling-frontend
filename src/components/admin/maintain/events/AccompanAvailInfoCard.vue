<script setup>

const props = defineProps({
    accompData: { type: [Object], required: true },
});

</script>

<template>
  <v-card class="bg-lightBlue pa-2 innerFlatCardBorder mb-4">
    <v-card-subtitle class="font-weight-bold text-darkBlue pa-0 ma-0">
      <v-row class="pa-0 ma-0">
        <v-col cols="auto" align-self="center">
          {{ props.accompData.userRole.user.firstName + " " + props.accompData.userRole.user.lastName }}
        </v-col>
      </v-row>
    </v-card-subtitle>
    <v-card-text class="pl-3">
      <v-row class="pa-0 ma-0">
        <v-col cols="6" class="pa-0 ma-0">
          <v-card-subtitle
            class="pa-0 ma-0 font-weight-semi-bold text-darkBlue"
          >
            Start Time
          </v-card-subtitle>
          <v-card-text class="pa-0 ma-0 font-weight-medium text-blue">
            {{
              props.accompData.startTime
            }}
          </v-card-text>
        </v-col>

        <v-col
          cols="6"
          class="pa-0 ma-0"
        >
          <v-card-subtitle
            class="pa-0 ma-0 font-weight-semi-bold text-darkBlue"
          >
            End Time
          </v-card-subtitle>
          <v-card-text class="pa-0 ma-0 font-weight-medium text-blue">
            {{
              props.accompData.endTime
            }}
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
