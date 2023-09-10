<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../../../../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import RoleDataService from "../../../../services/RoleDataService";
import MajorDataService from "../../../../services/MajorDataService";
import UserInstrumentCard from "./UserInstrumentCard.vue";
import UserInstrumentDialogBody from "./UserInstrumentDialogBody.vue";
import UserDataService from "../../../../services/UserDataService";
import UserRoleDataService from "../../../../services/UserRoleDataService";
import StudentInstrumentDataService from "../../../../services/StudentInstrumentDataService";

const emits = defineEmits([
  "addUserSuccessEvent",
  "closeAddUserDialogEvent",
  "closeUserDialogEvent",
  "updateUserSuccessEvent",
  "disableUserEvent",
  "enableUserEvent",
]);

const props = defineProps({
  userData: { type: [Object], required: true },
  userRoles: { type: [Array], required: true },
  isEdit: { type: [Boolean], required: true },
});

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const form = ref(null);

const addInstrumentDialog = ref(false);

function addInstrument() {
  addInstrumentDialog.value = true;
}

function closeAddInstrumentDialog() {
  addInstrumentDialog.value = false;
}

const isStudent = ref(
  props.isEdit
    ? props.userRoles.some((ur) => ur.roleId === 1 && ur.status === "Active")
    : false
);

const studentRole = isStudent.value
  ? props.userRoles.find((ur) => ur.roleId === 1)
  : null;

const isFaculty = ref(
  props.isEdit
    ? props.userRoles.some((ur) => ur.roleId === 2 && ur.status === "Active")
    : false
);

const facultyRole = isFaculty.value
  ? props.userRoles.find((ur) => ur.roleId === 2)
  : null;

const editedUserData = ref(Object.assign({}, props.userData));

const editedUserRoles = ref(
  props.isEdit
    ? props.userRoles
        .filter((ur) => ur.status === "Active")
        .map((ur) => {
          ur = ur.role;
          return ur;
        })
    : []
);

const roleOptions = ref([]);

