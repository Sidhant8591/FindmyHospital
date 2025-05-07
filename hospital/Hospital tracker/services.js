// Mapbox access token - replace with your actual token
const MAPBOX_ACCESS_TOKEN = '';

// Global variables
let map;
let userMarker;
let hospitalMarkers = [];
let currentSearch = '';

// Initialize map when the page loads
document.addEventListener('DOMContentLoaded', initMap);

// Initialize the map
function initMap() {
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN;
    
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Default center (New York area)
        zoom: 9
    });

    // Add navigation controls
    map.addControl(new mapboxgl.NavigationControl());

    // Add scale control
    map.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
    }));

    // Initialize search input listener
    initializeSearch();
}

// Initialize search functionality
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    
    // Debounce search to prevent too many API calls
    let timeout = null;
    searchInput.addEventListener('input', (e) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            currentSearch = e.target.value;
            if (currentSearch.length >= 3) {
                searchHospitals(currentSearch);
            }
        }, 500);
    });
}

// Get user's current location
async function getCurrentLocation() {
    if ("geolocation" in navigator) {
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });

            const { latitude, longitude } = position.coords;
            
            // Update map
            map.flyTo({
                center: [longitude, latitude],
                zoom: 12,
                essential: true
            });

            // Update user marker
            updateUserMarker(latitude, longitude);

            // Search for hospitals
            await searchNearbyHospitals(latitude, longitude);
        } catch (error) {
            console.error("Error getting location:", error);
            showError("Unable to get your location. Please check your location permissions.");
        }
    } else {
        showError("Geolocation is not supported by your browser.");
    }
}

// Update user location marker
function updateUserMarker(latitude, longitude) {
    if (userMarker) userMarker.remove();
    
    userMarker = new mapboxgl.Marker({
        color: '#3498db',
        scale: 0.8
    })
    .setLngLat([longitude, latitude])
    .addTo(map);
}

// Search for nearby hospitals
async function searchNearbyHospitals(latitude, longitude) {
    try {
        const response = await fetch(
            `https://api.mapbox.com/search/searchbox/v1/suggest?` +
            `q=hospital&` +
            `proximity=${longitude},${latitude}&` +
            `limit=10&` +
            `access_token=${MAPBOX_ACCESS_TOKEN}`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            displayHospitals(data.features);
            addHospitalMarkers(data.features);
        } else {
            showError("No hospitals found in this area.");
        }
    } catch (error) {
        console.error("Error searching hospitals:", error);
        showError("Error searching for nearby hospitals. Please try again later.");
    }
}

// Search hospitals by text input
async function searchHospitals(searchText) {
    try {
        const response = await fetch(
            `https://api.mapbox.com/search/searchbox/v1/suggest?` +
            `q=${encodeURIComponent(searchText)}%20hospital&` +
            `limit=10&` +
            `access_token=${MAPBOX_ACCESS_TOKEN}`
        );

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        
        if (data.features && data.features.length > 0) {
            displayHospitals(data.features);
            addHospitalMarkers(data.features);
        } else {
            showError("No hospitals found matching your search.");
        }
    } catch (error) {
        console.error("Error searching hospitals:", error);
        showError("Error searching for hospitals. Please try again later.");
    }
}

// Display hospitals in the list
function displayHospitals(hospitals) {
    const hospitalList = document.getElementById('hospital-list');
    hospitalList.innerHTML = '';

    hospitals.forEach(hospital => {