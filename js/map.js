let map;
let serviceMarkers = [];
let userLocation = [-28.0167, 153.4000]; // Gold Coast coordinates (Surfers Paradise)

document.addEventListener('DOMContentLoaded', function() {
    initializeMap();
    setupMapControls();
    loadGoldCoastData();
});

function initializeMap() {
    map = L.map('map').setView(userLocation, 12);

    // Use CartoDB Positron for a friendly, clean look
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://carto.com/">CARTO</a> contributors'
    }).addTo(map);

    // Add user location marker
    const userIcon = L.divIcon({
        className: 'user-location-marker',
        html: '<i class="fas fa-user"></i>',
        iconSize: [30, 30]
    });

    L.marker(userLocation, {icon: userIcon})
        .addTo(map)
        .bindPopup("You are here - Surfers Paradise")
        .openPopup();
}

function setupMapControls() {
    // Layer toggles
    document.getElementById('gov-services').addEventListener('change', toggleGovServices);
    document.getElementById('community-layer').addEventListener('change', toggleCommunityLayer);
    document.getElementById('emergency-mode').addEventListener('change', toggleEmergencyMode);
    
    // Filters
    document.getElementById('service-type').addEventListener('change', filterServices);
    document.getElementById('availability').addEventListener('change', filterServices);
    
    // Panel controls
    document.getElementById('close-panel').addEventListener('click', closeServicePanel);
    document.getElementById('alert-dismiss').addEventListener('click', dismissAlert);
}

