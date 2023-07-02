<script setup>
import { ref, onMounted, computed } from "vue";
import EventDataService from "../../../../services/EventDataService.js";
import EventDialogBody from "./EventDialogBody.vue";
import MaintainEventCard from "./MaintainEventCard.vue";

const addEventDialog = ref(false);

// event data
const events = ref([]);
const filteredEvents = ref([]);

async function getEvents() {
  await EventDataService.getAll("date")
    .then((response) => {
      events.value = response.data;
      filteredEvents.value = events.value;
    })
    .catch((err) => {
      console.log(err);
    });
}

async function refreshEvents() {
  await getEvents();
}

const searchInput = ref("");

// Search filter
function searchFilteredList() {
  filteredEvents.value = events.value;

  // If the search input is empty, return the full list, otherwise filter
  if (searchInput.value === "") return;

  filteredEvents.value = filteredEvents.value.filter((event) =>
    event.name.toLowerCase().includes(searchInput.value.toLowerCase())
  );
}

// Pagination
const currentPage = ref(1);
const perPage = 15;

const currentPageData = computed(() => {
  return filteredEvents.value.slice(
    (currentPage.value - 1) * perPage,
    currentPage.value * perPage
  );
});

onMounted(async () => {
  await getEvents();
});
</script>

<template>
  <v-container fluid class="pa-8">
    <v-row class="ml-1">
      <h1 class="text-maroon font-weight">Events</h1>

      <input
        type="text"
        v-model="searchInput"
        @input="searchFilteredList"
        class="ml-6 px-4 my-1 mainCardBorder text-blue bg-white font-weight-semi-bold"
        style="outline: none"
        append-icon="mdi-magnify"
        placeholder="Search"
        single-line
        hide-details
      />

      <v-btn
        size="medium"
        color="blue"
        class="font-weight-semi-bold ml-6 px-2 my-1 mainCardBorder text-none"
        @click="addEventDialog = true"
      >
        Add new Event
      </v-btn>
    </v-row>
    <v-row>
      <v-col>
        <v-card class="pa-5 mainCardBorder">
          <v-row>
            <v-col
              v-for="event in currentPageData"
              :key="event.id"
              cols="12"
              md="6"
              lg="4"
            >
              <MaintainEventCard
                :event-data="event"
                @refreshEventsEvent="refreshEvents()"
              ></MaintainEventCard>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
    <v-row class="pt-3">
      <v-col>
        <v-card class="mainCardBorder">
          <v-pagination
            color="blue"
            class="font-weight-bold"
            :length="
              filteredEvents.length % perPage == 0
                ? filteredEvents.length / perPage
                : Math.floor(filteredEvents.length / perPage) + 1
            "
            :total-visible="7"
            v-model="currentPage"
          ></v-pagination>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
  <v-dialog v-model="addEventDialog" persistent max-width="600px">
    <EventDialogBody
      :is-edit="false"
      :event-data="{
        id: null,
        name: null,
        date: null,
        startTime: null,
        endTime: null,
        isReady: false,
        eventTypeId: null,
        semesterId: null,
        locationId: null,
      }"
      @closeAddEventDialogEvent="addEventDialog = false"
      @addEventSuccessEvent="(addEventDialog = false), refreshEvents()"
    ></EventDialogBody>
  </v-dialog>
</template>
