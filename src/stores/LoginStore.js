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
        currentRole.value = user.value.roles[0];
      }
    }

    return { user, currentRole, setUser };
  },
  { persist: true }
);