function loadGoldCoastData() {
    const goldCoastServices = [
        {
            id: 1,
            name: "Gold Coast Health Hub - Southport",
            type: "health",
            coords: [-27.9654, 153.4042],
            status: "open",
            capacity: "Available",
            hours: "8:00 AM - 6:00 PM",
            services: ["General Practice", "Dental", "Mental Health", "Physiotherapy"],
            waitTime: "20 mins",
            address: "123 Southport Central Dr, Southport QLD"
        },
        {
            id: 2,
            name: "Gold Coast City Library - Surfers Paradise",
            type: "education",
            coords: [-28.0023, 153.4145],
            status: "open",
            capacity: "Available",
            hours: "9:00 AM - 8:00 PM",
            services: ["Computer Access", "Study Rooms", "Digital Workshops", "Community Programs"],
            waitTime: "No wait",
            address: "Gold Coast Highway, Surfers Paradise QLD"
        },
        {
            id: 3,
            name: "Housing and Homelessness Services",
            type: "housing",
            coords: [-28.0174, 153.3988],
            status: "busy",
            capacity: "Limited",
            hours: "9:00 AM - 4:30 PM",
            services: ["Rental Assistance", "Social Housing", "Emergency Accommodation", "Tenancy Advice"],
            waitTime: "50 mins",
            address: "Cavill Ave, Surfers Paradise QLD"
        },
        {
            id: 4,
            name: "Broadbeach Community Markets",
            type: "community",
            coords: [-28.0289, 153.4292],
            status: "open",
            capacity: "Available",
            hours: "8:00 AM - 3:00 PM (Weekends)",
            services: ["Local Produce", "Artisan Goods", "Community Info", "Live Music"],
            waitTime: "Drop-in",
            address: "Kurrawa Park, Broadbeach QLD"
        },
        {
            id: 5,
            name: "Gold Coast Emergency Services Hub",
            type: "emergency",
            coords: [-28.0067, 153.4234],
            status: "open",
            capacity: "Available",
            hours: "24/7",
            services: ["Emergency Shelter", "Crisis Support", "Emergency Meals", "Referral Services"],
            waitTime: "Immediate",
            address: "Nerang St, Southport QLD"
        },
        {
            id: 6,
            name: "Surfers Paradise Beach Patrol",
            type: "beach",
            coords: [-28.0025, 153.4291],
            status: "open",
            capacity: "Active",
            hours: "6:00 AM - 6:00 PM",
            services: ["Beach Safety", "First Aid", "Surf Conditions", "Equipment Hire"],
            waitTime: "On patrol",
            address: "Surfers Paradise Beach, Main Beach QLD"
        },
        {
            id: 7,
            name: "G:link Tram - Surfers Paradise Station",
            type: "transport",
            coords: [-28.0034, 153.4098],
            status: "open",
            capacity: "Available",
            hours: "5:00 AM - 12:00 AM",
            services: ["Light Rail", "Bus Connections", "Accessibility Services", "Go Card Top-up"],
            waitTime: "Next tram: 4 mins",
            address: "Surfers Paradise Blvd, Surfers Paradise QLD"
        },
        {
            id: 8,
            name: "Currumbin Wildlife Sanctuary Events",
            type: "community",
            coords: [-28.1339, 153.4756],
            status: "open",
            capacity: "Available",
            hours: "8:00 AM - 5:00 PM",
            services: ["Wildlife Shows", "Educational Programs", "Conservation Tours", "Aboriginal Culture"],
            waitTime: "Book ahead",
            address: "Currumbin Creek Rd, Currumbin QLD"
        },
        {
            id: 9,
            name: "Robina Town Centre Services Hub",
            type: "housing",
            coords: [-28.0789, 153.4067],
            status: "open",
            capacity: "Available", 
            hours: "9:00 AM - 5:00 PM",
            services: ["Centrelink", "Medicare", "Council Services", "Legal Aid"],
            waitTime: "25 mins",
            address: "Robina Town Centre Dr, Robina QLD"
        },
        {
            id: 10,
            name: "Burleigh Heads Beach Safety",
            type: "beach",
            coords: [-28.0981, 153.4506],
            status: "open",
            capacity: "Active",
            hours: "6:00 AM - 6:00 PM",
            services: ["Surf Life Saving", "Beach Safety", "Swimming Lessons", "First Aid"],
            waitTime: "Always available",
            address: "Goodwin Terrace, Burleigh Heads QLD"
        },

        // Health
        {
            id: 11,
            name: "Southport Community Health Centre",
            type: "health",
            coords: [-27.9670, 153.4090],
            status: "open",
            capacity: "Available",
            hours: "8:30 AM - 5:00 PM",
            services: ["GP", "Immunisation", "Child Health", "Allied Health"],
            waitTime: "10 mins",
            address: "Queen St, Southport QLD"
        },

        // Education
        {
            id: 12,
            name: "Robina Library",
            type: "education",
            coords: [-28.0716, 153.3897],
            status: "open",
            capacity: "Available",
            hours: "9:00 AM - 8:00 PM",
            services: ["Book Loans", "Study Spaces", "Kids Programs"],
            waitTime: "No wait",
            address: "Robina Town Centre Dr, Robina QLD"
        },

        // Housing
        {
            id: 13,
            name: "Palm Beach Housing Support",
            type: "housing",
            coords: [-28.1290, 153.4820],
            status: "busy",
            capacity: "Limited",
            hours: "9:00 AM - 4:00 PM",
            services: ["Rental Help", "Bond Loans", "Emergency Housing"],
            waitTime: "40 mins",
            address: "Fifth Ave, Palm Beach QLD"
        },

        // Community
        {
            id: 14,
            name: "Mermaid Beach Community Centre",
            type: "community",
            coords: [-28.0295, 153.4332],
            status: "open",
            capacity: "Available",
            hours: "8:00 AM - 6:00 PM",
            services: ["Workshops", "Yoga", "Seniors Club"],
            waitTime: "Drop-in",
            address: "Alexandra Ave, Mermaid Beach QLD"
        },

        // Emergency
        {
            id: 15,
            name: "Helensvale Emergency Response",
            type: "emergency",
            coords: [-27.9230, 153.3140],
            status: "open",
            capacity: "Available",
            hours: "24/7",
            services: ["Ambulance", "Fire", "Police"],
            waitTime: "Immediate",
            address: "Sir John Overall Dr, Helensvale QLD"
        },

        // Beach
        {
            id: 16,
            name: "Currumbin Beach Patrol",
            type: "beach",
            coords: [-28.1340, 153.4870],
            status: "open",
            capacity: "Active",
            hours: "6:00 AM - 6:00 PM",
            services: ["Surf Safety", "First Aid", "Swimming Lessons"],
            waitTime: "On patrol",
            address: "Currumbin Beach, Currumbin QLD"
        },

        // Transport
        {
            id: 17,
            name: "Helensvale Train Station",
            type: "transport",
            coords: [-27.9235, 153.3161],
            status: "open",
            capacity: "Available",
            hours: "4:30 AM - 1:00 AM",
            services: ["Train", "Tram", "Bus", "Parking"],
            waitTime: "Next train: 7 mins",
            address: "Town Centre Dr, Helensvale QLD"
        }
    ];
    
    goldCoastServices.forEach(service => {
        addServiceMarker(service);
    });
}

