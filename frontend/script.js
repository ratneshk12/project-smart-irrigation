// DOM Elements
const systemMode = document.getElementById('system-mode');
const manualControls = document.getElementById('manual-controls');
const waterNowBtn = document.getElementById('water-now');
const waterDuration = document.getElementById('water-duration');
const systemStatus = document.getElementById('system-status');
const lastWatered = document.getElementById('last-watered');
const moistureValue = document.getElementById('moisture-value');
const tempValue = document.getElementById('temp-value');
const humidityValue = document.getElementById('humidity-value');
const addScheduleBtn = document.getElementById('add-schedule');
const scheduleList = document.getElementById('schedule-list');
const scheduleModal = document.getElementById('schedule-modal');
const scheduleForm = document.getElementById('schedule-form');
const closeModal = document.querySelectorAll('.close');
const alertList = document.getElementById('alert-list');
const addZoneBtn = document.getElementById('add-zone');
const zoneList = document.getElementById('zone-list');
const zoneModal = document.getElementById('zone-modal');
const zoneForm = document.getElementById('zone-form');
const scheduleZoneSelect = document.getElementById('schedule-zone');
const toast = document.getElementById('notification-toast');
const toastMessage = document.getElementById('toast-message');


// Chart setup
const ctx = document.getElementById('moisture-chart').getContext('2d');
const moistureChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: Array(24).fill('').map((_, i) => `${i}:00`),
        datasets: [{
            label: 'Soil Moisture (%)',
            data: Array(24).fill(0),
            borderColor: '#2e7d32',
            backgroundColor: 'rgba(46, 125, 50, 0.1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    }
                }
            }
        }
    }
});

// Simulated sensor data
let moistureLevel = 50;
let temperature = 22;
let humidity = 65;
let isWatering = false;
let lastWateredTime = null;

// Update gauges and values
function updateSensorData() {
    // Simulate natural changes in sensor data
    if (!isWatering) {
        // Moisture decreases over time
        moistureLevel = Math.max(10, moistureLevel - (Math.random() * 0.5));
        
        // Temperature fluctuates
        temperature = 20 + Math.sin(Date.now() / 1000000) * 5 + Math.random() * 2;
        
        // Humidity fluctuates
        humidity = 60 + Math.sin(Date.now() / 1200000) * 10 + Math.random() * 3;
    } else {
        // When watering, moisture increases
        moistureLevel = Math.min(100, moistureLevel + (Math.random() * 3));
    }
    
    // Update display values
    moistureValue.textContent = `${Math.round(moistureLevel)}%`;
    tempValue.textContent = `${Math.round(temperature * 10) / 10}°C`;
    humidityValue.textContent = `${Math.round(humidity)}%`;
    
    // Update chart
    const now = new Date();
    const currentHour = now.getHours();
    moistureChart.data.datasets[0].data[currentHour] = Math.round(moistureLevel);
    moistureChart.update();
    
    // Update gauge rotations
    updateGauge('moisture-gauge', moistureLevel, 0, 100);
    updateGauge('temp-gauge', temperature, 0, 40);
    updateGauge('humidity-gauge', humidity, 0, 100);
}

// Update gauge visualization
function updateGauge(gaugeId, value, min, max) {
    const gauge = document.getElementById(gaugeId);
    const percentage = (value - min) / (max - min);
    const rotation = percentage * 180;
    
    gauge.style.background = `conic-gradient(
        #f44336 0% 20%,
        #ff9800 20% 40%,
        #ffeb3b 40% 60%,
        #8bc34a 60% 80%,
        #4caf50 80% 100%,
        transparent ${rotation}deg 180deg
    )`;
}

// Watering function
function waterPlants(duration) {
    if (isWatering) return;
    
    isWatering = true;
    systemStatus.textContent = `Watering plants for ${duration} seconds...`;
    
    // Simulate watering effect
    const wateringInterval = setInterval(() => {
        moistureLevel = Math.min(100, moistureLevel + 1);
        updateSensorData();
    }, (duration * 1000) / 30);
    
    setTimeout(() => {
        clearInterval(wateringInterval);
        isWatering = false;
        lastWateredTime = new Date();
        lastWatered.textContent = `Last watered: ${lastWateredTime.toLocaleString()}`;
        
        if (systemMode.value === 'manual') {
            systemStatus.textContent = 'System is in manual mode - ready';
        } else {
            systemStatus.textContent = 'System is in automatic mode';
        }
    }, duration * 1000);
}

