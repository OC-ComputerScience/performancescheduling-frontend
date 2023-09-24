<script setup>
import { ref, onMounted, watch } from "vue";
import UserDialogBody from "./UserDialogBody.vue";
import UserDataService from "../../../../services/UserDataService.js";

const emits = defineEmits(["closeUserDialog", "refreshUsersEvent"]);

const props = defineProps({
  userData: { type: [Object], required: true },
  userRoles: { type: [Array], required: true },
  isAdmin: { type: [Boolean], required: true }
});

watch(
  () => props.userRoles,
  async () => {
    await fillRoleData();
  }
);

const createOrEditDialog = ref(false);

function closeUserDialog() {
  createOrEditDialog.value = false;
}

const userRoleLabels = ref([]);

const studentInstrumentData = ref({});
const instrumentRoleLabels = ref({});

// Creates role labels for each role, and if Student, gets StudentInstrument data.
async function fillRoleData() {
  userRoleLabels.value = [];
  instrumentRoleLabels.value = [];
  for (let role of props.userRoles) {
    if (role.status === "Disabled") continue;
    const roleId = role.roleId;
    if (roleId === 1) {
      studentInstrumentData.value = role.studentRole;
      fillInstrumentRoleLabels(studentInstrumentData.value);
      userRoleLabels.value.push("Student");
    } else {
      roleId === 2
        ? userRoleLabels.value.push("Faculty")
        : roleId === 3
        ? userRoleLabels.value.push("Admin")
        : userRoleLabels.value.push("Accompanist");
    }
  }
}

// Fills instrument role labels, only is Student
function fillInstrumentRoleLabels(instruments) {
  let isInstrumental = instruments.some(
    (i) => i.instrument.type === "Instrument"
  );
  let isVocal = instruments.some((i) => i.instrument.type === "Vocal");

  instrumentRoleLabels.value =
    isInstrumental && isVocal
      ? ["Instrumental", "Vocal"]
      : isInstrumental && !isVocal
      ? ["Instrumental"]
      : ["Vocal"];
}

async function disableUser(user) {
  user.status = "Disabled";
  await UserDataService.update(user)
    .then(() => {
      emits("refreshUsersEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

async function enableUser(user) {
  user.status = "Active";
  await UserDataService.update(user)
    .then(() => {
      emits("refreshUsersEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await fillRoleData();
});
</script>

<template>
  <v-card color="lightMaroon" class="flatCardBorder" elevation="0">
    <v-card-title>
      <v-row class="pt-0 mt-0 pl-2">
        <v-col cols="1" align-self="center">
          <v-avatar size="35" color="darkBlue">
            <v-img referrerpolicy="no-referrer" :src="userData.picture" />
          </v-avatar>
        </v-col>
        <v-col cols="6" class="pl-1">
          <v-card-subtitle class="font-weight-bold text-h7 text-darkBlue">
            {{ userData.firstName }}
            {{ userData.lastName }}
          </v-card-subtitle>
          <v-card-text class="text-weight-semi-bold pt-1 pb-0">
            <a v-bind:href="'mailto:' + userData.email" class="text-blue">
              {{ userData.email }}
            </a>
          </v-card-text>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-1">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="userData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ userData.status }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-actions>
      <v-row class="pb-5 pl-2 pt-2">
        <v-col
          cols="auto"
          v-for="roleLabel in userRoleLabels"
          :key="roleLabel"
          class="pb-0 pr-0"
        >
          <v-chip
            label
            flat
            size="small"
            class="font-weight-semi-bold bg-darkBlue text-none flatChipBorder"
          >
            {{ roleLabel }}
          </v-chip>
        </v-col>
        <v-col
          cols="auto"
          v-for="instrumentLabel in instrumentRoleLabels"
          :key="instrumentLabel"
          class="pb-0 pr-0"
        >
          <v-chip
            flat
            label
            size="small"
            class="font-weight-semi-bold bg-blue text-none flatChipBorder"
          >
            {{ instrumentLabel }}
          </v-chip>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pb-0 pr-5">
          <v-btn
            flat
            size="small"
            class="font-weight-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
            @click="createOrEditDialog = true"
          >
            Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-card-actions>
  </v-card>
  <v-dialog
    v-model="createOrEditDialog"
    persistent
    max-width="1200px"
    scrollable
  >
    <UserDialogBody
      :is-edit="true"
      :user-data="userData"
      :user-roles="props.userRoles"
      :is-admin="props.isAdmin"
      @closeUserDialogEvent="closeUserDialog"
      @updateUserSuccessEvent="closeUserDialog(), emits('refreshUsersEvent')"
      @disableUserEvent="closeUserDialog(), disableUser(userData)"
      @enableUserEvent="closeUserDialog(), enableUser(userData)"
    ></UserDialogBody>
  </v-dialog>
</template>