function addServiceMarker(service) {
    const icon = getServiceIcon(service);
    const marker = L.marker(service.coords, {icon: icon})
        .addTo(map)
        .on('click', () => showServiceDetails(service));
    
    serviceMarkers.push({marker: marker, data: service});
}

function getServiceIcon(service) {
    let color = '#4CAF50'; // green
    let iconClass = 'fas fa-building';
    
    switch(service.status) {
        case 'busy': color = '#FF9800'; break;
        case 'closed': color = '#F44336'; break;
        case 'limited': color = '#FF9800'; break;
    }
    
    switch(service.type) {
        case 'health': iconClass = 'fas fa-hospital'; color = service.status === 'open' ? '#4CAF50' : color; break;
        case 'education': iconClass = 'fas fa-book'; break;
        case 'housing': iconClass = 'fas fa-home'; break;
        case 'community': iconClass = 'fas fa-users'; color = '#2196F3'; break;
        case 'emergency': iconClass = 'fas fa-ambulance'; color = '#F44336'; break;
        case 'transport': iconClass = 'fas fa-bus'; break;
        case 'beach': iconClass = 'fas fa-umbrella-beach'; color = '#00BCD4'; break;
    }
    
    return L.divIcon({
        className: 'service-marker',
        html: `<div style="background: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.3); border: 2px solid white;"><i class="${iconClass}" style="font-size: 14px;"></i></div>`,
        iconSize: [30, 30]
    });
}

function showServiceDetails(service) {
    const panel = document.getElementById('service-panel');
    const title = document.getElementById('service-title');
    const info = document.getElementById('service-info');
    
    title.textContent = service.name;
    
    info.innerHTML = `
        <div class="service-details">
            <div class="status-badge status-${service.status}">${service.status.toUpperCase()}</div>
            <p><strong>Address:</strong> ${service.address}</p>
            <p><strong>Capacity:</strong> ${service.capacity}</p>
            <p><strong>Hours:</strong> ${service.hours}</p>
            <p><strong>Wait Time:</strong> ${service.waitTime}</p>
            <h4>Available Services:</h4>
            <ul>
                ${service.services.map(s => `<li>${s}</li>`).join('')}
            </ul>
            <div style="margin-top: 1.5rem; display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="btn btn-primary" onclick="bookService(${service.id})">
                    <i class="fas fa-calendar-plus"></i> Book Service
                </button>
                <button class="btn btn-secondary" onclick="getDirections(${service.coords[0]}, ${service.coords[1]})">
                    <i class="fas fa-directions"></i> Directions
                </button>
            </div>
        </div>
    `;
    
    panel.classList.add('open');
}

function closeServicePanel() {
    document.getElementById('service-panel').classList.remove('open');
}

function findNearestService(type) {
    const nearestService = serviceMarkers.find(s => s.data.type === type);
    if (nearestService) {
        map.setView(nearestService.data.coords, 16);
        showServiceDetails(nearestService.data);
    } else {
        alert(`No ${type} services found in the current view.`);
    }
}