// Event Listeners
systemMode.addEventListener('change', function() {
    if (this.value === 'manual') {
        manualControls.style.display = 'block';
        systemStatus.textContent = 'System is in manual mode - ready';
    } else if (this.value === 'auto') {
        manualControls.style.display = 'none';
        systemStatus.textContent = 'System is in automatic mode';
    } else {
        manualControls.style.display = 'none';
        systemStatus.textContent = 'System is turned off';
    }
});

waterNowBtn.addEventListener('click', function() {
    const duration = parseInt(waterDuration.value);
    if (duration > 0) {
        waterPlants(duration);
    }
});

// Form submission handlers
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    this.reset();
});

document.getElementById('newsletterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
    this.reset();
});

// Initialize
updateSensorData();
updateGauge('moisture-gauge', moistureLevel, 0, 100);
updateGauge('temp-gauge', temperature, 0, 40);
updateGauge('humidity-gauge', humidity, 0, 100);

// Update sensor data every 5 seconds
setInterval(updateSensorData, 5000);

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});


// Data Structures
let schedules = [];
let alerts = [];
let zones = [
    { id: 1, name: "Front Lawn", description: "Main grassy area in front of house", flowRate: 2.5, area: 25 },
    { id: 2, name: "Back Garden", description: "Vegetable and flower garden", flowRate: 1.8, area: 15 },
    { id: 3, name: "Side Shrubs", description: "Decorative shrubs along driveway", flowRate: 1.2, area: 10 }
];
let waterUsage = {
    today: 0,
    week: 0,
    month: 0,
    total: 0
};

// Initialize the application
function init() {
    loadSchedules();
    loadZones();
    updateSensorData();
    checkSchedules();
    simulateWeatherChanges();
    
    // Update every minute to check schedules
    setInterval(checkSchedules, 60000);
    
    // Update water usage stats every hour
    setInterval(updateWaterUsage, 3600000);
}

// Load sample schedules
function loadSchedules() {
    schedules = [
        {
            id: 1,
            zoneId: 1,
            days: [1, 3, 5], // Monday, Wednesday, Friday
            time: "06:00",
            duration: 20,
            enabled: true,
            lastRun: null
        },
        {
            id: 2,
            zoneId: 2,
            days: [0, 3, 6], // Sunday, Wednesday, Saturday
            time: "18:00",
            duration: 15,
            enabled: true,
            lastRun: null
        }
    ];
    renderSchedules();
}

// Load zones and populate select dropdown
function loadZones() {
    renderZones();
    updateZoneSelect();
}

// Update zone select dropdown
function updateZoneSelect() {
    scheduleZoneSelect.innerHTML = '';
    zones.forEach(zone => {
        const option = document.createElement('option');
        option.value = zone.id;
        option.textContent = zone.name;
        scheduleZoneSelect.appendChild(option);
    });
}

// Render schedules to the UI
function renderSchedules() {
    scheduleList.innerHTML = '';
    
    if (schedules.length === 0) {
        scheduleList.innerHTML = '<p>No schedules found. Add one to get started.</p>';
        return;
    }
    
    schedules.forEach(schedule => {
        const zone = zones.find(z => z.id === schedule.zoneId);
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';
        
        const daysText = schedule.days.map(day => {
            const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            return days[day];
        }).join(', ');
        
        scheduleItem.innerHTML = `
            <div class="schedule-details">
                <strong>${zone ? zone.name : 'Unknown Zone'}</strong>
                <p>${daysText} at ${schedule.time} for ${schedule.duration} mins</p>
                <small>Status: ${schedule.enabled ? 'Enabled' : 'Disabled'}</small>
            </div>
            <div class="schedule-actions">
                <button class="btn small toggle-schedule" data-id="${schedule.id}">
                    ${schedule.enabled ? 'Disable' : 'Enable'}
                </button>
                <button class="btn small delete-schedule" data-id="${schedule.id}">Delete</button>
            </div>
        `;
        
        scheduleList.appendChild(scheduleItem);
    });
    
    // Add event listeners to new buttons
    document.querySelectorAll('.toggle-schedule').forEach(btn => {
        btn.addEventListener('click', function() {
            toggleSchedule(parseInt(this.dataset.id));
        });
    });
    
    document.querySelectorAll('.delete-schedule').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteSchedule(parseInt(this.dataset.id));
        });
    });
}

