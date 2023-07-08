<script setup>
import { ref, onMounted } from "vue";
import EventDataService from "../../../../services/EventDataService";
import EventTypeDataService from "../../../../services/EventTypeDataService";
import SemesterDataService from "../../../../services/SemesterDataService";
import LocationDataService from "../../../../services/LocationDataService";
import { formatDate } from "../../../../composables/dateFormatter";
import {
  get12HourTimeStringFromString,
  get24HourTimeString,
} from "../../../../composables/timeFormatter";

const emits = defineEmits([
  "addEventSuccessEvent",
  "closeAddEventDialogEvent",
  "closeEventDialogEvent",
  "updateEventSuccessEvent",
  "readyEventEvent",
  "unreadyEventEvent",
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
  await getData();
  if (props.isEdit) {
    editedEventData.value.id = props.eventData.id;
    editedEventData.value.date = formatDate(editedEventData.value.date);
    editedEventData.value.startTime = get12HourTimeStringFromString(
      editedEventData.value.startTime
    );
    editedEventData.value.endTime = get12HourTimeStringFromString(
      editedEventData.value.endTime
    );
  } else {
    editedEventData.value.status = "Active";
    editedEventData.value.isReady = false;
    editedEventData.value.semester = semesters.value[0];
    editedEventData.value.eventType = eventTypes.value[0];
    editedEventData.value.location = locations.value[0];
  }
});

async function getData() {
  await EventTypeDataService.getAll("type")
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
      editedEventData.value.semesterId = editedEventData.value.semester.id;
      editedEventData.value.eventTypeId = editedEventData.value.eventType.id;
      editedEventData.value.locationId = editedEventData.value.location.id;
      editedEventData.value.startTime = get24HourTimeString(
        editedEventData.value.startTime
      );
      editedEventData.value.endTime = get24HourTimeString(
        editedEventData.value.endTime
      );
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
      editedEventData.value.semesterId = editedEventData.value.semester.id;
      editedEventData.value.eventTypeId = editedEventData.value.eventType.id;
      editedEventData.value.locationId = editedEventData.value.location.id;
      editedEventData.value.startTime = get24HourTimeString(
        editedEventData.value.startTime
      );
      editedEventData.value.endTime = get24HourTimeString(
        editedEventData.value.endTime
      );
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

function dateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedEventData.value.date)
    ? true
    : "Date must be in the format of MM/DD/YYYY.";
}
function timeCheck(time) {
  const pattern = new RegExp("[0-5]?[0-9]:[0-5][0-9][ap]m$");
  return pattern.test(time) ? true : "Time must be in the format of 10:30am.";
}
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-form ref="form" validate-on="input">
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
            placeholder="Wednesday Recital Hearing"
            v-model="editedEventData.name"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[() => !!editedEventData.name || 'This field is required']"
          ></v-text-field>
          <v-row>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Semester
              </v-card-subtitle>
              <v-select
                placeholder="2000-FA"
                v-model="editedEventData.semester"
                :items="semesters"
                item-title="name"
                variant="plain"
                return-object
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.semester || 'This field is required',
                ]"
              ></v-select>
            </v-col>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Date
              </v-card-subtitle>
              <v-text-field
                placeholder="MM/DD/YYYY"
                v-model="editedEventData.date"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.date || 'This field is required',
                  dateCheck(editedEventData.date),
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Start Time
              </v-card-subtitle>
              <v-text-field
                placeholder="10:00am"
                v-model="editedEventData.startTime"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.startTime || 'This field is required',
                  timeCheck(editedEventData.startTime),
                ]"
              ></v-text-field>
            </v-col>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                End Time
              </v-card-subtitle>
              <v-text-field
                placeholder="2:00pm"
                v-model="editedEventData.endTime"
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.endTime || 'This field is required',
                  timeCheck(editedEventData.endTime),
                ]"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Event Type
              </v-card-subtitle>
              <v-select
                placeholder="Jury"
                v-model="editedEventData.eventType"
                :items="eventTypes"
                item-title="type"
                return-object
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.eventType || 'This field is required',
                ]"
              ></v-select>
            </v-col>
            <v-col>
              <v-card-subtitle
                class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
              >
                Location
              </v-card-subtitle>
              <v-select
                placeholder="Adams Recital Hall"
                v-model="editedEventData.location"
                :items="locations"
                item-title="roomName"
                return-object
                variant="plain"
                class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                :rules="[
                  () => !!editedEventData.location || 'This field is required',
                ]"
              ></v-select>
            </v-col>
          </v-row>
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
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="props.eventData.isReady ? 'bg-maroon' : 'bg-darkBlue'"
          @click="
            props.eventData.isReady
              ? emits('unreadyEventEvent')
              : emits('readyEventEvent')
          "
        >
          {{ props.eventData.isReady ? "Unready" : "Ready" }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
