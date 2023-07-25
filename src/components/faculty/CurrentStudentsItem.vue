<script setup>
  import { ref } from "vue";
  import StudentDialogBody from "./StudentDialogBody.vue";

  const dialog = ref(false);

  const props = defineProps({
    studentsData: { type: [Object], required: true },
  });
  console.log("students current", props.studentsData)
</script>

  <template>
    <v-card flat class="flatCardBorder bg-lightDarkBlue mt-4">
      <v-row>
        <v-col cols="auto">
          <v-card-title class="font-weight-semi-bold text-darkBlue">
            {{ studentsData.firstName }} {{ studentsData.lastName }}
          </v-card-title>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="auto">

            <v-icon class="ma-3" icon="mdi-information" @click="dialog=true">
            </v-icon>

        </v-col>
      </v-row>
    </v-card>
    <v-dialog
    v-model="dialog"
    persistent
    max-width="1200px"
    scrollable
  >
    <StudentDialogBody
      :is-edit="true"
      :user-data="userData"
      :user-roles="props.userRoles"
      @closeUserDialogEvent="closeUserDialog"
      @updateUserSuccessEvent="closeUserDialog(), emits('refreshUsersEvent')"
      @disableUserEvent="closeUserDialog(), disableUser(userData)"
      @enableUserEvent="closeUserDialog(), enableUser(userData)"
    ></StudentDialogBody>
  </v-dialog>
  </template>
