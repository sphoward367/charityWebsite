<template>
     <div class="container-fluid">
         <div class="row" id="about-content">
             <!-- Sidebar for easy navigation to parts of the page (not functional yet) -->
             <div class="col-12 col-md-2" id="sideBar">
                <Button class="sideBarButton" id="toOurMission">Latest News & Events </Button>
                <Button class="sideBarButton" id="toHowWeHelp"> Contact Us </Button>
                <Button class="sideBarButton" id="toGetInvolved"> Stay Connected </Button>
                <Button class="sideBarButton" id="toTestimonials"> Our Team </Button>
             </div>
 
             <!-- Page Content -->
             <div class="col-12 col-md-10">
                 <!-- Latest News & Events -->
                 <div class="row content-section mb-4">
                     <div class="col-12">
                         <h3 class="sub-heading">Latest News & Events</h3>
                         <p>
                             Upcoming Webinar: Managing Anxiety in a Busy World <br>
                             Date: September 15, 2024 | Time: 7:00 PM AEST <br>
                             Join us for an interactive session with mental health experts. <br><br>
                             Annual Fundraising Walk <br>
                             Date: October 12, 2024 | Location: Melbourne, VIC <br>
                             Lace up your sneakers and help us raise funds to support mental health initiatives.
                         </p>
                         <hr>
                     </div>
                 </div>
 
                 <!-- Contact Us -->
                 <div class="row content-section mb-4">
                     <div class="col-12">
                         <h3 class="sub-heading">Contact Us or Book an Appointment</h3>
                         <p>
                             If you need immediate support, please call the number at the top of the site. <br><br>
                             If you want to contact the charity or have any questions, don't hesitate to book a phone appointment. Details will be sent once appointment is booked. We're here for you. <br><br>
                             If you need to contact support email us at: support@WellbeingMatters.org.au
                             <br><br><br><br>
                        </p>
                        <h3>Book an Appointment</h3>
                        <p> Appointments last for an hour and held over the phone </p>
                        <appointmentForm></appointmentForm>
                         
                        <hr>
                     </div>
                 </div>
 
                 <!-- Stay Connected -->
                 <div class="row content-section mb-4">
                     <div class="col-12">
                         <h3 class="sub-heading">Stay Connected</h3>
                         <p>
                             Follow us on social media for the latest updates, tips, and community stories. <br><br>
                             Facebook: WellbeingMatters   Instagram: @WellbeingMatters
                         </p>
                         <hr>
                     </div>
                 </div>
             </div>
         </div>
     </div>
 </template>
 
 <script setup>
 import appointmentForm from '../components/appointmentForm.vue';
 </script>
 
 <style>

.sideBarButton {
    justify-self: left;
    background-color: white;
    color: var(--light-blue-primary);
    border-style: hidden;
    padding: 20px;
    width: 100%;
}
 #about-content {
     padding: 10px;
     margin-top: 20px;
 }
 
 .sub-heading {
     font-size: 1.5rem;
     margin-bottom: 15px;
 }
 
 @media (max-width: 768px) {
     .sub-heading {
         font-size: 1.25rem;
     }
 }
 </style>