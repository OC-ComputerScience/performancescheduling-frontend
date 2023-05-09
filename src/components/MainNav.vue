<script setup>
import ocLogo from "../../public/oc_logo_social.png";
import AuthServices from "../services/authServices.js";
import { useLoginStore } from "../stores/LoginStore.js";
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const loginStore = useLoginStore();
const drawer = ref(false);
const title = "OC Music Department";
const initials = ref("");
const name = ref("");
const activeMenus = ref([]);
const menus = [
  {
    link: "studentRepertoire",
    text: "Repertoire",
    roles: [1],
  },
  {
    link: "studentEventSignUps",
    text: "Event Sign-Ups",
    roles: [1],
  },
  {
    link: "studentCritiques",
    text: "Critiques",
    roles: [1],
  },
  {
    link: "facultyViewCritiques",
    text: "View Student Critiques",
    roles: [2],
  },
  {
    link: "createAvailability",
    text: "Event Availability",
    roles: [2, 4],
  },
  {
    link: "adminViewUsers",
    text: "Users",
    roles: [3],
  },
  {
    link: "adminViewEvents",
    text: "Events",
    roles: [3],
  },
];
const userRoles = ref([]);
const { currentRole } = storeToRefs(loginStore);

function getUserRoles() {
  userRoles.value = [];
  userRoles.value.push(loginStore.user.roles.default);
  userRoles.value = userRoles.value.concat(loginStore.user.roles.additional);
}
function goToHome() {
  if (loginStore.currentRole.role === "Faculty") {
    router.push({ path: "facultyHome" });
  } else if (loginStore.currentRole.role == "Student") {
    router.push({ path: "studentHome" });
  } else if (loginStore.currentRole.role == "Admin") {
    router.push({ path: "adminHome" });
  } else if (loginStore.currentRole.role == "Accompanist") {
    router.push({ path: "createAvailability" });
  } else {
    router.push({ path: "base" });
  }
}
function resetMenu() {
  if (loginStore.user != null) {
    initials.value = loginStore.user.firstName[0] + loginStore.user.lastName[0];
    name.value = loginStore.user.firstName + " " + loginStore.user.lastName;

    if (loginStore.currentRole.role !== "") {
      activeMenus.value = menus.filter((menu) =>
        menu.roles.includes(loginStore.currentRole.roleId)
      );
    }
  }
}
function logout() {
  AuthServices.logoutUser(loginStore.user)
    .then((response) => {
      loginStore.$patch({
        user: {},
        currentRole: {},
      });
      router.push({ name: "loginPage" });
    })
    .catch((error) => {
      console.log("error", error);
    });
}
function changeComp(route) {
  router.push({ path: route });
}

watch(currentRole, () => {
  if (currentRole != {}) {
    goToHome();
    resetMenu();
  }
});

onMounted(() => {
  getUserRoles();
  resetMenu();
});
</script>
<template>
  <v-app-bar color="maroon" prominent class="elevation-0">
    <template v-slot:prepend>
      <!-- OC logo image -->
      <v-btn icon plain @click="goToHome">
        <v-img
          class="mx-2"
          :src="ocLogo"
          height="50"
          width="50"
          contain
          transition="scale-transition"
        ></v-img>
      </v-btn>
    </template>
    <!-- OC Music Dept title in top bar -->
    <v-toolbar-title class="title">
      {{ title }}
    </v-toolbar-title>
    <!-- <v-spacer></v-spacer> -->
    <div v-if="userRoles.length > 1" class="align-right justify-right d-flex">
      <v-toolbar-items
        v-for="menu in activeMenus"
        :key="menu.link"
        class="hidden-md-and-down"
      >
        <v-btn
          class="hidden-md-and-down white--text mx-1"
          exact
          text
          @click="changeComp(menu.link)"
        >
          {{ menu.text }}
        </v-btn>
      </v-toolbar-items>
      <v-btn
        v-if="loginStore.currentRole.role === ''"
        variant="text"
        @click="logout()"
      >
        Log back in
      </v-btn>
      <v-select
        :items="userRoles"
        item-title="role"
        v-model="loginStore.currentRole"
        variant="underlined"
        class="ma-2"
        return-object
      >
      </v-select>
    </div>
    <div v-else class="align-right justify-right d-flex">
      <v-toolbar-items
        v-for="menu in activeMenus"
        :key="menu.link"
        class="hidden-md-and-down"
      >
        <v-btn
          class="hidden-md-and-down white--text mx-1"
          style="height: 45px"
          exact
          text
          @click="changeComp(menu.link)"
        >
          {{ menu.text }}
        </v-btn>
      </v-toolbar-items>
      <v-btn
        v-if="loginStore.currentRole.role === ''"
        variant="text"
        @click="logout()"
      >
        Log back in
      </v-btn>
    </div>

    <v-menu
      bottom
      min-width="250px"
      rounded
      offset-y
      v-if="loginStore.user != null"
    >
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon x-large>
          <v-avatar v-if="loginStore.user != null" color="secondary">
            <v-img
              v-if="loginStore.user.picture"
              :src="loginStore.user.picture"
            ></v-img>
            <span v-else class="accent--text font-weight-bold">{{
              initials
            }}</span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card>
        <v-card-text>
          <div class="mx-auto text-center">
            <v-avatar color="secondary" class="mt-2 mb-2">
              <img
                v-if="loginStore.user.picture"
                :src="loginStore.user.picture"
                referrerpolicy="no-referrer"
              />
              <span v-else class="accent--text font-weight-bold">{{
                initials
              }}</span>
            </v-avatar>
            <h3>{{ name }}</h3>
            <p class="text-caption mt-1">
              {{ loginStore.user.email }}
            </p>
            <v-divider class="my-3"></v-divider>
            <v-btn variant="text" @click="changeComp('studentSettings')">
              Student Settings
            </v-btn>
            <br />
            <v-btn variant="text" @click="logout()"> Logout </v-btn>
          </div>
        </v-card-text>
      </v-card>
    </v-menu>
    <v-app-bar-nav-icon
      dark
      class="hidden-lg-and-up"
      @click="drawer = !drawer"
    ></v-app-bar-nav-icon>
  </v-app-bar>
  <v-navigation-drawer
    v-model="drawer"
    class="hidden-lg-and-up"
    app
    location="right"
    color="primary"
  >
    <v-list>
      <v-list-item
        v-for="menu in activeMenus"
        :key="menu.text"
        exact
        @click="changeComp(menu.link)"
      >
        <v-list-item-title class="white--text"
          >{{ menu.text }}
        </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style>
.text-center {
  text-align: center;
}
</style>