function showEmergencyServices() {
    document.getElementById('emergency-mode').checked = true;
    toggleEmergencyMode();
    document.getElementById('emergency-alert').style.display = 'block';
    
    // Focus on emergency services
    const emergencyServices = serviceMarkers.filter(s => s.data.type === 'emergency');
    if (emergencyServices.length > 0) {
        map.setView(emergencyServices[0].data.coords, 14);
    }
}

function toggleGovServices() {
    const checked = document.getElementById('gov-services').checked;
    serviceMarkers.forEach(service => {
        if (['health', 'education', 'housing', 'transport'].includes(service.data.type)) {
            if (checked) {
                map.addLayer(service.marker);
            } else {
                map.removeLayer(service.marker);
            }
        }
    });
}

function toggleCommunityLayer() {
    const checked = document.getElementById('community-layer').checked;
    serviceMarkers.forEach(service => {
        if (['community', 'beach'].includes(service.data.type)) {
            if (checked) {
                map.addLayer(service.marker);
            } else {
                map.removeLayer(service.marker);
            }
        }
    });
}

function toggleEmergencyMode() {
    const checked = document.getElementById('emergency-mode').checked;
    const mapContainer = document.getElementById('map');
    
    if (checked) {
        mapContainer.style.filter = 'hue-rotate(10deg) saturate(1.2) contrast(1.1)';
        
        // Show emergency services prominently
        serviceMarkers.forEach(service => {
            if (service.data.type === 'emergency') {
                map.addLayer(service.marker);
                service.marker.setZIndexOffset(1000);
            }
        });
        
        // Add evacuation routes
        addEvacuationRoutes();
        
        // Add emergency shelters
        addEmergencyShelters();
        
    } else {
        mapContainer.style.filter = 'none';
        removeEmergencyOverlays();
    }
}

function addEvacuationRoutes() {
    // Evacuation route from Surfers Paradise to safer inland areas
    const evacuationRoutes = [
        {
            name: "Evacuation Route 1 - To Nerang",
            coords: [
                [-28.0167, 153.4000], // Surfers Paradise
                [-28.0089, 153.3876], // Via Bundall
                [-27.9845, 153.3654], // To Nerang
            ],
            color: '#ef4444'
        },
        {
            name: "Evacuation Route 2 - To Robina",
            coords: [
                [-28.0289, 153.4292], // Broadbeach
                [-28.0456, 153.4123], // Via Pacific Fair
                [-28.0789, 153.4067], // To Robina
            ],
            color: '#f59e0b'
        }
    ];
    
    window.evacuationPolylines = [];
    
    evacuationRoutes.forEach(route => {
        const polyline = L.polyline(route.coords, {
            color: route.color,
            weight: 6,
            opacity: 0.8,
            dashArray: '15, 10'
        }).addTo(map);
        
        polyline.bindPopup(`<strong>${route.name}</strong><br>Follow this route to safety`);
        window.evacuationPolylines.push(polyline);
    });
}

function addEmergencyShelters() {
    const emergencyShelters = [
        {
            name: "Emergency Evacuation Centre - Carrara Stadium",
            coords: [-28.0634, 153.3789],
            capacity: "5000 people"
        },
        {
            name: "Community Safe Zone - Robina Community Centre", 
            coords: [-28.0789, 153.4067],
            capacity: "2000 people"
        }
    ];
    
    window.emergencyShelterMarkers = [];
    
    emergencyShelters.forEach(shelter => {
        const icon = L.divIcon({
            className: 'emergency-shelter-marker',
            html: `<div style="background: #ef4444; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; box-shadow: 0 4px 20px rgba(239,68,68,0.5); border: 3px solid white; animation: pulse 2s infinite;"><i class="fas fa-shield-alt" style="font-size: 16px;"></i></div>`,
            iconSize: [40, 40]
        });
        
        const marker = L.marker(shelter.coords, {icon: icon})
            .addTo(map)
            .bindPopup(`<strong>${shelter.name}</strong><br>Capacity: ${shelter.capacity}<br><em>Emergency shelter and supplies available</em>`);
            
        window.emergencyShelterMarkers.push(marker);
    });
}

