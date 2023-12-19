<script setup>

const props = defineProps({
    facultyData: { type: [Object], required: true },
});

</script>

<template>
  <v-card class="bg-lightBlue pa-2 innerFlatCardBorder mb-4">
    <v-card-subtitle class="font-weight-bold text-darkBlue pa-0 ma-0">
      <v-row class="pa-0 ma-0">
        <v-col cols="auto" align-self="center">
          {{ props.facultyData.userRole.user.firstName + " " + props.facultyData.userRole.user.lastName }}
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
              props.facultyData.startTime
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
              props.facultyData.endTime
            }}
          </v-card-text>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
