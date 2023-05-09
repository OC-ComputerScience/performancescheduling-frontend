import { defineStore } from "pinia";
import { ref } from "vue";

export const useLoginStore = defineStore(
  "login",
  () => {
    const user = ref({});
    const currentRole = ref({});

    function setUser(newUser) {
      user.value = newUser;
      if (user.value.roles.length > 0) {
        let roles = {
          default: user.value.roles[0],
          additional: [],
        };

        if (user.value.roles.length > 1) {
          roles.additional = user.value.roles.slice(1, user.value.roles.length);
        }

        user.value.roles = roles;
      }
      currentRole.value = user.value.roles.default;

      console.log("user", user);
    }

    function clearLoginUser() {
      user.value = {};
    }

    return { user, currentRole, setUser, clearLoginUser };
  },
  { persist: true }
);
