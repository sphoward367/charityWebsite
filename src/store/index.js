import { createStore } from 'vuex';
import { createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc, collection, query, where, getDocs} from "firebase/firestore";
import firebase from '../firebase/index.js'; 

 const { auth , db } = firebase; 

//store functionality for saving and accessing data from local storage
export default createStore({
  //setting store states
  state: {
    user: {
      uid: null,
      isAdmin: false,
      email: null,
    },
    resources: [],
    allUsers: [],
    supportGroups: [],
    appointments: [],  
    /* 
    Appointments saved as an array of objects with the following structure:
    appointment:{
      title: String,
      date: Date,
      bookedTimeSlots: [timeslot1, timeslot2, ...],
    }
    */
  },
  //saving data to local storage for each store function 
  mutations: {
    registerUser(state) {
      console.log("Firebase Register Successful!");
    },
    //sets the current user aswell as authenication status 
    login(state, {uid, email, isAdmin} ) {
      state.user.uid = uid;
      state.user.isAdmin = isAdmin;
      state.user.email = email;
    },
    logout(state) {
      state.user.uid = null;
      state.user.isAdmin = false;
      state.user.email = null;
    },
    addResource(state, newResource) {
        state.resources.push(newResource); // Add new resource to local state
    },
    updateResource(state, updatedResource) {
      const index = state.resources.findIndex(resource => resource.name === updatedResource.name);
      if (index !== -1) {
        state.resources[index] = updatedResource; // Update resource in local state
      }
    },
    setResources(state, resources) {
      state.resources = resources; // Set resources fetched from Firestore
    },
    fetchAllUsers(state, allUsers){
      state.allUsers = allUsers;
    },
    updateUsers(state, updatedUser) {
      const index = state.allUsers.findIndex(user => user.userId === updatedUser.userId);
      if (index !== -1) {
        state.allUsers[index] = updatedUser; // Update user in local state
      }
    },
    addSupportGroup(state, newSupportGroup) {
      state.supportGroups.push(newSupportGroup); // Add new support group to local state
    },
    fetchSupportGroups(state, supportGroups) {
      state.supportGroups = supportGroups; // Set support groups fetched from Firestore
    },
    addAppointment(state, newAppointment) {
      state.appointments.push(newAppointment); // Add new appointment to local state
    },
    updateAppointment(state, updatedAppointment) {
      const index = state.appointments.findIndex(appointment => appointment.date === updatedAppointment.date);
      if (index !== -1) {
        state.appointments[index] = updatedAppointment; // Update appointment in local state
      }   
    },
    fetchAppointments(state, appointments) {
      state.appointments = appointments; // Set appointments fetched from Firestore
    }
  },
  //functions to add or update data to store and local storage, called from page functions 
  actions: {
    //input: user being added
    //checks the users username doesnt exist as this is the users identifier
    //then modifies the store of users and proceeds to add user mutation to save to local storage
    async registerUser({ state, commit }, newUser) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, newUser.email, newUser.password);
        const user = userCredential.user;
  
        await setDoc(doc(db, "users", user.uid), {
          email: user.email,
          isAdmin: newUser.isAdmin,
          createdAt: new Date()
        });

        commit('registerUser')
        return true;
      } catch (error) {
        return false;
      }
    
    },
    //input: resource being added
    //checks the resource name doesnt exist as this is the unique identifier
    //then modifies the store of resources with the new resource and proceeds to the mutation to save to local storage
     // Add resource to Firestore
    async addResource({ state, commit }, newResource) {
      try {
        // Check if resource exists in Firestore
        const q = query(collection(db, "resources"), where("name", "==", newResource.name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return false; // Resource already exists
        } else {
          // Add new resource to Firestore
          const resourceRef = doc(collection(db, "resources"));
          await setDoc(resourceRef, {
            name: newResource.name,
            link: newResource.link,
            category: newResource.category,
            rating: [newResource.averageRating],
            averageRating: newResource.averageRating
          });

          // Commit to local state
          commit('addResource', newResource);
          return true;
        }
      } catch (error) {
        console.error("Error adding resource:", error);
        return false;
      }
    },

    // Update resource in Firestore
    async updateResource({ commit }, { resourceId, newResource }) {
      try {
          console.log(resourceId);
          console.log(newResource);
          const resourceRef = doc(db, "resources", resourceId);
          await updateDoc(resourceRef, newResource);
          commit('updateResource', {...newResource, resourceId});
          return true;
      } catch (error) {
          console.error('Error updating resource in Firestore:', error);
          return false;
      }
    },
  
    // Fetch resources from Firestore
    async fetchResources({ commit }) {
      try {
        const resources = [];
        const querySnapshot = await getDocs(collection(db, "resources"));
        querySnapshot.forEach(doc => {
          const resourceData = doc.data();
          const resourceId = doc.id; // Get the document's ID
          resources.push({
            ...resourceData, 
            resourceId     // Add the document ID
          });
        });
        commit('setResources', resources);
      } catch (error) {
        console.error("Error fetching resources:", error);
      }
    },

    //input: user login detials 
    //checks the inputted username and password matches a user in the store
    //then proceeds to the mutation to save to local storage and set authenication and current user statuses
    async login({ state, commit }, { email, password }) {
      try{ 
        const { user } = await signInWithEmailAndPassword(auth, email, password);
        console.log("Firebase Sign In Successful!");
        const userDoc = await getDoc(doc(db, "users", user.uid))

        if (!userDoc.exists) {
          console.error("No user exists with that email!");
          return false;
        }
       
        const userData = userDoc.data();
        commit('login', { uid: user.uid, email: userData.email, isAdmin: userData.isAdmin})
      
        return true

      } catch (error){
         console.error('Login error:', error);
        return false
      }
  
    },
    // calls logout mutation to set the local storage statuses
    async logout({ commit }) {
      try {
        await signOut(auth);
        console.log("User logged out");
        commit('logout');
        return true
      }catch (error) {
        console.log(error.code);
        return false
      }
    },

    // Fetch resources from Firestore
    async fetchAllUsers({ commit }) {
      try {
        const allUsers = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          const userId = doc.id; // Get the document's ID
          allUsers.push({
            ...userData, 
            userId     // Add the document ID
          });
        });
        commit('fetchAllUsers', allUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    },

    // Update resource in Firestore
    async updateUsers({ commit }, { updatedUser }) {
      try {
          const { userId, ...userData } = updatedUser;
          const userRef = doc(db, "users", userId);
          await updateDoc(userRef, userData);
          commit('updateUsers', updatedUser);
          return true;
      } catch (error) {
          console.error('Error updating user in Firestore:', error);
          return false;
      }
    },

    async fetchUserRegistrations({ commit }) {
      try {
        const users = [];
        const querySnapshot = await getDocs(collection(db, "users"));
        
        querySnapshot.forEach(doc => {
          const userData = doc.data();
          if (userData.createdAt) {
            users.push({ createdAt: userData.createdAt.toDate() });
          }
        });
        return users;
      } catch (error) {
        console.error("Error fetching user registrations:", error);
        return [];
      }
    },

    async addSupportGroup({ state, commit }, newSupportGroup) {
      try {
        // Check if support group exists in Firestore
        const q = query(collection(db, "supportGroups"), where("name", "==", newSupportGroup.name));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          return false; // Support group already exists
        } else {
          // Add new support group to Firestore
          const supportGroupRef = doc(collection(db, "supportGroups"));
          await setDoc(supportGroupRef, {
            name: newSupportGroup.name,
            description: newSupportGroup.description,
            coordinates: newSupportGroup.coordinates,
          });

          // Commit to local state
          commit('addSupportGroup', newSupportGroup);
          return true;
        }
      } catch (error) {
        console.error("Error adding support group:", error);
        return false;
      }
    },

    async fetchSupportGroups({ commit }) {
      try {
        const supportGroups = [];
        const querySnapshot = await getDocs(collection(db, "supportGroups"));
        querySnapshot.forEach(doc => {
          const supportGroupData = doc.data();
          const supportGroupId = doc.id; // Get the document's ID
          supportGroups.push({
            ...supportGroupData, 
            supportGroupId     // Add the document ID
          });
        });
        commit('fetchSupportGroups', supportGroups);
      } catch (error) {
        console.error("Error fetching support groups:", error);
      }
    },
    async addAppointment({ state, commit }, newAppointment) {
      try {
        const q = query(collection(db, "appointments"), where("date", "==", newAppointment.date));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          const appointmentData = querySnapshot.docs[0].data();
          const appointmentId = querySnapshot.docs[0].id;

          // Check if newAppointment.time is already in bookedTimeSlots or within the hour following
          const newTime = new Date(`1970-01-01T${newAppointment.time}`);

          const isTimeSlotTaken = appointmentData.bookedTimeSlots.some(timeSlot => {
            const existingTime = new Date(`1970-01-01T${timeSlot}`);
            return newTime.getTime() >= existingTime.getTime() &&
                  newTime.getTime() < existingTime.getTime() + 3600000; // 3600000 ms = 1 hour
          });

          const isAppointmentToClose = appointmentData.bookedTimeSlots.some(timeSlot => {
            const existingTime = new Date(`1970-01-01T${timeSlot}`);
            return newTime.getTime() <= existingTime.getTime() &&
                  newTime.getTime() > existingTime.getTime() - 3600000; // 3600000 ms = 1 hour
          });
          
          if (!isTimeSlotTaken && !isAppointmentToClose) {
            appointmentData.bookedTimeSlots.push(newAppointment.time);
            const appointmentRef = doc(db, "appointments",appointmentId);
            await updateDoc(appointmentRef, appointmentData);
            commit('updateAppointment', appointmentData);
            alert("Time slot successfully booked!");
            return true;
          } else if (isTimeSlotTaken) {
            alert("Time slot already booked or within the hour following");
          } else if (isAppointmentToClose) {
            alert("Time slot too close to an existing appointment");
          }

        } else {
          const appointmentRef = doc(collection(db, "appointments"));
          await setDoc(appointmentRef, {
            title: newAppointment.title,
            date: newAppointment.date,
            bookedTimeSlots: [newAppointment.time]
          });
          commit('addAppointment', newAppointment);
          alert("Time slot successfully booked!");
          return true;
        }
      }  catch (error) {
        console.error("Error adding appointment:", error);
      }
    },
    async fetchAppointments({ commit }) {
      try {
        const appointments = [];
        const querySnapshot = await getDocs(collection(db, "appointments"));
        querySnapshot.forEach(doc => {
          const appointmentData = doc.data();
          const appointmentId = doc.id; // Get the document's ID
          appointments.push({
            ...appointmentData, 
            appointmentId     // Add the document ID
          });
        });
        commit('fetchAppointments', appointments);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    },
  },

  //getters to acccess the data in the store from the pages
  getters: {
    getResources: (state) => state.resources, 
    getUser: (state) => state.user,
    getAllUsers: (state) => state.allUsers,
    getAllSupportGroups: (state) => state.supportGroups,
    getAppointments: (state) => state.appointments
  },
});
