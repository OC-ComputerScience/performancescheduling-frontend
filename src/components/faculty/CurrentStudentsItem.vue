<script setup>
  import { ref, onMounted } from "vue";
  import { useLoginStore } from "../../stores/LoginStore.js";
  import { storeToRefs } from "pinia";
  import UserDialogBody from "../admin/maintain/users/UserDialogBody.vue";
  import StudentInstrumentDataService from "../../services/StudentInstrumentDataService.js";


  const loginStore = useLoginStore();
  const { currentRole } = storeToRefs(loginStore);

  const dialog = ref(false);
  const userRole = ref({});

  const emits = defineEmits(["closeUserDialog", "refreshUsersEvent"]);

  const props = defineProps({
    studentsData: { type: [Object], required: true },
  });

  async function getStudentInstruments(){
    await StudentInstrumentDataService.getStudentInstrumentsForStudentId(
    props.studentsData.id
  )
    .then((response) => {
      userRole.value = response.data;
    })
    .catch((err) => {
      console.log(err);
    });
  }

  function closeUserDialog() {
    dialog.value = false;
  }

  onMounted(async () => {
  await getStudentInstruments();
});
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
        <div v-if="currentRole.role.role == 'Faculty'">
          <v-col cols="auto">

              <v-icon class="ma-3" icon="mdi-information" @click="dialog=true">
              </v-icon>

          </v-col>
        </div>
      </v-row>
    </v-card>
    <v-dialog
    v-model="dialog"
    persistent
    max-width="1200px"
    scrollable
  >
    <UserDialogBody
      :is-edit="true"
      :user-data="studentsData"
      :user-roles="studentsData.userRoles"
      @closeUserDialogEvent="closeUserDialog"
      @updateUserSuccessEvent="closeUserDialog(), emits('refreshUsersEvent')"
    ></UserDialogBody>
  </v-dialog>
  </template>
