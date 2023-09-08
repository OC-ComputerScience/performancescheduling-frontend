<!-- eslint-disable vue/no-use-v-if-with-v-for -->
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
    link: "studentPerformances",
    text: "Performances",
    roles: [1],
  },
  {
    link: "facultyHome",
    text: "Home",
    roles: [2],
  },
  {
    link: "facultyStudents",
    text: "Students",
    roles: [2],
  },
  {
    link: "adminHome",
    text: "Home",
    roles: [3],
  },
  {
    link: "accompanistHome",
    text: "Home",
    roles: [4],
  },
  {
    link: "accompanistStudents",
    text: "Students",
    roles: [4],
  },
];
const adminMenus = [
  {
    link: "adminUsers",
    text: "Users",
  },
  {
    link: "adminEvents",
    text: "Events",
  },
  {
    link: "adminEventTypes",
    text: "Event Types",
  },
  {
    link: "adminInstruments",
    text: "Instruments",
  },
  {
    link: "adminComposers",
    text: "Composers",
  },
  {
    link: "adminPieces",
    text: "Pieces",
  },
  {
    link: "adminEvaluations",
    text: "Evaluations",
  },
  {
    link: "adminMajors",
    text: "Majors",
  },
  {
    link: "adminLevels",
    text: "Levels",
  },
  {
    link: "adminSemesters",
    text: "Semesters",
  },
  {
    link: "adminLocations",
    text: "Locations",
  },
];
const userRoles = ref([]);
const { currentRole } = storeToRefs(loginStore);
const activeLink = ref("");
const roleColors = [
  {
    roleId: 1,
    backgroundColor: "lightMaroon",
    textColor: "maroon",
  },
  {
    roleId: 2,
    backgroundColor: "lightDarkBlue",
    textColor: "darkBlue",
  },
  {
    roleId: 3,
    backgroundColor: "lightOrange",
    textColor: "orange",
  },
  {
    roleId: 4,
    backgroundColor: "lightTeal",
    textColor: "teal",
  },
];
const roleColor = ref({});

