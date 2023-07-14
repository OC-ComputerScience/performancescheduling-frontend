  <script setup>
  const props = defineProps({
    studentsData: { type: [Object], required: true },
  });
  console.log("students current", props.studentsData)
  </script>

  <template>
    <v-card flat class="flatCardBorder bg-lightDarkBlue mt-4">
      <v-row>
        <v-col cols="auto">
          <v-card-title class="font-weight-semi-bold text-darkBlue">
            {{ props.studentsData.firstName }} {{ props.studentsData.lastName }}
          </v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">

            <v-icon class="ma-3" icon="mdi-information">
            </v-icon>

        </v-col>
      </v-row>
    </v-card>
  </template>