// Render zones to the UI
function renderZones() {
    zoneList.innerHTML = '';
    
    zones.forEach(zone => {
        const zoneItem = document.createElement('div');
        zoneItem.className = 'zone-item';
        
        zoneItem.innerHTML = `
            <div class="zone-info">
                <div class="zone-icon">
                    <i class="fas fa-leaf"></i>
                </div>
                <div>
                    <div class="zone-name">${zone.name}</div>
                    <div class="zone-description">${zone.description}</div>
                    <div class="zone-stats">
                        <span class="zone-stat">${zone.flowRate} L/min</span>
                        <span class="zone-stat">${zone.area} m²</span>
                    </div>
                </div>
            </div>
            <div class="zone-actions">
                <button class="btn small water-zone" data-id="${zone.id}">Water Now</button>
                <button class="btn small edit-zone" data-id="${zone.id}">Edit</button>
                <button class="btn small delete-zone" data-id="${zone.id}">Delete</button>
            </div>
        `;
        
        zoneList.appendChild(zoneItem);
    });
    
    // Add event listeners to zone buttons
    document.querySelectorAll('.water-zone').forEach(btn => {
        btn.addEventListener('click', function() {
            waterZone(parseInt(this.dataset.id), 10); // Default 10 minutes
        });
    });
    
    document.querySelectorAll('.edit-zone').forEach(btn => {
        btn.addEventListener('click', function() {
            openEditZoneModal(parseInt(this.dataset.id));
        });
    });
    
    document.querySelectorAll('.delete-zone').forEach(btn => {
        btn.addEventListener('click', function() {
            deleteZone(parseInt(this.dataset.id));
        });
    });
}

// Render alerts to the UI
function renderAlerts() {
    alertList.innerHTML = '';
    
    if (alerts.length === 0) {
        alertList.innerHTML = '<p>No alerts at this time.</p>';
        return;
    }
    
    // Sort alerts by date (newest first)
    alerts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only the most recent 5 alerts
    const recentAlerts = alerts.slice(0, 5);
    
    recentAlerts.forEach(alert => {
        const alertItem = document.createElement('div');
        alertItem.className = `alert-item ${alert.type}`;
        
        const alertDate = new Date(alert.date).toLocaleString();
        
        alertItem.innerHTML = `
            <div class="alert-details">
                <strong>${alert.title}</strong>
                <p>${alert.message}</p>
                <small>${alertDate}</small>
            </div>
        `;
        
        alertList.appendChild(alertItem);
    });
}

// Check schedules and run if needed
function checkSchedules() {
    const now = new Date();
    const currentDay = now.getDay(); // 0 (Sun) to 6 (Sat)
    const currentTime = now.getHours().toString().padStart(2, '0') + ':' + 
                        now.getMinutes().toString().padStart(2, '0');
    
    schedules.forEach(schedule => {
        if (!schedule.enabled) return;
        
        // Check if today is a scheduled day
        if (!schedule.days.includes(currentDay)) return;
        
        // Check if it's time to run (within 1 minute of scheduled time)
        if (Math.abs(timeToMinutes(currentTime) - timeToMinutes(schedule.time)) <= 1) {
            // Check if we already ran this today
            if (schedule.lastRun && isSameDay(schedule.lastRun, now)) return;
            
            // Run the schedule
            const zone = zones.find(z => z.id === schedule.zoneId);
            if (zone) {
                waterZone(schedule.zoneId, schedule.duration);
                schedule.lastRun = now;
                
                // Add alert
                addAlert('info', 'Schedule Run', 
                    `Automatically watered ${zone.name} for ${schedule.duration} minutes as scheduled.`);
            }
        }
    });
}

// Helper function to convert time string to minutes
function timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
}

