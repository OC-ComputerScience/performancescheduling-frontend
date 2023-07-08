<script setup>
import { ref } from "vue";
import EventTypeDataService from "../../../../services/EventTypeDataService";

const emits = defineEmits([
  "addEventTypeSuccessEvent",
  "closeAddEventTypeDialogEvent",
  "closeEventTypeDialogEvent",
  "updateEventTypeSuccessEvent",
  "disableEventTypeEvent",
  "enableEventTypeEvent",
]);

const props = defineProps({
  eventTypeData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedEventTypeData = ref(Object.assign({}, props.eventTypeData));

const slotTypeOptions = ["Flexible", "Fixed"];

const instrumentTypeOptions = ["Instrument", "Vocal", "Both"];

const form = ref(null);

async function addEventType() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await EventTypeDataService.create(editedEventTypeData.value)
        .then(() => {
          emits("addEventTypeSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the eventType data with the new data
async function updateEventType() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      delete editedEventTypeData.value["createdAt"];
      delete editedEventTypeData.value["updatedAt"];

      await EventTypeDataService.update(editedEventTypeData.value)
        .then(() => {
          emits("updateEventTypeSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
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
            {{ props.isEdit ? "Edit" : "Add" }} Event Type
          </v-col>
          <v-spacer></v-spacer>
          <v-col v-if="props.isEdit" cols="auto" class="pa-0 ma-0 mr-4">
            <v-chip
              label
              flat
              size="small"
              class="font-weight-bold text-none text-white flatChipBorder"
              :class="
                eventTypeData.status === 'Active' ? 'bg-teal' : 'bg-maroon'
              "
            >
              {{ eventTypeData.status }}
            </v-chip>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text>
        <v-row>
          <v-col>
            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Type
            </v-card-subtitle>
            <v-text-field
              placeholder="Jury"
              v-model="editedEventTypeData.type"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () => !!editedEventTypeData.type || 'This field is required',
              ]"
            ></v-text-field>

            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Description
            </v-card-subtitle>
            <v-text-field
              placeholder="A short performance"
              v-model="editedEventTypeData.description"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                () =>
                  !!editedEventTypeData.description || 'This field is required',
              ]"
            ></v-text-field>

            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Slot Type
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="editedEventTypeData.slotType"
              :items="slotTypeOptions"
              :rules="[
                () =>
                  !!editedEventTypeData.slotType || 'This field is required',
              ]"
            >
            </v-select>

            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Instrument Type
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="editedEventTypeData.instrumentType"
              :items="instrumentTypeOptions"
              :rules="[
                () =>
                  !!editedEventTypeData.instrumentType ||
                  'This field is required',
              ]"
            >
            </v-select>

            <v-row class="pa-0 ma-0">
              <v-col cols="auto">
                <v-card-subtitle
                  class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                >
                  Default Slot Duration (minutes)
                </v-card-subtitle>
                <v-text-field
                  type="number"
                  color="darkBlue"
                  variant="plain"
                  class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
                  v-model="editedEventTypeData.defaultSlotDuration"
                  :rules="[
                    () =>
                      !!editedEventTypeData.defaultSlotDuration ||
                      'This field is required',
                  ]"
                >
                </v-text-field>
              </v-col>
              <v-col cols="auto">
                <v-card-subtitle
                  class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                >
                  Event Privacy
                </v-card-subtitle>
                <v-checkbox
                  color="darkBlue"
                  label="Private Event"
                  class="font-weight-bold text-blue mt-3"
                  v-model="editedEventTypeData.isPrivate"
                >
                </v-checkbox>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateEventType() : addEventType()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeEventTypeDialogEvent')
              : emits('closeAddEventTypeDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.eventTypeData.status === 'Disabled'
              ? 'bg-darkBlue'
              : 'bg-maroon'
          "
          @click="
            props.eventTypeData.status === 'Disabled'
              ? emits('enableEventTypeEvent')
              : emits('disableEventTypeEvent')
          "
        >
          {{ props.eventTypeData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
</template>
