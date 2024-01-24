<script setup>
import { ref, onBeforeMount, computed } from "vue";
import UserDataService from "./../../../../services/UserDataService";
import UserRoleDataService from "./../../../../services/UserRoleDataService";
import MaintainUserCard from "./MaintainUserCard.vue";
import UserDialogBody from "./UserDialogBody.vue";
import { useLoginStore } from "../../../../stores/LoginStore.js";

const loginStore = useLoginStore();
const isAdmin = ref(loginStore.currentRole.roleId === 3 ? true : false);

const addUserDialog = ref(false);

const dataLoaded = ref(false);

// User Data
const users = ref([]);
const filteredUsers = ref([]);
if (!isAdmin.value) {
  filteredUsers.value = ["Students"];
}

const instructorFilterOptions = ref([]);
const instructorFilterSelection = ref(null);

async function getInstructor() {
  await UserRoleDataService.getRolesForRoleId(2, null, null, "All").then(
    (response) => {
      instructorFilterOptions.value = response.data;
      instructorFilterOptions.value.forEach((instructor) => {
        instructor.name =
          instructor.user.firstName + " " + instructor.user.lastName;
      });
    }
  );
}

async function getUsers() {
  dataLoaded.value = false;
  await UserDataService.getAllWithRolesAndStudentInstruments("lastName")
    .then((response) => {
      users.value = response.data;
      filteredUsers.value = users.value;
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      dataLoaded.value = true;
    });
}

async function refreshUsers() {
  await getUsers();
  searchFilteredList();
}

// Filtering

const filterMenuBool = ref(false);

const searchInput = ref("");

// Search filter
// Filters the list of users by first and last name, based on searchInput

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

const roleFilterOptions = [
  { role: "Student", id: 1 },
  { role: "Faculty", id: 2 },
  { role: "Admin", id: 3 },
  { role: "Accompanist", id: 4 },
];
const roleFilterSelection = ref([]);
if (!isAdmin.value) {
  roleFilterSelection.value = [{ role: "Student", id: 1 }];
}

const studentTypeFilterOptions = [
  { title: "Instrumental", value: "Instrument" },
  { title: "Vocal", value: "Vocal" },
];
const studentTypeFilterSelection = ref(null);