// Helper function to check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Water a specific zone
function waterZone(zoneId, durationMinutes) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;
    
    if (isWatering) {
        addAlert('warning', 'Watering in Progress', 
            `Cannot water ${zone.name} right now. Another watering is already in progress.`);
        return;
    }
    
    isWatering = true;
    const durationSeconds = durationMinutes * 60;
    
    // Calculate water usage (flow rate * duration in hours)
    const waterUsed = zone.flowRate * (durationMinutes / 60);
    updateWaterUsageStats(waterUsed);
    
    systemStatus.textContent = `Watering ${zone.name} for ${durationMinutes} minutes...`;
    
    // Simulate watering effect
    const wateringInterval = setInterval(() => {
        moistureLevel = Math.min(100, moistureLevel + 0.5);
        updateSensorData();
    }, 1000);
    
    setTimeout(() => {
        clearInterval(wateringInterval);
        isWatering = false;
        lastWateredTime = new Date();
        lastWatered.textContent = `Last watered: ${lastWateredTime.toLocaleString()} (${zone.name})`;
        
        if (systemMode.value === 'manual') {
            systemStatus.textContent = 'System is in manual mode - ready';
        } else {
            systemStatus.textContent = 'System is in automatic mode';
        }
        
        // Add alert
        addAlert('success', 'Watering Complete', 
            `Finished watering ${zone.name} for ${durationMinutes} minutes. Used ${waterUsed.toFixed(1)} liters.`);
    }, durationSeconds * 1000);
    
    // Add alert
    addAlert('info', 'Watering Started', 
        `Started watering ${zone.name} for ${durationMinutes} minutes.`);
}

// Update water usage statistics
function updateWaterUsageStats(liters) {
    waterUsage.today += liters;
    waterUsage.week += liters;
    waterUsage.month += liters;
    waterUsage.total += liters;
    
    // In a real app, you would save this to local storage or a database
}

// Display water usage statistics
function displayWaterUsage() {
    // This would update UI elements showing water usage stats
}

// Add a new alert
function addAlert(type, title, message) {
    const newAlert = {
        id: Date.now(),
        type,
        title,
        message,
        date: new Date()
    };
    
    alerts.unshift(newAlert); // Add to beginning of array
    renderAlerts();
    showToast(type, message);
    
    // In a real app, you might also send push notifications
}

// Show toast notification
function showToast(type, message) {
    toast.className = `toast ${type}`;
    toastMessage.textContent = message;
    toast.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        toast.style.display = 'none';
    }, 5000);
}

// Toggle schedule enabled/disabled
function toggleSchedule(scheduleId) {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
        schedule.enabled = !schedule.enabled;
        renderSchedules();
        
        addAlert('info', 'Schedule Updated', 
            `Schedule ${schedule.enabled ? 'enabled' : 'disabled'}.`);
    }
}

// Delete a schedule
function deleteSchedule(scheduleId) {
    if (confirm('Are you sure you want to delete this schedule?')) {
        schedules = schedules.filter(s => s.id !== scheduleId);
        renderSchedules();
        addAlert('info', 'Schedule Deleted', 'An irrigation schedule was removed.');
    }
}

// Add a new schedule
function addSchedule(schedule) {
    schedule.id = Date.now();
    schedules.push(schedule);
    renderSchedules();
    addAlert('success', 'Schedule Added', 'New irrigation schedule was created.');
}

// Add a new zone
function addZone(zone) {
    zone.id = Date.now();
    zones.push(zone);
    renderZones();
    updateZoneSelect();
    addAlert('success', 'Zone Added', `New zone "${zone.name}" was created.`);
}

// Delete a zone
function deleteZone(zoneId) {
    if (confirm('Are you sure you want to delete this zone? Any schedules for this zone will also be removed.')) {
        // Remove any schedules for this zone
        schedules = schedules.filter(s => s.zoneId !== zoneId);
        
        // Remove the zone
        zones = zones.filter(z => z.id !== zoneId);
        
        renderZones();
        renderSchedules();
        updateZoneSelect();
        addAlert('info', 'Zone Deleted', 'An irrigation zone was removed.');
    }
}

// Open schedule modal
function openScheduleModal() {
    scheduleModal.style.display = 'block';
}

// Open zone modal
function openZoneModal() {
    zoneModal.style.display = 'block';
}

