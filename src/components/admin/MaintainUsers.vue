<script setup>
import { ref, onMounted, computed } from "vue";
import UserDataService from "./../../services/UserDataService";
import MaintainUserCard from "./MaintainUserCard.vue";
import UserDialogBody from "./UserDialogBody.vue";

const addUserDialog = ref(false);

// User Data
const users = ref([]);

async function getUsers() {
  await UserDataService.getAllWithRolesAndStudentInstruments()
    .then((response) => {
      users.value = response.data;
      filteredUsers.value = users.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshUsers() {
  await getUsers();
  await filterUsers();
}

// Filtering

const filterMenuBool = ref(false);
const filteredUsers = ref([]);

const searchInput = ref("");

// Search filter
// Filters the list of users by first and last name, based on searchInput
function searchFilteredList() {
  filteredUsers.value = users.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredUsers.value = filteredUsers.value.filter((user) =>
    (user.firstName.toLowerCase() + " " + user.lastName.toLowerCase()).includes(
      searchInput.value.toLowerCase()
    )
  );
}

const statusFilterOptions = ["Active", "Disabled"];
const statusFilterSelection = ref(null);

const roleFilterOptions = [
  { role: "Student", id: 1 },
  { role: "Faculty", id: 2 },
  { role: "Admin", id: 3 },
  { role: "Accompanist", id: 4 },
];
const roleFilterSelection = ref([]);

const studentTypeFilterOptions = [
  { title: "Instrumental", value: "Instrument" },
  { title: "Vocal", value: "Vocal" },
];
const studentTypeFilterSelection = ref([]);

function filterUsers() {
  // Never clear the serach filter, so filter by that first, then the actual filters
  searchFilteredList();
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
        u.userRoles.some((ur) => ur.roleId === role.id)
      );
    }
  }

  // Filter by student type, only available if student role filter is active
  if (studentTypeFilterSelection.value.length > 0) {
    // For each studentType filter selected, filter filteredUsers by user.userRoles.
    // {role that is a student}.studentRole.{check if any of these studentRoles.instrument.
    // type are the type we are looking for.}
    for (let type of studentTypeFilterSelection.value) {
      filteredUsers.value = filteredUsers.value.filter((su) =>
        su.userRoles
          .find((sur) => sur.roleId === 1)
          .studentRole.some((sr) => sr.instrument.type === type)
      );
    }
  }
}

// Clears all filters and returns to page 1
function clearFilters() {
  currentPage.value = 1;
  filteredUsers.value = users.value;
  statusFilterSelection.value = null;
  roleFilterSelection.value = [];
  studentTypeFilterSelection.value = [];
  searchInput.value = "";
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

onMounted(async () => {
  await getUsers();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Users</h1>

      <input
        type="text"
        v-model="searchInput"
        @input="searchFilteredList"
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
                ></v-select>
              </v-list-item>
              <v-list-item class="pa-0 font-weight-semi-bold text-darkBlue">
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
                ></v-select>
              </v-list-item>
              <v-list-item
                v-if="roleFilterSelection.some((r) => r.id === 1)"
                class="pa-0 font-weight-semi-bold text-darkBlue"
              >
                Student Type
                <v-select
                  multiple
                  color="darkBlue"
                  variant="underlined"
                  class="font-weight-medium text-darkBlue pt-0 mt-0"
                  v-model="studentTypeFilterSelection"
                  :items="studentTypeFilterOptions"
                  item-title="title"
                  item-value="value"
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
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addUserDialog = true"
      >
        Add new user
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
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
            :length="filteredUsers.length / perPage + 1"
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
      :user-roles="null"
      @closeAddUserDialogEvent="addUserDialog = false"
      @addUserSuccessEvent="(addUserDialog = false), refreshUsers()"
    ></UserDialogBody>
  </v-dialog>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
