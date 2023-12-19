<script setup>
import { ref, onMounted } from "vue";
import { useLoginStore } from "../stores/LoginStore.js";
import { storeToRefs } from "pinia";
import MajorDataService from "../services/MajorDataService";
import UserDataService from "../services/UserDataService";
import UserRoleDataService from "../services/UserRoleDataService";
import router from "../router";

const loginStore = useLoginStore();
const { currentRole } = storeToRefs(loginStore);

const form = ref(null);

const userData = ref(Object.assign({}, currentRole.value.user));
const userRoles = ref([]);

const isStudent = ref(currentRole.value.role.role == "Student");

const isFaculty = ref(currentRole.value.role.role == "Faculty");

const editedUserData = ref(Object.assign({}, userData.value));

const editedStudentMajor = ref(
  isStudent.value ? currentRole.value.major : null
);

const majorOptions = ref([]);

async function getUserData() {
  await UserRoleDataService.getRolesForUser(currentRole.value.userId)
    .then((response) => {
      userRoles.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function getAllMajors() {
  await MajorDataService.getAll("name")
    .then((response) => {
      majorOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

const editedStudentClassification = ref(
  isStudent.value ? currentRole.value.studentClassification : null
);

const classificationOptions = ref([
  "Freshman",
  "Sophomore",
  "Junior",
  "Senior",
  "Graduate",
]);

const editedStudentSemesters = ref(
  isStudent.value ? currentRole.value.studentSemesters : null
);

const editedFacultyTitle = ref(
  isFaculty.value ? currentRole.value.title : null
);

// Update the user's roles, then
// if isStudent, update the student's major, classification, semesters, and hours, then
// if isFaculty, update the faculty's title, then
// update the user's data
async function updateUser() {
  form.value.validate().then(async (valid) => {
    if (valid.valid) {
      if (isStudent.value) {
        await updateStudentMajor();
        await updateStudentClassification();
        await updateStudentSemesters();
      }

      if (isFaculty.value) {
        await updateFacultyTitle();
      }

      await updateTextStatus();
      await updateEmailStatus();
      await updatePhoneNumber();
      await updateHonorific();
      await updateTitle();
      await UserDataService.update(editedUserData.value);
      await getUserData();

      loginStore.setRoles(userRoles.value);
    }
  });

  if (currentRole.value.roleId == 1) {
    router.push({ path: "studentHome" });
  } else if (currentRole.value.roleId == 2) {
    router.push({ path: "facultyHome" });
  } else if (currentRole.value.roleId == 3) {
    router.push({ path: "adminHome" });
  } else {
    router.push({ path: "accompanistHome" });
  }
}

// If the user's major has changed, update it
async function updateStudentMajor() {
  // Find the student role

  // If the editedStudentMajor is different from the currentRole.value's major, update it
  if (
    currentRole.value.majorId === null ||
    editedStudentMajor.value.id !== currentRole.value.majorId
  ) {
    await UserRoleDataService.update({
      id: currentRole.value.id,
      majorId: editedStudentMajor.value.id,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's classification has changed, update it
async function updateStudentClassification() {
  // If the editedStudentClassification is different from the currentRole.value's classification, update it
  if (
    currentRole.value.studentClassification === null ||
    editedStudentClassification.value !==
      currentRole.value.studentClassification
  ) {
    await UserRoleDataService.update({
      id: currentRole.value.id,
      studentClassification: editedStudentClassification.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's semesters have changed, update it
async function updateStudentSemesters() {
  // If the editedStudentSemesters is different from the currentRole.value's semesters, update it
  if (
    currentRole.value.studentSemesters === null ||
    editedStudentSemesters.value !== currentRole.value.studentSemesters
  ) {
    await UserRoleDataService.update({
      id: currentRole.value.id,
      studentSemesters: editedStudentSemesters.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's title has changed, update it
async function updateFacultyTitle() {
  // If the editedFacultyTitle is different from the currentRole.value's title, update it
  if (
    currentRole.value.title === null ||
    editedFacultyTitle.value !== currentRole.value.title
  ) {
    await UserRoleDataService.update({
      id: currentRole.value.id,
      title: editedFacultyTitle.value,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's text status has changed, update it
async function updateTextStatus() {
  // If the editedTextStatus is different from the userData's text status, update it
  if (
    userData.value.textStatus === null ||
    editedUserData.value.textStatus !== userData.value.textStatus
  ) {
    await UserDataService.update({
      id: currentRole.value.userId,
      textStatus: editedUserData.value.textStatus,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's email status has changed, update it
async function updateEmailStatus() {
  // If the editedEmailStatus is different from the userData's email status, update it
  if (
    userData.value.emailStatus === null ||
    editedUserData.value.emailStatus !== userData.value.emailStatus
  ) {
    await UserDataService.update({
      id: currentRole.value.userId,
      emailStatus: editedUserData.value.emailStatus,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's phone number has changed, update it
async function updatePhoneNumber() {
  // If the phone number is different from the userData's phone number, update it
  if (
    userData.value.phoneNumber === null ||
    editedUserData.value.phoneNumber !== userData.value.phoneNumber
  ) {
    await UserDataService.update({
      id: currentRole.value.userId,
      phoneNumber: editedUserData.value.phoneNumber,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's honorific has changed, update it
async function updateHonorific() {
  // If the honorific is different from the userData's honorific, update it
  if (
    userData.value.honorific === null ||
    editedUserData.value.honorific !== userData.value.honorific
  ) {
    await UserDataService.update({
      id: currentRole.value.userId,
      honorific: editedUserData.value.honorific,
    }).catch((err) => {
      console.log(err);
    });
  }
}

// If the user's title has changed, update it
async function updateTitle() {
  // If the title is different from the userData's title, update it
  if (
    userData.value.title === null ||
    editedUserData.value.title !== userData.value.title
  ) {
    await UserDataService.update({
      id: currentRole.value.userId,
      title: editedUserData.value.title,
    }).catch((err) => {
      console.log(err);
    });
  }
}

onMounted(async () => {
  await getAllMajors();
});
</script>

<template>
  <v-container fluid class="bg-lightGray pa-4 pl-16 pr-16">
    <v-card class="pa-2 flatCardBorder">
      <v-form ref="form" validate-on="input">
        <v-card-title>
          <v-row class="pt-0 mt-0">
            <v-col
              cols="auto"
              class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
            >
              User Settings
            </v-col>
          </v-row>
        </v-card-title>
        <v-card-text class="pt-0">
          <v-row>
            <v-col>
              <v-row class="pa-0 ma-0">
                <v-col class="pa-0 ma-0 mr-1">
                  <v-card-subtitle
                    class="pl-0 pb-2 mt-2 font-weight-semi-bold text-darkBlue"
                  >
                    First Name
                  </v-card-subtitle>
                  <v-text-field
                    placeholder="John"
                    v-model="editedUserData.firstName"
                    variant="plain"
                    class="font-weight-bold text-blue bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4 mr-4"
                    readonly
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </v-col>
                <v-col class="pa-0 ma-0">
                  <v-card-subtitle
                    class="pl-0 pb-2 mt-2 font-weight-semi-bold text-darkBlue"
                  >
                    Last Name
                  </v-card-subtitle>
                  <v-text-field
                    placeholder="Doe"
                    v-model="editedUserData.lastName"
                    variant="plain"
                    class="font-weight-bold text-blue bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
                    readonly
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col class="pa-0 ma-0 mr-1">
                  <v-card-subtitle
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                  >
                    Honorific
                  </v-card-subtitle>
                  <v-text-field
                    placeholder="Mr"
                    v-model="editedUserData.honorific"
                    variant="plain"
                    class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4 mr-4"
                    :rules="[(v) => !!v || 'This field is required']"
                  ></v-text-field>
                </v-col>

                <v-col class="pa-0 ma-0">
                  <v-card-subtitle
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                  >
                    Email
                  </v-card-subtitle>
                  <v-text-field
                    placeholder="john.doe@oc.edu"
                    v-model="editedUserData.email"
                    variant="plain"
                    class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
                    readonly
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
                </v-col>

                <v-col class="pa-0 ma-0">
                  <v-card-subtitle
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue ml-4"
                  >
                    Phone Number
                  </v-card-subtitle>
                  <v-text-field
                    placeholder="4051111111"
                    v-model="editedUserData.phoneNumber"
                    variant="plain"
                    class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4 ml-4"
                    :rules="[
                      (v) => !!v || 'This field is required',
                      (v) => /^[0-9]+$/.test(v) || 'Must contain only numbers',
                      (v) => (!!v && v.length >= 10) || 'Number too short',
                      (v) => (!!v && v.length <= 10) || 'Number too long',
                    ]"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-row v-if="isStudent" class="pa-0 ma-0">
                <v-col class="pa-0 ma-0 mr-1">
                  <v-card-subtitle
                    v-if="isStudent"
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                  >
                    Major
                  </v-card-subtitle>
                  <v-autocomplete
                    clearable
                    color="darkBlue"
                    variant="plain"
                    class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4 mr-4"
                    v-model="editedStudentMajor"
                    :items="majorOptions"
                    :item-title="(item) => item.name"
                    item-value="id"
                    return-object
                    :rules="[(v) => !!v || 'This field is required']"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col class="pa-0 ma-0 mr-1">
                  <v-card-subtitle
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
                  >
                    Classification
                  </v-card-subtitle>
                  <v-select
                    color="darkBlue"
                    variant="plain"
                    class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
                    v-model="editedStudentClassification"
                    :items="classificationOptions"
                    :rules="[(v) => !!v || 'This field is required']"
                  >
                  </v-select>
                </v-col>
                <v-col class="pa-0 ma-0">
                  <v-card-subtitle
                    class="pl-0 pb-2 font-weight-semi-bold text-darkBlue ml-4"
                  >
                    Semesters
                  </v-card-subtitle>
                  <v-text-field
                    type="number"
                    color="darkBlue"
                    variant="plain"
                    class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4 ml-4"
                    v-model="editedStudentSemesters"
                    :rules="[(v) => !!v || 'This field is required']"
                  >
                  </v-text-field>
                </v-col>
              </v-row>

              <v-row class="pa-0 ma-0">
                <v-col v-if="isFaculty" cols="3" class="pa-0 ma-0">
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
                </v-col>
                <v-row :class="isFaculty ? 'ml-8 my-6 ' : ''">
                  <v-col class="d-flex" cols="4">
                    <v-checkbox
                      v-model="editedUserData.textStatus"
                      label="Text Opt In"
                      class="font-weight-semi-bold text-darkBlue"
                    >
                    </v-checkbox>
                    <v-checkbox
                      v-model="editedUserData.emailStatus"
                      label="Email Opt In"
                      class="font-weight-semi-bold text-darkBlue"
                    >
                    </v-checkbox>
                  </v-col>
                </v-row>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            flat
            class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
            @click="updateUser()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>