async function getAllRoles() {
  await RoleDataService.getAll()
    .then((response) => {
      roleOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const editedStudentMajor = ref(isStudent.value ? studentRole.major : null);

const majorOptions = ref([]);

async function getAllMajors() {
  await MajorDataService.getAll()
    .then((response) => {
      majorOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const editedStudentClassification = ref(
  isStudent.value ? studentRole.studentClassification : null
);

const classificationOptions = ref([
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
]);

const editedStudentSemesters = ref(
  isStudent.value ? studentRole.studentSemesters : null
);
const editedStudentHours = ref(
  isStudent.value
    ? studentRole.studentRole.reduce((sum, obj) => {
        if (obj.status === "Active") {
          return sum + obj.privateHours;
        } else {
          return sum;
        }
      }, 0)
    : null
);

const editedFacultyTitle = ref(isFaculty.value ? facultyRole.title : null);

async function addUser() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await UserDataService.create(editedUserData.value)
        .then(async (response) => {
          for (let editedUserRole of editedUserRoles.value) {
            await UserRoleDataService.create({
              userId: response.data.id,
              roleId: editedUserRole.id,
              status: "Active",
            }).catch((err) => {
              console.log(err);
            });
          }

          emits("addUserSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// Update the user's roles, then
// if isStudent, update the student's major, classification, semesters, and hours, then
// if isFaculty, update the faculty's title, then
// update the user's data
async function updateUser() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      await updateUserRoles();

      if (isStudent.value) {
        await updateStudentMajor();
        await updateStudentClassification();
        await updateStudentSemesters();
      }

      if (isFaculty.value) {
        await updateFacultyTitle();
      }

      await UserDataService.update(editedUserData.value)
        .then(() => {
          emits("updateUserSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

// For each role in userRoles, check if it exists in editedUserRoles
// If it does and is Disabled, enable it and splice it from editedUserRoles.
// If it does and is Active, do nothing and splice it from editedUserRoles.
// If it does not, disable it.
// After all roles have been checked, whatever is left in editedUserRoles is a new role,
// so create it.
async function updateUserRoles() {
  const updateRoles = [...editedUserRoles.value] // copy of editUserRoles to use with splice, a destructive process

  for (let userRole of props.userRoles) {
    // If role exists in editedUserRoles, and is active, we don't need to do anything,
    // and it gets spliced out of editedUserRoles at the end of the if statement.

    // If role exists in editedUserRoles, and is disabled, enable it
    if (updateRoles.some((eur) => eur.id === userRole.roleId)) {
      if (userRole.status === "Disabled") {
        userRole.status = "Active";
        await UserRoleDataService.update(userRole).catch((err) => {
          console.log(err);
        });
      }
    } else {
      // Role does not exist in editedUserRoles, so delete from database
      userRole.status = "Disabled";
      await UserRoleDataService.update(userRole).catch((err) => {
        console.log(err);
      });
    }

    
    // Find index of role to splice in editedUserRoles
    let index = updateRoles.findIndex(
      (eur) => eur.id === userRole.roleId
    );
    // Splice role from editedUserRoles
    index != -1 ? updateRoles.splice(index, 1) : null;
  }

  // Whatever is left in editedUserRoles is a new role, so create it
  for (let editedUserRole of updateRoles) {
    await UserRoleDataService.create({
      userId: props.userData.id,
      roleId: editedUserRole.id,
      status: "Active",
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's major has changed, update it
async function updateStudentMajor() {
  // Find the student role

  // If the editedStudentMajor is different from the studentRole's major, update it
  if (
    studentRole.majorId === null ||
    editedStudentMajor.value.id !== studentRole.majorId
  ) {
    await UserRoleDataService.update({
      id: studentRole.id,
      majorId: editedStudentMajor.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's classification has changed, update it
async function updateStudentClassification() {
  // If the editedStudentClassification is different from the studentRole's classification, update it
  if (
    studentRole.studentClassification === null ||
    editedStudentClassification.value !== studentRole.studentClassification
  ) {
    await UserRoleDataService.update({
      id: studentRole.id,
      studentClassification: editedStudentClassification.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's semesters have changed, update it
async function updateStudentSemesters() {
  // If the editedStudentSemesters is different from the studentRole's semesters, update it
  if (
    studentRole.studentSemesters === null ||
    editedStudentSemesters.value !== studentRole.studentSemesters
  ) {
    await UserRoleDataService.update({
      id: studentRole.id,
      studentSemesters: editedStudentSemesters.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's title has changed, update it
async function updateFacultyTitle() {
  // If the editedFacultyTitle is different from the facultyRole's title, update it
  if (
    facultyRole.title === null ||
    editedFacultyTitle.value !== facultyRole.title
  ) {
    await UserRoleDataService.update({
      id: facultyRole.id,
      title: editedFacultyTitle.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

async function refreshStudentInstruments() {
  await StudentInstrumentDataService.getStudentInstrumentsForStudentId(
    studentRole.id
  )
    .then((response) => {
      studentRole.studentRole = response.data;
      editedStudentHours.value = studentRole.studentRole.reduce((sum, obj) => {
        if (obj.status === "Active") {
          return sum + obj.privateHours;
        } else {
          return sum;
        }
      }, 0);
    })
    .catch((err) => {
      console.log(err);
    });
}

onMounted(async () => {
  await getAllRoles();
  await getAllMajors();
  await refreshStudentInstruments();
});
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
            {{ props.isEdit ? "Edit" : "Add" }} User
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="1">
            <v-avatar size="55" color="darkBlue">
              <v-img referrerpolicy="no-referrer" :src="userData.picture" />
            </v-avatar>
          </v-col>
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ userData.firstName }}
              {{ userData.lastName }}
            </v-card-title>
            <v-card-subtitle class="text-weight-semi-bold mt-0 py-0">
              <a v-bind:href="'mailto:' + userData.email" class="text-blue">
                {{ userData.email }}</a
              >
            </v-card-subtitle>
          </v-col>
          <v-col v-if="props.isEdit" cols="auto" align-self="center">
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
        <v-row :class="props.isEdit ? '' : 'mt-2'">
          <v-col>
            <v-card-subtitle
              v-if="!props.isEdit"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              First Name
            </v-card-subtitle>
            <v-text-field
              v-if="!props.isEdit"
              placeholder="John"
              v-model="editedUserData.firstName"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[(v) => !!v || 'This field is required']"
            ></v-text-field>

            <v-card-subtitle
              v-if="!props.isEdit"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Last Name
            </v-card-subtitle>
            <v-text-field
              v-if="!props.isEdit"
              placeholder="Doe"
              v-model="editedUserData.lastName"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[(v) => !!v || 'This field is required']"
            ></v-text-field>

            <v-card-subtitle
              v-if="!props.isEdit"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Email
            </v-card-subtitle>
            <v-text-field
              v-if="!props.isEdit"
              placeholder="john.doe@oc.edu"
              v-model="editedUserData.email"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                (v) => !!v || 'This field is required',
                (v) =>
                  /^\S+@\S+$/.test(v) ||
                  'Must contain an @ followed by a domain',
                (v) =>
                  (!!v && v.split('@').pop() === 'oc.edu') ||
                  (!!v && v.split('@').pop() === 'eagles.oc.edu') ||
                  'Must be a valid OC domain (oc.edu or eagles.oc.edu)',
              ]"
            ></v-text-field>

            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Phone Number
            </v-card-subtitle>
            <v-text-field
              placeholder="4051234567"
              v-model="editedUserData.phoneNumber"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[
                (v) => !!v || 'This field is required',
                (v) => /^[0-9]+$/.test(v) || 'Must contain only numbers',
                (v) => (!!v && v.length >= 10) || 'Number too short',
                (v) => (!!v && v.length <= 10) || 'Number too long',
              ]"
            ></v-text-field>

            <v-card-subtitle
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Roles
            </v-card-subtitle>
            <v-select
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="editedUserRoles"
              :items="roleOptions"
              :item-title="(item) => item.role"
              item-value="id"
              multiple
              return-object
            >
              <template v-slot:selection="{ item }">
                <v-chip
                  label
                  flat
                  size="small"
                  class="font-weight-bold text-none text-white flatChipBorder bg-blue"
                >
                  {{ item.title }}
                </v-chip>
              </template>
            </v-select>

            <v-card-subtitle
              v-if="isFaculty"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Title
            </v-card-subtitle>
            <v-text-field
              v-if="isFaculty"
              s
              placeholder="Professor of Music"
              v-model="editedFacultyTitle"
              variant="plain"
              class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
              :rules="[(v) => !!v || 'This field is required']"
            ></v-text-field>

            <v-card-subtitle
              v-if="isStudent"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Classification
            </v-card-subtitle>
            <v-select
              v-if="isStudent"
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="editedStudentClassification"
              :items="classificationOptions"
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>

            <v-card-subtitle
              v-if="isStudent"
              class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
            >
              Major
            </v-card-subtitle>
            <v-select
              v-if="isStudent"
              color="darkBlue"
              variant="plain"
              class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
              v-model="editedStudentMajor"
              :items="majorOptions"
              :item-title="(item) => item.name"
              item-value="id"
              return-object
              :rules="[(v) => !!v || 'This field is required']"
            >
            </v-select>

            <v-row v-if="isStudent" class="pa-0 ma-0">
              <v-col cols="12" lg="auto" class="pa-0 ma-0">
                <v-card-subtitle
                  class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                >
                  Semesters
                </v-card-subtitle>
                <v-text-field
                  type="number"
                  color="darkBlue"
                  variant="plain"
                  class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
                  v-model="editedStudentSemesters"
                  :rules="[(v) => !!v || 'This field is required']"
                >
                </v-text-field>
              </v-col>
              <v-spacer></v-spacer>
              <v-col cols="12" lg="auto" class="pa-0 ma-o">
                <v-card-subtitle
                  class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                >
                  Total Private Hours
                </v-card-subtitle>
                <v-text-field
                  type="number"
                  color="darkBlue"
                  variant="plain"
                  class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
                  v-model="editedStudentHours"
                  readonly
                  :rules="[(v) => !!v || 'This field is required']"
                >
                </v-text-field>
              </v-col>
            </v-row>
          </v-col>
          <v-col v-if="isStudent">
            <v-row class="pb-2">
              <v-col cols="auto" align-self="center">
                <v-card-subtitle
                  class="pl-0 font-weight-semi-bold text-darkBlue"
                >
                  Instruments
                </v-card-subtitle>
              </v-col>
              <v-col cols="auto" align-self="center">
                <v-btn
                  flat
                  size="small"
                  class="font-weight-semi-bold text-none text-white bg-darkBlue flatChipBorder"
                  @click="addInstrument"
                >
                  Add Instrument
                </v-btn>
              </v-col>
            </v-row>

            <v-card class="bg-lightGray pa-4 pb-0 flatCardBorder">
              <UserInstrumentCard
                v-for="studentInstrument of studentRole.studentRole"
                :key="studentInstrument.id"
                :student-instrument-data="studentInstrument"
                @refreshStudentInstrumentsEvent="refreshStudentInstruments"
              ></UserInstrumentCard>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateUser() : addUser()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeUserDialogEvent')
              : emits('closeAddUserDialogEvent')
          "
        >
          Cancel
        </v-btn>
        <v-btn
          v-if="props.isEdit && (currentRole.role.role == 'Admin')"
          flat
          class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white flatChipBorder"
          :class="
            props.userData.status === 'Disabled' ? 'bg-darkBlue' : 'bg-maroon'
          "
          @click="
            props.userData.status === 'Disabled'
              ? emits('enableUserEvent')
              : emits('disableUserEvent')
          "
        >
          {{ props.userData.status === "Disabled" ? "Enable" : "Disable" }}
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
  <v-dialog v-model="addInstrumentDialog" persistent max-width="600px">
    <UserInstrumentDialogBody
      :is-edit="false"
      :student-instrument-data="{
        id: null,
        status: 'Active',
        levelId: null,
        studentRoleId: props.userRoles.find((ur) => ur.roleId === 1).id,
        instructorRoleId: null,
        accompanistRoleId: null,
        instrumentId: null,
        instructorRole: null,
        accompanistRole: null,
        instrument: null,
        level: null,
      }"
      @addInstrumentSuccessEvent="
        closeAddInstrumentDialog(), refreshStudentInstruments()
      "
      @closeUserInstrumentDialogEvent="closeAddInstrumentDialog"
    ></UserInstrumentDialogBody>
  </v-dialog>
</template>
