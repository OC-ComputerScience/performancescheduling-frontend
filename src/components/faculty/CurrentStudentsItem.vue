  <script setup>
  const props = defineProps({
    studentsData: { type: [Object], required: true },
  });
  console.log("students current", props)
  </script>

  <template>
    <v-card flat class="flatCardBorder bg-lightDarkBlue mt-4">
      <v-card-title class="font-weight-semi-bold text-darkBlue">
        {{ props.studentsData.firstName }}
      </v-card-title>
    </v-card>
  </template>