function removeEmergencyOverlays() {
    if (window.evacuationPolylines) {
        window.evacuationPolylines.forEach(polyline => {
            map.removeLayer(polyline);
        });
        window.evacuationPolylines = [];
    }
    
    if (window.emergencyShelterMarkers) {
        window.emergencyShelterMarkers.forEach(marker => {
            map.removeLayer(marker);
        });
        window.emergencyShelterMarkers = [];
    }
}

function filterServices() {
    const serviceType = document.getElementById('service-type').value;
    const availability = document.getElementById('availability').value;
    
    serviceMarkers.forEach(service => {
        let show = true;
        
        if (serviceType !== 'all' && service.data.type !== serviceType) {
            show = false;
        }
        
        if (availability !== 'all') {
            if (availability === 'available' && service.data.status !== 'open') {
                show = false;
            } else if (availability === 'open' && service.data.status !== 'open') {
                show = false;
            } else if (availability === 'busy' && service.data.status !== 'busy') {
                show = false;
            }
        }
        
        if (show) {
            map.addLayer(service.marker);
        } else {
            map.removeLayer(service.marker);
        }
    });
}

function bookService(serviceId) {
    const service = serviceMarkers.find(s => s.data.id === serviceId);
    if (service) {
        alert(`Booking appointment at ${service.data.name}. 

A confirmation SMS will be sent to your phone shortly with:
• Appointment time and date
• Address and parking info  
• What to bring
• Contact number for changes

You can also add this to your calendar or set a reminder.`);
    }
}

function getDirections(lat, lng) {
    const userLat = userLocation[0];
    const userLng = userLocation[1];
    
    // Calculate approximate distance
    const distance = calculateDistance(userLat, userLng, lat, lng);
    
    alert(`Directions from your location:
    
Distance: ${distance.toFixed(1)}km
Estimated time: ${Math.ceil(distance * 3)} minutes by car

Opening Google Maps for detailed directions...`);
    
    // In a real app, this would open the device's map app
    const mapsUrl = `https://www.google.com/maps/dir/${userLat},${userLng}/${lat},${lng}`;
    window.open(mapsUrl, '_blank');
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function dismissAlert() {
    document.getElementById('emergency-alert').style.display = 'none';
    document.getElementById('emergency-mode').checked = false;
    toggleEmergencyMode();
}

// Simulate real-time updates
setInterval(() => {
    updateServiceStatus();
}, 30000); // Update every 30 seconds

function updateServiceStatus() {
    serviceMarkers.forEach(service => {
        // Randomly update wait times and capacity for demo
        if (Math.random() > 0.8) {
            const waitTimes = ['No wait', '5 mins', '15 mins', '25 mins', '45 mins'];
            const capacities = ['Available', 'Limited', 'Busy', 'Full'];
            
            service.data.waitTime = waitTimes[Math.floor(Math.random() * waitTimes.length)];
            service.data.capacity = capacities[Math.floor(Math.random() * capacities.length)];
            
            // Update status based on capacity
            if (service.data.capacity === 'Available') {
                service.data.status = 'open';
            } else if (service.data.capacity === 'Full') {
                service.data.status = 'closed';
            } else {
                service.data.status = 'busy';
            }
            
            // Update marker icon
            const newIcon = getServiceIcon(service.data);
            service.marker.setIcon(newIcon);
        }
    });
}

// Initialize geolocation if available
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // Update user location if within Gold Coast area
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Check if within Gold Coast bounds (approximate)
            if (lat >= -28.5 && lat <= -27.5 && lng >= 153.0 && lng <= 154.0) {
                userLocation = [lat, lng];
                map.setView(userLocation, 13);
                
                // Update user marker
                const userIcon = L.divIcon({
                    className: 'user-location-marker',
                    html: '<i class="fas fa-user"></i>',
                    iconSize: [30, 30]
                });
                
                L.marker(userLocation, {icon: userIcon})
                    .addTo(map)
                    .bindPopup("Your current location")
                    .openPopup();
            }
        },
        function(error) {
            console.log('Geolocation not available, using default Gold Coast location');
        }
    );
}