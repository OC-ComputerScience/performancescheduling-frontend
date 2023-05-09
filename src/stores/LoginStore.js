import { defineStore } from "pinia";

export const useLoginStore = defineStore("login", {
  state: () => ({ user: "", currentRole: "" }),
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
      if (this.user.roles.length > 0) {
        let roles = {
          default: this.user.roles[0],
          additional: [],
        };

        if (this.user.roles.length > 1) {
          roles.additional = this.user.roles.slice(1, this.user.roles.length);
        }

        this.user.roles = roles;
      }
      this.currentRole = this.user.roles.default;

      console.log(this.user);
    },
    // Clear the user user info, logging them out
    clearLoginUser() {
      this.user = "";
    },
  },
});
