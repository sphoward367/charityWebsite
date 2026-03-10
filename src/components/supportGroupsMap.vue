<template>
    <div class="container mt-4">
      <h1 class="text-center mb-4">Support Groups</h1>
      <input v-model="searchLocation" @keyup.enter="searchForSupportGroups" placeholder="Search for a location..." class="form-control mb-3" />
      <div id="map" class="map-container"></div>
        <div>
          <small class="text-muted">Directions may take some time to load <br></small>
          <small class="text-muted">If you use the view on map button for a location, and want to click on the marker to get directions, please use clear directions button then proceed to click the marker. </small>
        </div>
        <button @click="clearDirectionsAndSearch" class="btn btn-danger mt-3">Clear Directions and Search Result</button>
        <!-- Cards for Support Groups -->
        <div class="support-groups-list mt-4">
            <button v-if="loggedInUser.isAdmin" class="btn btn-primary mb-3" @click="openAddGroupModal">Add Support Group</button>
            <addSupportGroupModal v-model:visible="addSupportGroupVisible" @closeModal="onCloseModal" />
            <div class="row">
                <div class="col-md-6 mb-4" v-for="group in supportGroups" :key="group.name">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">{{ group.name }}</h5>
                            <p class="card-text">{{ group.description }}</p>
                            <button class="btn btn-info" @click="showOnMap(group.coordinates)">Show on Map</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </div>
</template>
  
<script setup>
import { ref, onMounted, computed } from 'vue';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useStore } from 'vuex';
import addSupportGroupModal from './addSupportGroupModal.vue';
  
// Define variables
const searchLocation = ref('');
const map = ref(null);
const mapMarkers = [];
const currentRouteSourceId = 'route';
const addSupportGroupVisible = ref(false);
const store = useStore();
const supportGroups = computed(() => store.getters.getAllSupportGroups);
const loggedInUser = computed(() => store.getters.getUser);
  
// Use an environment variable for the Mapbox token (Vite: VITE_MAPBOX_TOKEN).
// This avoids committing secrets into source control. Set VITE_MAPBOX_TOKEN in
// a local `.env` file or in your deployment provider. Example `.env` entry:
// VITE_MAPBOX_TOKEN=pk.your_new_token_here
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN || '';
  

const openAddGroupModal = () => {
  addSupportGroupVisible.value = !addSupportGroupVisible.value;
};

const onCloseModal = async () => {
  addSupportGroupVisible.value = false;
  await store.dispatch('fetchSupportGroups');
  initializeMap();
};

// Function to initialize MapBox map
function initializeMap() {
    map.value = new mapboxgl.Map({
      container: 'map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [144.9631, -37.8136], // Melbourne coordinates as default center
      zoom: 12
    });
  
    // Add user location control
    map.value.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true
      },
      trackUserLocation: true
    }));
  
    map.value.on('load', () => {
      console.log('Map has been loaded successfully.');
  
      // Load support groups markers when the map loads
      loadSupportGroupMarkers();
    });
}
  
// Function to load support group markers
function loadSupportGroupMarkers() {
    // Clear existing markers
    mapMarkers.forEach(marker => marker.remove());
    mapMarkers.length = 0; // Reset markers array

    // Add markers for support groups
    if (supportGroups.value) {
      addSupportGroupMarkers();
    }
    
}
  
// Function to add support group markers
function addSupportGroupMarkers() {
    supportGroups.value.forEach(group => {
      // Create a popup with the button
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <strong>${group.name}</strong>
          <br />
          <button class="btn btn-primary get-directions-btn" onclick="getDirections([${group.coordinates}])">Get Directions</button>
        `);
  
      // Create the marker
      const marker = new mapboxgl.Marker()
        .setLngLat(group.coordinates)
        .setPopup(popup) // Attach the popup to the marker
        .addTo(map.value);
  
      mapMarkers.push(marker);
    });
}
// Directions function
window.getDirections = function(destination) {
    navigator.geolocation.getCurrentPosition(position => {
      const start = [position.coords.longitude, position.coords.latitude];
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start.join(',')};${destination.join(',')}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
  
      fetch(directionsUrl)
        .then(response => response.json())
        .then(data => {
          // Ensure there's at least one route
          if (data.routes.length > 0) {
            const route = data.routes[0].geometry;
  
            // Check if the source already exists and remove it if it does
            if (map.value.getSource(currentRouteSourceId)) {
              map.value.removeLayer(currentRouteSourceId); // Remove the existing layer first
              map.value.removeSource(currentRouteSourceId); // Then remove the source
            }
  
            // Add the GeoJSON source for the route
            map.value.addSource(currentRouteSourceId, {
              type: 'geojson',
              data: {
                type: 'Feature',
                geometry: route
              }
            });
  
            // Add a layer to display the route
            map.value.addLayer({
              id: currentRouteSourceId,
              type: 'line',
              source: currentRouteSourceId,
              layout: {
                'line-join': 'round',
                'line-cap': 'round'
              },
              paint: {
                'line-color': '#4264fb',
                'line-width': 5
              }
            });
          } else {
            console.error('No routes found');
          }
        })
        .catch(error => console.error('Error getting directions:', error));
    });
}


// Function to search for support groups

function searchForSupportGroups() {
  const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(searchLocation.value)}.json?access_token=${mapboxgl.accessToken}`;

  fetch(geocodingUrl)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const { geometry } = data.features[0];
        const [lng, lat] = geometry.coordinates;

        // Center the map on the searched location
        map.value.setCenter([lng, lat]);
        map.value.setZoom(14); // Adjust zoom level as needed

        // Optional: Add a marker for the searched location
        const searchMarker = new mapboxgl.Marker()
          .setLngLat([lng, lat])
          .addTo(map.value);
          
        // Clear previous markers before adding new ones
        mapMarkers.forEach(marker => marker.remove());
        mapMarkers.length = 0; // Reset markers array
        mapMarkers.push(searchMarker);
      } else {
        console.log('No results found for that location.');
      }
    })
    .catch(error => console.error('Error fetching geocoding data:', error));
}


// Function to show a support group's location on the map
function showOnMap(coordinates) {
  // Zoom to the coordinates and add a marker
  map.value.flyTo({
    center: coordinates,
    zoom: 14,
    essential: true // This animation is considered essential with respect to user interaction
  });

  // Add a marker for the selected support group
  new mapboxgl.Marker()
    .setLngLat(coordinates)
    .addTo(map.value);
}
  
// Function to clear directions
function clearDirectionsAndSearch() {
    if (map.value.getSource(currentRouteSourceId)) {
      map.value.removeLayer(currentRouteSourceId);
      map.value.removeSource(currentRouteSourceId);
    }
    loadSupportGroupMarkers()

}
  
// Initialize map on component mount
onMounted(async () => {
  await store.dispatch('fetchSupportGroups');
  initializeMap();
});
</script>
  
<style scoped>
.map-container {
    width: 100%;
    height: 400px; /* Adjust height as needed */
}
</style>
  