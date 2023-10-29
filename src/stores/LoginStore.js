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

    function setRoles(roles) {
      user.value.roles = roles;
      var id = currentRole.value.id
      user.value.roles.forEach((r) => {
        if(id == r.id){
          currentRole.value = r
        }})
    }
    return { user, currentRole, setUser, setRoles };
  },
  { persist: true }
);
