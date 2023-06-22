<script setup>
import { ref, onMounted } from "vue";
import UserRoleDataService from "../../services/UserRoleDataService";

const emits = defineEmits(["closeUserInstrumentDialog"]);

const props = defineProps({
  studentInstrumentData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});

const selected = ref();

const instructors = ref([]);
const accompanists = ref([]);

async function getAllInstructors() {
  await UserRoleDataService.getRolesFoRoleId(2)
    .then((response) => {
      instructors.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAllAccompanists() {
  await UserRoleDataService.getRolesFoRoleId(4)
    .then((response) => {
      accompanists.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getAllInstructors();
  await getAllAccompanists();
});
</script>

<template>
  <v-card class="pa-2 bg-lightBlue flatCardBorder">
    <v-card-title>
      <v-row class="pt-0 mt-0">
        <v-col cols="auto" class="pt-0 mt-0 text-blue font-weight-bold text-h4">
          {{ props.isEdit ? "Edit" : "Add" }} Instrument
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-0 mt-0 pr-2">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-teal bg-white flatChipBorder"
            :class="
              studentInstrumentData.status === 'Active'
                ? 'bg-teal'
                : 'bg-maroon'
            "
          >
            {{
              studentInstrumentData.status === "Active" ? "Active" : "Disabled"
            }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-select
        color="darkBlue"
        variant="plain"
        class="font-weight-bold text-blue pt-0 mt-0"
        :v-model="studentInstrumentData.instructorRole"
        :items="instructors"
        :item-title="(item) => item.user.firstName + ' ' + item.user.lastName"
        return-object
      >
      </v-select>
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
      >
        Save
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        @click="emits('closeUserInstrumentDialogEvent')"
      >
        Cancel
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white bg-maroon flatChipBorder"
      >
        Disable
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
