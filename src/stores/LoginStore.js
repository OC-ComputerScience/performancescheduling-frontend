import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", {
  state: () => ({ user: "", userRole: "" }),
  persist: true,
  getters: {
    getFullName(state) {
      return state.user.fName + " " + state.user.lName;
    },
    getPicture(state) {
      return state.user.picture;
    },
    getUserName: (state) => state.user.email.split("@")[0],
  },
  actions: {
    // Set the user user, and load their specific role info
    setUser(user) {
      this.user = user;
      this.userRole = user.lastRole;
    },
    setUserRole(role) {
      this.userRole = role;
    },
    // Clear the user user info, logging them out
    clearLoginUser() {
      this.user = "";
      this.userRole = "";
    },
  },
});
