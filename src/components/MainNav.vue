<script setup>
import ocLogo from "../../public/oc_logo_red.png";
import AuthServices from "../services/authServices.js";
import { useLoginStore } from "../stores/LoginStore.js";
import { ref, onMounted, watch } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

const router = useRouter();
const loginStore = useLoginStore();
const drawer = ref(false);
const title = "PERFORMANCE SCHEDULING";
const initials = ref("");
const name = ref("");
const activeMenus = ref([]);
const menus = [
  {
    link: "studentHome",
    text: "Home",
    roles: [1],
  },
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
    link: "facultyHome",
    text: "Home",
    roles: [2, 4],
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
    link: "adminHome",
    text: "Home",
    roles: [3],
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
const activeLink = ref("");
const roleColors = [
  {
    roleId: 1,
    backgroundColor: "ourLightMaroon",
    textColor: "ourMaroon",
  },
  {
    roleId: 2,
    backgroundColor: "ourLightDarkBlue",
    textColor: "ourDarkBlue",
  },
  {
    roleId: 3,
    backgroundColor: "ourLightOrange",
    textColor: "ourOrange",
  },
  {
    roleId: 4,
    backgroundColor: "ourLightTeal",
    textColor: "ourTeal",
  },
];
const roleColor = ref({});

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
  updateActiveLink();
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
  updateActiveLink();
}
function updateActiveLink() {
  setTimeout(function () {
    activeLink.value = router.currentRoute.value.name;
    console.log(activeLink.value);
  }, 1);
}
function changeRole() {}

watch(currentRole, () => {
  if (currentRole != {}) {
    roleColor.value = roleColors.find((obj) => {
      return obj.roleId == loginStore.currentRole.roleId;
    });
    goToHome();
    resetMenu();
  }
});

onMounted(() => {
  getUserRoles();
  resetMenu();
  updateActiveLink();
  roleColor.value = roleColors.find((obj) => {
    return obj.roleId == loginStore.currentRole.roleId;
  });
});
</script>
<template>
  <v-container fluid class="mx-3 my-1">
    <v-row>
      <v-btn icon plain elevation="0" @click="goToHome">
        <v-img
          class="mx-2"
          :src="ocLogo"
          height="50"
          width="50"
          contain
          transition="scale-transition"
        ></v-img>
      </v-btn>
      <strong :style="{ color: 'maroon' }" class="mt-3 ml-3">{{
        title
      }}</strong>
      <v-spacer></v-spacer>
      <div class="align-right justify-right d-flex">
        <v-toolbar-items
          v-for="menu in activeMenus"
          :key="menu.link"
          class="hidden-md-and-down"
          :class="activeLink === menu.link ? 'text-ourBlue' : 'text-ourMaroon'"
        >
          <v-btn
            class="hidden-md-and-down mx-1 menu-link font-weight-bold"
            exact
            text
            :ripple="false"
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
      <v-icon class="mt-3 mr-5" color="ourMaroon" icon="mdi-bell"></v-icon>
      <v-menu
        bottom
        min-width="250px"
        rounded
        offset-y
        v-if="loginStore.user != null"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            :color="roleColor.backgroundColor"
            :class="'font-weight-bold text-' + roleColor.textColor"
            height="50"
            v-bind="props"
            x-large
            elevation="0"
          >
            {{ loginStore.currentRole.role }}
            <template v-slot:append>
              <v-avatar
                v-if="loginStore.user != null"
                color="secondary"
                class="with-outline"
              >
                <v-img
                  v-if="loginStore.user.picture"
                  :src="loginStore.user.picture"
                ></v-img>
                <span v-else class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
            </template>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto">
              <h3>{{ name }}</h3>
              <p class="text-caption text-grey">
                {{ loginStore.user.email }}
              </p>
              <v-btn
                color="ourLightMaroon"
                :class="'font-weight-bold text-ourMaroon mt-2'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="changeComp('studentSettings')"
              >
                Switch to Student View
              </v-btn>
              <br />
              <v-btn
                color="ourLightDarkBlue"
                :class="'font-weight-bold text-ourDarkBlue mt-2'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="changeComp('studentSettings')"
              >
                Switch to Faculty View
              </v-btn>
              <br />
              <v-btn
                color="ourLightOrange"
                :class="'font-weight-bold text-ourOrange mt-2'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="changeComp('studentSettings')"
              >
                Switch to Admin View
              </v-btn>
              <br />
              <v-btn
                color="ourLightTeal"
                :class="'font-weight-bold text-ourTeal mt-2'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="changeComp('studentSettings')"
              >
                Switch to Accompanist View
              </v-btn>
              <br />
              <v-btn
                prepend-icon="mdi-cog"
                color="ourLightBlue"
                :class="'mt-2 menu-button font-weight-bold text-ourBlue'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="changeComp('studentSettings')"
              >
                <template v-slot:prepend>
                  <v-icon></v-icon>
                </template>
                User Settings
              </v-btn>
              <br />
              <v-btn
                prepend-icon="mdi-logout"
                color="ourMediumGray"
                :class="'mt-2 menu-button font-weight-bold text-ourLightGray'"
                density="comfortable"
                elevation="0"
                width="250px"
                @click="logout()"
              >
                <template v-slot:prepend>
                  <v-icon></v-icon>
                </template>
                Logout
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
      <v-icon
        class="hidden-lg-and-up mt-3 ml-2"
        icon="mdi-menu"
        color="ourMaroon"
        @click="drawer = !drawer"
      >
      </v-icon>
    </v-row>
  </v-container>
  <v-navigation-drawer
    v-model="drawer"
    class="hidden-lg-and-up"
    app
    location="right"
    color="white"
  >
    <v-list>
      <v-list-item
        v-for="menu in activeMenus"
        :key="menu.text"
        exact
        @click="changeComp(menu.link)"
        :class="activeLink === menu.link ? 'text-ourBlue' : 'text-maroon'"
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
.menu-link {
  font-size: 15px;
}
.with-outline {
  border: 2px solid white;
}
.menu-button {
  justify-content: flex-start;
  text-align: left;
}
</style>
