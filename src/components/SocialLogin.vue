<script setup>
import AuthServices from "../services/authServices.js";
import { useLoginStore } from "../stores/LoginStore.js";
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const loginStore = useLoginStore();

onMounted(() => {
  loginWithGoogle();
});

async function loginWithGoogle() {
  window.handleCredentialResponse = handleCredentialResponse;
  const client = import.meta.env.VITE_APP_CLIENT_ID;
  console.log(client);
  window.google.accounts.id.initialize({
    client_id: client,
    cancel_on_tap_outside: false,
    auto_select: true,
    callback: window.handleCredentialResponse,
  });
  window.google.accounts.id.renderButton(document.getElementById("parent_id"), {
    type: "standard",
    theme: "outline",
    size: "large",
    text: "signup_with",
    width: 250,
  });
}

async function handleCredentialResponse(response) {
  let token = {
    credential: response.credential,
  };
  await AuthServices.loginUser(token)
    .then((response) => {
      loginStore.setUser(response.data);

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
    })
    .catch((error) => {
      console.log("error", error);
    });
}
</script>

<template>
  <div class="signup-buttons">
    <v-row justify="center">
      <div display="flex" id="parent_id"></div>
    </v-row>
  </div>
</template>
