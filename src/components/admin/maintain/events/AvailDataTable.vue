<script setup>
const props = defineProps({
  dataTableData: { type: [Object], required: true },
});
</script>

<template>
  <v-table>
    <thead>
      <tr>
        <th class="text-left">Time slot</th>
        <th>|</th>
        <th class="text-left">Faculty</th>
        <th>|</th>
        <th class="text-left">Accompanist</th>
        <th>|</th>
        <th class="text-left">Student</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="data in props.dataTableData">
        <td>
          {{ data.time.timeText }}
        </td>
        <td>|</td>
        <td>
          <div v-for="faculty in data.faculty">
            {{ faculty.firstName + " " + faculty.lastName }}
          </div>
        </td>
        <td>|</td>
        <td>
          <div v-for="accompanist in data.accompanist">
            {{ accompanist.firstName + " " + accompanist.lastName }}
          </div>
        </td>
        <td>|</td>
        <td>
          <div v-for="student in data.student">
            {{ student.firstName + " " + student.lastName }}
          </div>
        </td>
      </tr>
    </tbody>
  </v-table>
</template>