function filterUsers() {
  filteredUsers.value = users.value;
  // Never clear the serach filter, so filter by that first, then the actual filters
  //searchFilteredList();
  // Filter by status
  if (statusFilterSelection.value) {
    filteredUsers.value = filteredUsers.value.filter(
      (u) => u.status === statusFilterSelection.value
    );
  }

  // Filter by role
  if (roleFilterSelection.value.length > 0) {
    for (let role of roleFilterSelection.value) {
      filteredUsers.value = filteredUsers.value.filter((u) =>
        u.userRoles.some(
          (ur) => ur.roleId === role.id && ur.status === "Active"
        )
      );
    }
  }

  // Filter by student type, only available if student role filter is active
  if (studentTypeFilterSelection.value != null) {
    // For each studentType filter selected, filter filteredUsers by user.userRoles.
    // {role that is a student}.studentRole.{check if any of these studentRoles.instrument.
    // type are the type we are looking for.}

    filteredUsers.value = filteredUsers.value.filter((su) => {
      let fsu = su.userRoles.find((sur) => sur.roleId === 1);
      if (fsu) {
        return fsu.studentRole.some(
          (sr) =>
            sr.instrument.type === studentTypeFilterSelection.value &&
            sr.status === "Active"
        );
      } else return false;
    });
  }

  //filter by instructor

  if (instructorFilterSelection.value != null) {
    filteredUsers.value = filteredUsers.value.filter((user) => {
      let found = false;
      user.userRoles.forEach((ur) => {
        if (ur.roleId === 1) {
          if (
            ur.studentRole.some(
              (sr) => sr.instructorRoleId === instructorFilterSelection.value.id
            )
          )
            found = true;
        }
      });
      return found;
    });
  }
  if (searchInput.value != "") {
    filteredUsers.value = filteredUsers.value.filter((user) =>
      (
        user.firstName.toLowerCase() +
        " " +
        user.lastName.toLowerCase()
      ).includes(searchInput.value.toLowerCase())
    );
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredUsers.value = users.value;
  statusFilterSelection.value = null;
  roleFilterSelection.value = [];
  instructorFilterSelection.value = null;
  if (!isAdmin.value) {
    roleFilterSelection.value = [{ role: "Student", id: 1 }];
  }
  studentTypeFilterSelection.value = null;
  searchInput.value = "";
  filterUsers();
}

// Omits a specific key from an object
// Used when passing userData (sans userRoles) to MaintainUserCard
// _omitted is an unused variable where the destructured data lives,
// and is ignored by eslint using the varsIgnorePattern addition
// to the .eslintrc.js file. This is not an ideal solution, but it is efficient and works.
// The only way to avoid the unused variable is to use 'delete', which is not immutable.
function omit(key, obj) {
  let { [key]: _omitted, ...rest } = obj;
  return rest;
}

// Pagination

const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredUsers.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

const filerContents = computed(() => {
  let fc = "";
  if (searchInput.value != "") {
    fc += "User: " + searchInput.value + ", ";
  } else {
    fc += "User: All, ";
  }
  if (statusFilterSelection.value != null) {
    fc += "Status: " + statusFilterSelection.value + ", ";
  } else {
    fc += "Status: All, ";
  }
  if (roleFilterSelection.value.length > 0) {
    fc += "Role: ";
    roleFilterSelection.value.forEach((r) => {
      fc += r.role + ",";
    });
  } else {
    fc += "Role: All, ";
  }
  if (instructorFilterSelection.value != null) {
    fc += "Instructor: " + instructorFilterSelection.value.name;
  } else {
    fc += "Instructor: All, ";
  }
  if (studentTypeFilterSelection.value != null) {
    fc += "Type: " + studentTypeFilterSelection.value;
  } else {
    fc += "Type: All";
  }
  return fc;
});

onBeforeMount(async () => {
  await getInstructor();
  await refreshUsers();
});
</script>
<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight-bold text-h3">
        {{ isAdmin ? "Users" : "Students" }}
      </h1>

      <input
        type="text"
        v-model="searchInput"
        @input="filterUsers"
        class="ml-6 px-4 my-1 mainCardBorder text-blue bg-white font-weight-semi-bold"
        style="outline: none"
        append-icon="mdi-magnify"
        placeholder="Search"
        single-line
        hide-details
      />

      <v-menu v-model="filterMenuBool" :close-on-content-click="false">
        <template v-slot:activator="{ props }">
          <v-btn
            size="medium"
            class="font-weight-semi-bold text-darkBlue ml-6 px-2 my-1 mainCardBorder text-none"
            v-bind="props"
          >
            <template v-slot:append>
              <v-icon
                :icon="filterMenuBool ? 'mdi-chevron-up' : 'mdi-chevron-down'"
              ></v-icon>
            </template>
            Filter users
          </v-btn>
        </template>

        <v-card min-width="300" class="mainCardBorder mt-2">
          <v-card-text>
            <v-list class="pa-0 ma-0">
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Status
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="statusFilterSelection"
                  :items="statusFilterOptions"
                  return-object
                  clearable
                ></v-select>
              </v-list-item>
              <v-list-item
                v-if="isAdmin"
                class="pa-0 font-weight-semi-bold text-darkBlue"
              >
                Role
                <v-select
                  multiple
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="roleFilterSelection"
                  :items="roleFilterOptions"
                  item-title="role"
                  return-object
                  clearable
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Instructor
                <v-autocomplete
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="instructorFilterSelection"
                  :items="instructorFilterOptions"
                  item-title="name"
                  item-value="id"
                  return-object
                  clearable
                ></v-autocomplete>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
                Student Type
                <v-select
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="studentTypeFilterSelection"
                  :items="studentTypeFilterOptions"
                  item-title="title"
                  item-value="value"
                  clearable
                ></v-select>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions class="px-4 pb-4">
            <v-btn
              @click="filterUsers(), (filterMenuBool = false)"
              class="bg-teal text-white font-weight-bold text-none innerCardBorder"
            >
              Apply Filters
            </v-btn>
            <v-btn
              v-if="
                statusFilterSelection ||
                roleFilterSelection != 0 ||
                studentTypeFilterSelection != 0
              "
              @click="clearFilters"
              class="bg-maroon ml-auto text-white font-weight-bold text-none innerCardBorder"
            >
              Clear Filters
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn
        v-if="
          statusFilterSelection ||
          roleFilterSelection != 0 ||
          studentTypeFilterSelection != 0
        "
        size="medium"
        color="maroon"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="clearFilters"
      >
        Clear filters
      </v-btn>
      <v-btn
        v-if="isAdmin"
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addUserDialog = true"
      >
        Add new user
      </v-btn>
    </v-row>
    <v-row class="ml-6"> Displaying : {{ filerContents }}</v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row v-if="dataLoaded">
            <v-col
              v-for="user in currentPageData"
              :key="user.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainUserCard
                :user-data="omit('userRoles', user)"
                :user-roles="user.userRoles"
                @refreshUsersEvent="refreshUsers()"
              ></MaintainUserCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pt-3">
      <v-col>
        <v-card class="mainCardBorder">
          <v-pagination
            color="blue"
            class="font-weight-bold"
            :length="
              filteredUsers.length % perPage == 0
                ? filteredUsers.length / perPage
                : Math.floor(filteredUsers.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addUserDialog" persistent max-width="600px">
    <UserDialogBody
      :is-edit="false"
      :user-data="{
        id: null,
        firstName: null,
        lastName: null,
        honorific: null,
        email: null,
        phoneNumber: null,
        authenticationType: 'OC',
        password: null,
        picture: null,
        emailStatus: true,
        textStatus: true,
        googleToken: null,
        status: 'Active',
      }"
      :user-roles="[]"
      @closeAddUserDialogEvent="addUserDialog = false"
      @addUserSuccessEvent="(addUserDialog = false), refreshUsers()"
    ></UserDialogBody>
  </v-dialog>
</template>
