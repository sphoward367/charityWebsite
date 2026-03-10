<template>
    <div>
      <FullCalendar :options="calendarOptions" />
      <div v-if="showModal" class="modal">
        <div class="modal-content">
          <span class="close" @click="closeModal">&times;</span>
          <h2>Book Appointment</h2>
          <form @submit.prevent="bookAppointment">
            <label for="title">Title:</label>
            <input type="text" v-model="newAppointment.title" required />
            <label for="date">Date:</label>
            <input type="date" v-model="newAppointment.date" required />
            <label for="time">Time:</label>
            <input type="time" v-model="newAppointment.time" required />
            <button type="submit">Book</button>
          </form>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import FullCalendar from '@fullcalendar/vue3';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useStore } from 'vuex';
import { ref, computed, watch, onMounted } from 'vue';

export default {
  components: {
    FullCalendar
  },
  setup() {
    const store = useStore();
    const user = computed(() => store.getters.getUser);
    const appointments = computed(() => store.getters.getAppointments);

    onMounted(() => {
      store.dispatch('fetchAppointments');
    });
    
    const showModal = ref(false);
    const newAppointment = ref({
      title: 'Appointment with ' + user.value.email,
      date: '',
      time: ''
    });

    const calendarOptions = ref({
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      dateClick: handleDateClick,
      events: []
    });

    watch(appointments, (newAppointments) => {
        // Clear existing events to avoid duplicates
        calendarOptions.value.events = [];

        // For each appointment, add an event for each bookedTimeSlot on the day
        newAppointments.forEach((appointment) => {
            appointment.bookedTimeSlots.forEach((timeSlot) => {
                calendarOptions.value.events.push({
                    title: appointment.title,
                    date: appointment.date + 'T' + timeSlot
                });
            });
        });
    }, { immediate: true });

    function handleDateClick(arg) {
      newAppointment.value.date = arg.dateStr;
      showModal.value = true;
    }

    function closeModal() {
      showModal.value = false;
    }

    async function bookAppointment() {
        if (!newAppointment.value.title || !newAppointment.value.date || !newAppointment.value.time) {
            alert('Please provide all details for the appointment.');
            return;
        }
        else {
            await store.dispatch('addAppointment', newAppointment.value);
            await store.dispatch('fetchAppointments');
            closeModal();
        } 
    }

    return {
      showModal,
      newAppointment,
      calendarOptions,
      handleDateClick,
      closeModal,
      bookAppointment
    };
  }
};
</script>
  
  <style>
  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: auto;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    animation: fadeIn 0.3s;
  }
  
  .close {
    color: #aaa;
    float: right;
    font-size: 24px;
    font-weight: bold;
    cursor: pointer;
  }
  
  .close:hover,
  .close:focus {
    color: #000;
    text-decoration: none;
  }
  
  h2 {
    margin-top: 0;
  }
  
  form {
    display: flex;
    flex-direction: column;
  }
  
  label {
    margin-top: 10px;
  }
  
  input[type="text"],input[type="time"],
  input[type="date"] {
    padding: 8px;
    margin-top: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    margin-top: 20px;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #45a049;
  }
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  </style>