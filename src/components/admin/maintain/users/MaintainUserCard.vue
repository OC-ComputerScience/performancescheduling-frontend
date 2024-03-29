<script setup>
import { ref, onMounted, watch } from "vue";
import UserDialogBody from "./UserDialogBody.vue";
import UserDataService from "../../../../services/UserDataService.js";
import StudentRepertoire from "../../../student/repertoire/StudentRepertoire.vue";

const emits = defineEmits(["closeUserDialog", "refreshUsersEvent"]);

const props = defineProps({
  userData: { type: [Object], required: true },
  userRoles: { type: [Array], required: true },
});

var studentRoleId = 0;
watch(
  () => props.userRoles,
  async () => {
    await fillRoleData();
  }
);

const createOrEditDialog = ref(false);
const repertoireDialog = ref(false);

function closeUserDialog() {
  createOrEditDialog.value = false;
}
function closeRepetoireDialog() {
  repertoireDialog.value = false;
}

const userRoleLabels = ref([]);
const isStudent = ref(false);
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
      isStudent.value = true;
      studentRoleId = role.id;
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
    (i) => i.instrument.type === "Instrument" && i.status === "Active"
  );
  let isVocal = instruments.some(
    (i) => i.instrument.type === "Vocal" && i.status === "Active"
  );

  if (isInstrumental) instrumentRoleLabels.value.push("Instrumental");
  if (isVocal) instrumentRoleLabels.value.push("Vocal");
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
    <v-row class="pb-5 pl-2 pt-2">
      <v-col
        cols="auto"
        v-for="roleLabel in userRoleLabels"
        :key="roleLabel"
        class="pb-0 pr-1"
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
    </v-row>
    <v-card-actions>
      <v-row>
        <v-spacer></v-spacer>
        <v-btn
          v-if="isStudent"
          flat
          size="small"
          class="font-weight-bold mt-0 mr-0 text-none text-white bg-blue flatChipBorder"
          @click="repertoireDialog = true"
        >
          Repertoire
        </v-btn>
        <v-btn
          flat
          size="small"
          class="font-weight-bold mt-0 mr-4 text-none text-white bg-blue flatChipBorder"
          @click="createOrEditDialog = true"
        >
          Edit
        </v-btn>
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
      @closeUserDialogEvent="closeUserDialog(), emits('refreshUsersEvent')"
      @updateUserSuccessEvent="closeUserDialog(), emits('refreshUsersEvent')"
      @disableUserEvent="closeUserDialog(), disableUser(userData)"
      @enableUserEvent="closeUserDialog(), enableUser(userData)"
    ></UserDialogBody>
  </v-dialog>
  <v-dialog v-model="repertoireDialog" persistent max-width="1200px" scrollable>
    <StudentRepertoire
      :user-data="props.userData"
      :is-dialog="true"
      :selected-student-role-id="studentRoleId"
      @closeRepertoireDialogEvent="closeRepetoireDialog()"
    >
    </StudentRepertoire>
  </v-dialog>
</template>