function getUserRoles() {
  userRoles.value = loginStore.user.roles;
}
function goToHome() {
  if (loginStore.currentRole.roleId == 1) {
    router.push({ path: "studentHome" });
  } else if (loginStore.currentRole.roleId == 2) {
    router.push({ path: "facultyHome" });
  } else if (loginStore.currentRole.roleId == 3) {
    router.push({ path: "adminHome" });
  } else if (loginStore.currentRole.roleId == 4) {
    router.push({ path: "accompanistHome" });
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
    .then(() => {
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
  }, 1);
}
function changeRole(newRole) {
  loginStore.currentRole = userRoles.value.find((obj) => {
    return obj.roleId === newRole;
  });
}

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
  <v-container fluid class="pa-6 bg-white">
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
          :class="activeLink === menu.link ? 'text-blue' : 'text-maroon'"
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
        <v-toolbar-items v-if="loginStore.currentRole.roleId == 3">
          <v-menu bottom rounded offset-y open-on-hover>
            <template v-slot:activator="{ props }">
              <v-btn
                :class="'hidden-md-and-down mx-1 menu-link font-weight-bold text-maroon'"
                height="50"
                v-bind="props"
                x-large
                elevation="0"
              >
                Maintain
              </v-btn>
            </template>
            <v-card>
              <v-card-text
                class="mx-auto"
                v-for="menu in adminMenus"
                :key="menu.link"
              >
                <v-btn
                  :class="'mt-2 font-weight-bold'"
                  density="comfortable"
                  elevation="0"
                  @click="changeComp(menu.link)"
                >
                  {{ menu.text }}
                </v-btn>
                <br />
              </v-card-text>
            </v-card>
          </v-menu>
        </v-toolbar-items>
        <v-btn
          v-if="loginStore.currentRole.role === ''"
          variant="text"
          @click="logout()"
        >
          Log back in
        </v-btn>
      </div>
      <v-icon class="mt-3 mr-5" color="maroon" icon="mdi-bell"></v-icon>
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
            class="flatCardBorder text-none text-h7 font-weight-bold"
            :class="' text-' + roleColor.textColor"
            height="50"
            v-bind="props"
            x-large
            elevation="0"
          >
            {{ loginStore.currentRole.role.role }}
            <template v-slot:append>
              <v-avatar
                v-if="loginStore.user != null"
                color="secondary"
                class="with-outline"
              >
                <img
                  v-if="loginStore.user.picture"
                  :src="loginStore.user.picture"
                  referrerpolicy="no-referrer"
                />
                <span v-else class="accent--text font-weight-bold">{{
                  initials
                }}</span>
              </v-avatar>
            </template>
          </v-btn>
        </template>
        <v-card class="mainCardBorder rounded-te-0">
          <v-card-text>
            <div class="mx-auto">
              <h3>{{ name }}</h3>
              <p class="text-caption text-grey">
                {{ loginStore.user.email }}
              </p>
              <div
                v-if="
                  userRoles.findIndex((obj) => {
                    return obj.roleId == 1;
                  }) != -1 && loginStore.currentRole.roleId != 1
                "
              >
                <v-btn
                  color="lightMaroon"
                  :class="'mt-2 menu-button font-weight-bold text-maroon'"
                  density="comfortable"
                  elevation="0"
                  width="250px"
                  @click="changeRole(1)"
                >
                  Switch to Student View
                </v-btn>
                <br />
              </div>
              <div
                v-if="
                  userRoles.findIndex((obj) => {
                    return obj.roleId == 2;
                  }) != -1 && loginStore.currentRole.roleId != 2
                "
              >
                <v-btn
                  color="lightDarkBlue"
                  :class="'mt-2 menu-button font-weight-bold text-darkBlue'"
                  density="comfortable"
                  elevation="0"
                  width="250px"
                  @click="changeRole(2)"
                >
                  Switch to Faculty View
                </v-btn>
                <br />
              </div>
              <div
                v-if="
                  userRoles.findIndex((obj) => {
                    return obj.roleId == 3;
                  }) != -1 && loginStore.currentRole.roleId != 3
                "
              >
                <v-btn
                  color="lightOrange"
                  :class="'mt-2 menu-button font-weight-bold text-orange'"
                  density="comfortable"
                  elevation="0"
                  width="250px"
                  @click="changeRole(3)"
                >
                  Switch to Admin View
                </v-btn>
                <br />
              </div>
              <div
                v-if="
                  userRoles.findIndex((obj) => {
                    return obj.roleId == 4;
                  }) != -1 && loginStore.currentRole.roleId != 4
                "
              >
                <v-btn
                  color="lightTeal"
                  :class="'mt-2 menu-button font-weight-bold text-teal'"
                  density="comfortable"
                  elevation="0"
                  width="250px"
                  @click="changeRole(4)"
                >
                  Switch to Accompanist View
                </v-btn>
                <br />
              </div>
              <v-btn
                prepend-icon="mdi-cog"
                color="lightBlue"
                :class="'mt-2 menu-button font-weight-bold text-blue'"
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
                color="mediumGray"
                :class="'mt-2 menu-button font-weight-bold text-lightGray'"
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
        color="maroon"
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
        :class="activeLink === menu.link ? 'text-blue' : 'text-maroon'"
      >
        <v-list-item-title>{{ menu.text }} </v-list-item-title>
      </v-list-item>
      <v-list-item
        v-if="loginStore.currentRole.roleId == 3"
        v-for="menu in adminMenus"
        :key="menu.text"
        exact
        @click="changeComp(menu.link)"
        :class="activeLink === menu.link ? 'text-blue' : 'text-maroon'"
      >
        <v-list-item-title>{{ menu.text }} </v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style scoped>
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
  font-size: 12px;
}
</style>
