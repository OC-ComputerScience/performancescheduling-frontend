<template>
  <v-app-bar color="maroon" prominent class="elevation-0">
    <template v-slot:prepend>
      <!-- OC logo image -->
      <v-btn icon plain @click="goToHome">
        <v-img
          class="mx-2"
          :src="logoURL"
          height="50"
          width="50"
          contain
          transition="scale-transition"
        ></v-img>
      </v-btn>
    </template>
    <!-- OC Music Dept title in top bar -->
    <v-toolbar-title class="title">
      {{ this.title }}
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

    <v-menu bottom min-width="250px" rounded offset-y v-if="user != null">
      <template v-slot:activator="{ props }">
        <v-btn v-bind="props" icon x-large>
          <v-avatar v-if="user != null" color="secondary">
            <v-img v-if="user.picture" :src="user.picture"></v-img>
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
              <v-img v-if="user.picture" :src="user.picture"></v-img>
              <span v-else class="accent--text font-weight-bold">{{
                initials
              }}</span>
            </v-avatar>
            <h3>{{ name }}</h3>
            <p class="text-caption mt-1">
              {{ user.email }}
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
<script>
import ocLogo from "../../public/oc_logo_social.png";
import AuthServices from "../services/authServices.js";
import { mapStores } from "pinia";
import { useLoginStore } from "../stores/LoginStore.js";
export default {
  name: "MainNav",
  components: {
    ocLogo,
  },
  data: () => ({
    user: {},
    drawer: false,
    title: "OC Music Department",
    initials: "",
    name: "",
    logoURL: null,
    activeMenus: [],
    menus: [
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
        roles: [2, 5],
      },
      {
        link: "adminViewUsers",
        text: "Users",
        roles: [4],
      },
      {
        link: "adminViewEvents",
        text: "Events",
        roles: [4],
      },
    ],
    userRoles: [],
  }),
  async created() {
    this.logoURL = ocLogo;
    this.resetMenu();
  },
  async mounted() {
    await this.getUserRoles();
    this.resetMenu();
  },
  computed: {
    ...mapStores(useLoginStore),
  },
  methods: {
    async getUserRoles() {
      this.user = this.loginStore.user;
      this.userRoles = [];
      this.userRoles.push(this.loginStore.user.roles.default);
      this.userRoles = this.userRoles.concat(
        this.loginStore.user.roles.additional
      );
    },
    goToHome() {
      if (this.loginStore.currentRole.role === "Faculty") {
        this.$router.push({ path: "facultyHome" });
      } else if (this.loginStore.currentRole.role == "Student") {
        this.$router.push({ path: "studentHome" });
      } else if (this.loginStore.currentRole.role == "Admin") {
        this.$router.push({ path: "adminHome" });
      } else if (this.loginStore.currentRole.role == "Accompanist") {
        this.$router.push({ path: "createAvailability" });
      } else {
        this.$router.push({ path: "base" });
      }
    },
    resetMenu() {
      this.user = null;
      // ensures that their name gets set properly from store
      this.user = this.loginStore.user;
      if (this.user != null) {
        this.initials = this.user.firstName[0] + this.user.lastName[0];
        this.name = this.user.firstName + " " + this.user.lastName;

        if (this.loginStore.currentRole.role !== "") {
          this.activeMenus = this.menus.filter((menu) =>
            menu.roles.includes(this.loginStore.currentRole.roleId)
          );
        }
      }
    },
    logout() {
      AuthServices.logoutUser(this.user)
        .then((response) => {
          console.log(response);
          this.loginStore.clearLoginUser();
          this.$router.push({ name: "loginPage" });
          location.reload();
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    changeComp(route) {
      this.$router.push({ path: route });
    },
  },
  watch: {
    "loginStore.currentRole": function () {
      console.log(this.loginStore.currentRole);
      this.resetMenu();
      this.goToHome();
    },
  },
};
</script>
<style>
.text-center {
  text-align: center;
}
</style>
