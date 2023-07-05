<script setup>
import { ref, onMounted } from "vue";
import EventDataService from "../../../../services/EventDataService";
import EventTypeDataService from "../../../../services/EventTypeDataService";
import SemesterDataService from "../../../../services/SemesterDataService";
import LocationDataService from "../../../../services/LocationDataService";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits([
  "addEventSuccessEvent",
  "closeAddEventDialogEvent",
  "closeEventDialogEvent",
  "updateEventSuccessEvent",
  "disableEventEvent",
  "enableEventEvent",
]);

const props = defineProps({
  eventData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});
const form = ref(null);
const editedEventData = ref(Object.assign({}, props.eventData));
const semesters = ref([]);
const eventTypes = ref([]);
const locations = ref([]);

onMounted(async () => {
  if (props.isEdit) {
    editedEventData.value.id = props.eventData.id;
    editedEventData.value.date = formatDate(editedEventData.value.date);
  } else {
    editedEventData.value.status = "Active";
    editedEventData.value.isReady = false;
  }
  await getData();
});

async function getData() {
  await EventTypeDataService.getAll("name")
    .then((response) => {
      eventTypes.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  await SemesterDataService.getAll("name", false)
    .then((response) => {
      semesters.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });

  await LocationDataService.getAll("roomName")
    .then((response) => {
      locations.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function addEvent() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await EventDataService.create(editedEventData.value)
        .then(async () => {
          emits("addEventSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

async function updateEvent() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedEventData.value["updatedAt"];

      await EventDataService.update(editedEventData.value)
        .then(() => {
          emits("updateEventSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

function semesterNameCheck() {
  const pattern = /[0-9]{4}-[A-Z]{2}/;
  return pattern.test(editedEventData.value.name)
    ? true
    : "Semester name must be in the format of YYYY-SS.";
}
function dateCheck(date) {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(date)
    ? true
    : "Date  must be in the format of MM/DD/YYYY.";
}
function endDateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedEventData.value.endDate)
    ? true
    : "Date must be in the format of MM/DD/YYYY.";
}
</script>

<template>
  <v-form ref="form" validate-on="input">
    <v-card class="pa-2 flatCardBorder">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Event
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ eventData.name }}
            </v-card-title>
          </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold mt-0 text-none text-white flatChipBorder"
              :class="eventData.isReady ? 'bg-teal' : 'bg-maroon'"
            >
              {{ eventData.isReady ? "Ready" : "Not Ready" }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions :class="props.isEdit ? '' : 'mt-2'">
        <v-card-text>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Event Name
          </v-card-subtitle>

          <v-text-field
            placeholder="2000-FA"
            v-model="editedEventData.name"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedEventData.name || 'This field is required',
              semesterNameCheck,
            ]"
          ></v-text-field>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Start Date
          </v-card-subtitle>
          <v-text-field
            placeholder="MM/DD/YYYY"
            v-model="editedEventData.startDate"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedEventData.startDate || 'This field is required',
              startDateCheck,
            ]"
          ></v-text-field>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            End Date
          </v-card-subtitle>
          <v-text-field
            placeholder="MM/DD/YYYY"
            v-model="editedEventData.endDate"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedEventData.endDate || 'This field is required',
              endDateCheck,
            ]"
          ></v-text-field>
        </v-card-text>
      </v-card-actions>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateEvent() : addEvent()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeEventDialogEvent')
              : emits('closeAddEventDialogEvent')
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>