// Open edit zone modal
function openEditZoneModal(zoneId) {
    const zone = zones.find(z => z.id === zoneId);
    if (!zone) return;
    
    document.getElementById('zone-name').value = zone.name;
    document.getElementById('zone-description').value = zone.description;
    document.getElementById('zone-flow-rate').value = zone.flowRate;
    document.getElementById('zone-area').value = zone.area;
    
    // In a real app, you would set up the form for editing
    // For now, we'll just open the modal
    openZoneModal();
}

// Close modals
function closeModals() {
    scheduleModal.style.display = 'none';
    zoneModal.style.display = 'none';
}

// Simulate weather changes that might affect irrigation
function simulateWeatherChanges() {
    // Random chance of rain that affects moisture levels
    if (Math.random() < 0.1) { // 10% chance of rain
        setTimeout(() => {
            const rainAmount = 5 + Math.random() * 20; // 5-25% moisture increase
            moistureLevel = Math.min(100, moistureLevel + rainAmount);
            addAlert('info', 'Rain Detected', 
                `Natural rainfall increased soil moisture by ${Math.round(rainAmount)}%. Irrigation adjusted automatically.`);
        }, 30000 + Math.random() * 600000); // Between 30 seconds and 10 minutes
    }
    
    // Random temperature fluctuations
    if (Math.random() < 0.3) { // 30% chance of temp change
        setTimeout(() => {
            const tempChange = (Math.random() - 0.5) * 5; // -2.5 to +2.5°C
            temperature += tempChange;
            addAlert('info', 'Temperature Change', 
                `Temperature changed by ${tempChange > 0 ? '+' : ''}${tempChange.toFixed(1)}°C.`);
        }, 60000 + Math.random() * 1200000); // Between 1 and 20 minutes
    }
    
    // Schedule next weather change
    setTimeout(simulateWeatherChanges, 1800000 + Math.random() * 3600000); // 30-90 minutes
}

// Event Listeners
addScheduleBtn.addEventListener('click', openScheduleModal);
addZoneBtn.addEventListener('click', openZoneModal);

closeModal.forEach(btn => {
    btn.addEventListener('click', closeModals);
});

window.addEventListener('click', function(event) {
    if (event.target === scheduleModal || event.target === zoneModal) {
        closeModals();
    }
});

// Schedule form submission
scheduleForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const selectedDays = Array.from(document.querySelectorAll('input[name="day"]:checked'))
        .map(checkbox => parseInt(checkbox.value));
    
    if (selectedDays.length === 0) {
        alert('Please select at least one day');
        return;
    }
    
    const newSchedule = {
        zoneId: parseInt(scheduleZoneSelect.value),
        days: selectedDays,
        time: document.getElementById('schedule-time').value,
        duration: parseInt(document.getElementById('schedule-duration').value),
        enabled: document.getElementById('schedule-enabled').checked,
        lastRun: null
    };
    
    addSchedule(newSchedule);
    scheduleForm.reset();
    closeModals();
});

// Zone form submission
zoneForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const newZone = {
        name: document.getElementById('zone-name').value,
        description: document.getElementById('zone-description').value,
        flowRate: parseFloat(document.getElementById('zone-flow-rate').value),
        area: parseInt(document.getElementById('zone-area').value)
    };
    
    addZone(newZone);
    zoneForm.reset();
    closeModals();
});

// Toast close button
document.querySelector('.toast-close').addEventListener('click', function() {
    toast.style.display = 'none';
});

// Initialize the application
init();

// Add some sample alerts
setTimeout(() => {
    addAlert('info', 'System Online', 'Smart irrigation system is now online and monitoring.');
    addAlert('success', 'Initialization Complete', 'All sensors are active and reporting data.');
}, 1000);

// Simulate occasional alerts
setInterval(() => {
    if (Math.random() < 0.2) { // 20% chance of an alert
        const alertTypes = ['info', 'warning', 'error'];
        const type = alertTypes[Math.floor(Math.random() * alertTypes.length)];
        const messages = [
            'Soil moisture level is low in Front Lawn',
            'Temperature fluctuation detected',
            'Water pressure variation noticed',
            'System performing routine self-check',
            'Weather forecast predicts rain later today'
        ];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        addAlert(type, 'System Notification', message);
    }
}, 300000); // Every 5 minutes