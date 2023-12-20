<script setup>
import { ref, onMounted } from "vue";
import SemesterDataService from "../../../../services/SemesterDataService";
import StudentInstrumentDataService from "../../../../services/StudentInstrumentDataService";
import UserDataService from "../../../../services/UserDataService";
import { formatDate } from "../../../../composables/dateFormatter";

const emits = defineEmits([
  "addSemesterSuccessEvent",
  "closeAddSemesterDialogEvent",
  "closeSemesterDialogEvent",
  "updateSemesterSuccessEvent",
  "disableSemesterEvent",
  "enableSemesterEvent",
]);

const props = defineProps({
  semesterData: { type: [Object], required: true },
  isEdit: { type: [Boolean], required: true },
});
const form = ref(null);
const editedSemesterData = ref(Object.assign({}, props.semesterData));
const yesDisableStudents = ref(true);
const users = ref([]);

onMounted(() => {
  if (props.isEdit) {
    editedSemesterData.value["id"] = props.semesterData.id;
    editedSemesterData.value.startDate = formatDate(
      editedSemesterData.value.startDate
    );
    editedSemesterData.value.endDate = formatDate(
      editedSemesterData.value.endDate
    );
  } else {
    editedSemesterData.value["status"] = "Active";
  }
});

async function addSemester() {
  form.value.validate().then(async (valid) => {
    editedSemesterData.value.name = editedSemesterData.value.name.toUpperCase();
    if (valid.valid) {
      await SemesterDataService.create(editedSemesterData.value)
        .then(async () => {
          emits("addSemesterSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    if(yesDisableStudents.value){
      disableAllStudents();
    }

    }
  });
}

async function updateSemester() {
  await form.value.validate().then(async (valid) => {
    if (valid.valid) {
      editedSemesterData.value.name =
        editedSemesterData.value.name.toUpperCase();

      await SemesterDataService.update(editedSemesterData.value)
        .then(() => {
          emits("updateSemesterSuccessEvent");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  });
}

function semesterNameCheck() {
  const pattern = /[0-9]{4}-[a-z|A-Z]{2}/;
  return pattern.test(editedSemesterData.value.name)
    ? true
    : "Semester name must be in the format of YYYY-SS.";
}
function startDateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedSemesterData.value.startDate)
    ? true
    : "Date  must be in the format of MM/DD/YYYY.";
}
function endDateCheck() {
  const pattern = new RegExp("[0-3]?[0-9]/[0-3]?[0-9]/(?:[0-9]{2})?[0-9]{2}$");
  return pattern.test(editedSemesterData.value.endDate)
    ? true
    : "Date must be in the format of MM/DD/YYYY.";
}

async function disableAllStudents(){
  await UserDataService.getAllWithRolesAndStudentInstruments("lastName", "ASC")
    .then((response) => {
      users.value = response.data;

      users.value = users.value.filter((user) => {
        return user.userRoles.some((role) => {
          return role.role.role === "Student";
        });
      });

      console.log('before', users.value)

      users.value.forEach((user) => {
        user.studentRole = user.userRoles.find(
          (role) => role.role.role === "Student"
        ).studentRole;
        UserDataService.update({id: user.id, status: "Disabled"})
          .catch((err) => {
            console.log(err);
          });

        // StudentInstrumentDataService.update({studentRoleId: user.roleId, status: "Active"})
        //   .catch((err) => {
        //     console.log(err);
        //   });

        // user.userRoles.find(
        //   (role) => role.role.role === "Student")
        //   .studentRole.forEach((student) => 
        //   StudentInstrumentDataService.update({id: student.id, status: "Disabled"})
        //   .catch((err) => {
        //     console.log(err);
        //   })
        // );
      });

      console.log('after', users.value)

      users.value.forEach((user) => {
        user.studentRole.forEach((student) => {
          console.log('student', student)
          console.log('id', student.id)
          StudentInstrumentDataService.update({id: student.id, status: "Disabled"})
          .catch((err) => {
            console.log(err);
          });
        })
        });
      
      // users.value = users.value.filter((user) => {
      //   return user.userRoles.find(
      //    (role) => role.role.role === "Student")
      // });
    })
    .catch((err) => {
      console.log(err);
    });
}
</script>

<template>
  <v-form ref="form" validate-on="input">
    <v-card class="pa-2 flatCardBorder">
      <v-card-title>
        <v-row class="pt-0 mt-0">
          <v-col
            cols="auto"
            class="pt-0 mt-0 text-maroon font-weight-bold text-h4"
          >
            {{ props.isEdit ? "Edit" : "Add" }} Semester
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-text class="pt-0">
        <v-row v-if="props.isEdit" class="pt-0 mt-0">
          <v-col cols="auto" class="pl-6" align-self="center">
            <v-card-title class="font-weight-bold text-darkBlue py-0 my-0">
              {{ semesterData.name }}
            </v-card-title>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions :class="props.isEdit ? '' : 'mt-2'">
        <v-card-text>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Semester Name
          </v-card-subtitle>

          <v-text-field
            placeholder="2000-FA"
            v-model="editedSemesterData.name"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedSemesterData.name || 'This field is required',
              semesterNameCheck,
            ]"
          ></v-text-field>

          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            Start Date
          </v-card-subtitle>
          <v-text-field
            placeholder="MM/DD/YYYY"
            v-model="editedSemesterData.startDate"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedSemesterData.startDate || 'This field is required',
              startDateCheck,
            ]"
          ></v-text-field>
          <v-card-subtitle
            class="pl-0 pb-2 font-weight-semi-bold text-darkBlue"
          >
            End Date
          </v-card-subtitle>
          <v-text-field
            placeholder="MM/DD/YYYY"
            v-model="editedSemesterData.endDate"
            variant="plain"
            class="bg-lightGray text-blue font-weight-bold flatCardBorder pl-4 py-0 my-0 mb-4"
            :rules="[
              () => !!editedSemesterData.endDate || 'This field is required',
              endDateCheck,
            ]"
          ></v-text-field>
          <v-checkbox
            v-if="!props.isEdit"
            v-model="yesDisableStudents"
            label="Disable all students"
            class="font-weight-semi-bold text-darkBlue"
          >
          </v-checkbox>
        </v-card-text>
      </v-card-actions>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-auto text-none text-white bg-teal flatChipBorder"
          @click="props.isEdit ? updateSemester() : addSemester()"
        >
          {{ props.isEdit ? "Save" : "Add" }}
        </v-btn>
        <v-btn
          flat
          class="font-weight-semi-bold mt-0 ml-4 text-none text-white bg-red flatChipBorder"
          :class="props.isEdit ? '' : 'mr-auto'"
          @click="
            props.isEdit
              ? emits('closeSemesterDialogEvent')
              : emits('closeAddSemesterDialogEvent')
          "
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<style scoped></style>
