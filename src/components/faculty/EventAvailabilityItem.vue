<script setup>
import { ref, onMounted } from "vue";
import { formatDate } from "../../composables/dateFormatter";
import { get12HourTimeStringFromString } from "../../composables/timeFormatter";
import AvailabilityDialogBody from "./AvailabilityDialogBody.vue";

const props = defineProps({
  eventData: { type: [Object], required: true },
  availabilityData: { type: [Object], required: true },
});

const emits = defineEmits(["refreshAvailabilitiesEvent"]);

const addOrEditAvailabilityDialog = ref(false);

function closeAvailabilityDialog() {
  addOrEditAvailabilityDialog.value = false;
}

// async function refreshAvailabilities() {
//   await AvailabilityDataService.getByUserRole(currentRole.value.id)
//     .then((response) => {
//       const groupedAvailabilities = {};
    
//     //Iterate through list of availabilities to group them by eventId
//     for (let i = 0; i < response.data.length; i++) {
//       const availability = response.data[i];
//       const eventId = availability.eventId;
      
//       //Index will be the eventId value
//       if (!groupedAvailabilities[eventId]) {
//         groupedAvailabilities[eventId] = [availability];
//       } else {
//         groupedAvailabilities[eventId].push(availability);
//       }
//     }

//     //Put the values of the loop list into an availabilities list with "normal" indexes
//     props.availabilityData = Object.values(groupedAvailabilities);
//   })
//     .catch((err) => {
//       console.log(err);
//     });
// }

onMounted(async () => {});
</script>

<template>
  <v-card flat class="flatCardBorder bg-lightBlue mt-4">
    <v-card-title>
      <!-- Event Name -->
      <v-card-title class="font-weight-bold text-maroon text-h5">
        {{ eventData.name }}
      </v-card-title>
      <v-row>
        <!-- Event Date -->
        <v-col cols="auto pt-4 mr-11">
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ formatDate(eventData.date) }}
          </v-card-subtitle>
          <!-- Event Time -->
          <v-card-subtitle class="font-weight-semi-bold text-maroon">
            {{ get12HourTimeStringFromString(eventData.startTime) }} -
            {{ get12HourTimeStringFromString(eventData.endTime) }}
          </v-card-subtitle>
        </v-col>

        <!-- Event Time and Availability Time -->
        <v-col cols="auto pt-4">
          <v-card-subtitle class="font-weight-bold text-maroon">
            Availability
          </v-card-subtitle>
          <!-- If there is more than one availability for the same event -->
          <div v-if="availabilityData.length > 1">
            <v-card-subtitle
              v-for="availability in availabilityData"
              :key="availability.id"
              class="font-weight-semi-bold text-darkBlue"
            >
              {{ get12HourTimeStringFromString(availability.startTime) }} -
              {{ get12HourTimeStringFromString(availability.endTime) }}
            </v-card-subtitle>
          </div>
          <div v-else>
            <v-card-subtitle class="font-weight-semi-bold text-darkBlue">
              {{ get12HourTimeStringFromString(availabilityData.startTime) }} -
              {{ get12HourTimeStringFromString(availabilityData.endTime) }}
            </v-card-subtitle>
          </div>

        </v-col>
      </v-row>
    </v-card-title>
   
    <v-card-actions class="pt-0 mt-2">
      <!-- Edit Availability Button -->
      <v-btn
        flat
        size="small"
        class="font-weight-semi-bold ml-auto mr-2 bg-orange text-none"
        @click="addOrEditAvailabilityDialog = true"
      >
        Edit availability
      </v-btn>
    </v-card-actions>
  </v-card>

  <v-dialog v-model="addOrEditAvailabilityDialog" persistent max-width="600px">
    <AvailabilityDialogBody
      :is-edit="true"
      :availability-data="availabilityData"
      @updateAvailabilityEvent="
        closeAvailabilityDialog(), emits('refreshAvailabilitiesEvent')
      "
      @closeAvailabilityDialogEvent="closeAvailabilityDialog()"
    ></AvailabilityDialogBody>
  </v-dialog>
</template>

