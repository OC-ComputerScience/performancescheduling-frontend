<script setup>
import { ref, onMounted } from "vue";
import RoleDataService from "./../../services/RoleDataService";
import UserInstrumentCard from "./UserInstrumentCard.vue";
import UserDataService from "./../../services/UserDataService";
import UserRoleDataService from "./../../services/UserRoleDataService";

const emits = defineEmits(["updateUserSuccessEvent", "closeUserDialogEvent"]);

const props = defineProps({
  userData: { type: [Object], required: true },
  userRoles: { type: [Array], required: true },
  isEdit: { type: [Boolean], required: true },
});

const editedUserData = ref(props.userData);
// const editedUserRoles = ref(props.userRoles);

const editedUserRoles = ref(
  props.userRoles
    .filter((ur) => ur.status === "Active")
    .map((ur) => {
      ur = ur.role;
      return ur;
    })
);

const roleOptions = ref([]);

async function getAllRoles() {
  await RoleDataService.getAll()
    .then((response) => {
      roleOptions.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

// Update the user's roles, then update the user's data
async function updateUser() {
  await updateUserRoles();

  delete editedUserData.value["createdAt"];
  delete editedUserData.value["updatedAt"];

  await UserDataService.update(editedUserData.value)
    .then(() => {
      emits("updateUserSuccessEvent");
    })
    .catch((err) => {
      console.log(err);
    });
}

// For each role in userRoles, check if it exists in editedUserRoles
// If it does and is Disabled, enable it and splice it from editedUserRoles.
// If it does and is Active, do nothing and splice it from editedUserRoles.
// If it does not, disable it.
// After all roles have been checked, whatever is left in editedUserRoles is a new role,
// so create it.
async function updateUserRoles() {
  for (let userRole of props.userRoles) {
    // If role exists in editedUserRoles, and is active, we don't need to do anything,
    // and it gets spliced out of editedUserRoles at the end of the if statement.

    // If role exists in editedUserRoles, and is disabled, enable it
    if (editedUserRoles.value.some((eur) => eur.id === userRole.roleId)) {
      userRole.status === "Disabled"
        ? await UserRoleDataService.enable(userRole.id).catch((err) => {
            console.log(err);
          })
        : null;
    } else {
      // Role does not exist in editedUserRoles, so delete from database
      await UserRoleDataService.disable(userRole.id)
        .then(() => {})
        .catch((err) => {
          console.log(err);
        });
    }

    // Find index of role to splice in editedUserRoles
    let index = editedUserRoles.value.findIndex(
      (eur) => eur.id === userRole.roleId
    );
    // Splice role from editedUserRoles
    index != -1 ? editedUserRoles.value.splice(index, 1) : null;
  }

  // Whatever is left in editedUserRoles is a new role, so create it
  for (let editedUserRole of editedUserRoles.value) {
    await UserRoleDataService.create(
      props.userData.id,
      editedUserRole.id
    ).catch((err) => {
      console.log(err);
    });
  }
}

onMounted(async () => {
  await getAllRoles();
});
</script>

<template>
  <v-card class="pa-2 flatCardBorder">
    <v-card-title>
      <v-row class="pt-0 mt-0">
        <v-col
          cols="auto"
          class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
        >
          {{ props.isEdit ? "Edit" : "Add" }} User
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto" class="pt-0 mt-0 pr-2">
          <v-chip
            label
            flat
            size="small"
            class="font-weight-bold mt-0 text-none text-white flatChipBorder"
            :class="userData.status === 'Active' ? 'bg-teal' : 'bg-maroon'"
          >
            {{ userData.status === "Active" ? "Active" : "Disabled" }}
          </v-chip>
        </v-col>
      </v-row>
    </v-card-title>
    <v-card-text class="pt-0">
      <v-row class="pt-0 mt-0">
        <v-col cols="1">
          <v-avatar size="55" color="darkBlue">
            <v-img referrerpolicy="no-referrer" :src="userData.picture" />
          </v-avatar>
        </v-col>
        <v-col cols="auto" class="pl-6" align-self="center">
          <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
            {{ userData.firstName }}
            {{ userData.lastName }}
          </v-card-title>
          <v-card-subtitle class="text-weight-semi-bold mt-0 py-0">
            <a v-bind:href="'mailto:' + userData.email" class="text-blue">
              {{ userData.email }}</a
            >
          </v-card-subtitle>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Phone Number
          </v-card-subtitle>
          <v-text-field
            placeholder="405-555-5555"
            v-model="editedUserData.phoneNumber"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
          ></v-text-field>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Roles
          </v-card-subtitle>
          <v-select
            color="darkBlue"
            variant="plain"
            class="font-weight-bold text-blue pt-0 mt-0 bg-lightGray flatCardBorder pl-4 pr-2 py-0 my-0 mb-4"
            v-model="editedUserRoles"
            :items="roleOptions"
            :item-title="(item) => item.role"
            item-value="id"
            multiple
            return-object
          >
            <template v-slot:selection="{ item }">
              <v-chip
                label
                flat
                size="small"
                class="font-weight-bold text-none text-white flatChipBorder bg-blue"
              >
                {{ item.title }}
              </v-chip>
            </template>
          </v-select>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Instruments
          </v-card-subtitle>
          <v-card class="bg-lightGray pa-4 pb-0 flatCardBorder">
            <UserInstrumentCard
              v-for="studentInstrument of userRoles.filter(
                (r) => r.roleId === 1
              )[0].studentRole"
              :key="studentInstrument.id"
              :student-instrument-data="studentInstrument"
            ></UserInstrumentCard>
          </v-card>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
        @click="updateUser"
      >
        Save
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-blue flatChipBorder"
        @click="emits('closeUserDialogEvent')"
      >
        Cancel
      </v-btn>
      <v-btn
        flat
        class="font-weight-semi-bold mt-0 ml-4 mr-auto text-none text-white bg-maroon flatChipBorder"
      >
        Disable
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<style scoped>
* {
  font-family: Poppins, sans-serif !important;
}
</style>
