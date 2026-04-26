/*
PART 2: Geolocation API Implementation
*/
const geoOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
};

function trackLocation() {
    const statusDisplay = document.getElementById('status');
    
    if (!navigator.geolocation) {
        return handleGeoError({ code: 0, message: "Geolocation not supported" });
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            // Sanitize coordinates to prevent injection/formatting issues
            statusDisplay.textContent = `Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
            console.log("Location successfully retrieved.");
        },
        handleGeoError,
        geoOptions
    );
}

function handleGeoError(error) {
    const errorMap = {
        0: "Unknown error occurred.",
        1: "Permission denied by user.",
        2: "Position unavailable.",
        3: "Request timed out."
    };
    const msg = errorMap[error.code] || error.message;
    document.getElementById('status').textContent = `Geo Error: ${msg}`;
    console.error(`Geo Error (${error.code}): ${msg}`);
}

/*
PART 3: Storage APIs (Local Storage)
*/
const ZOO_STORAGE_KEY = 'zoo_animals';

const ZooStorage = {
    // Create or Update an animal record
    saveAnimal(animalObj) {
        try {
            const animals = this.getAllAnimals();
            const index = animals.findIndex(a => a.id === animalObj.id);
            
            if (index !== -1) {
                animals[index] = animalObj;
                console.log(`Updated animal: ${animalObj.name}`);
            } else {
                animals.push(animalObj);
                console.log(`Added new animal: ${animalObj.name}`);
            }
            
            localStorage.setItem(ZOO_STORAGE_KEY, JSON.stringify(animals));
        } catch (e) {
            this.handleStorageError(e);
        }
    },

    // Retrieve all records
    getAllAnimals() {
        try {
            const data = localStorage.getItem(ZOO_STORAGE_KEY);
            return data ? JSON.parse(data) : [];
        } catch (e) {
            console.error("Failed to parse storage data:", e);
            return [];
        }
    },

    handleStorageError(e) {
        if (e.name === 'QuotaExceededError') {
            const statusDisplay = document.getElementById('errors');
            statusDisplay.textContent = "Storage full! Please clear some animal records.";
        }
        console.error("Storage Error Detail:", e.message);
    }
};

/*
PART 3: Session Storage & Rate Limiting
*/
function checkRateLimit() {
    const now = Date.now();
    const lastCall = sessionStorage.getItem('last_api_call');
    
    // Session-based rate limiting (1 request every 5 seconds)
    if (lastCall && (now - lastCall < 5000)) {
        console.warn("Rate limit exceeded. Slow down, zookeeper!");
        return false;
    }
    
    sessionStorage.setItem('last_api_call', now);
    return true;
}

/*
PART 4: Testing, Debugging, and Initialization
*/
async function initApp() {
    // 1. Monitor Offline Status
    window.addEventListener('online', () => console.log("Network restored."));
    window.addEventListener('offline', () => console.warn("Network lost. Working in offline mode."));

    // 2. Load Initial Data if LocalStorage is empty
    if (ZooStorage.getAllAnimals().length === 0) {
        try {
            const response = await fetch('data.json');
            const initialData = await response.json();
            initialData.forEach(animal => ZooStorage.saveAnimal(animal));
            console.log("Initial zoo data loaded from data.json");
        } catch (err) {
            console.error("Could not load initial data.json:", err);
        }
    }

    // 3. Start Location Tracking
    if (checkRateLimit()) {
        trackLocation();
    }

    // 4. Test an "Update" scenario
    const animals = ZooStorage.getAllAnimals();
    if (animals.length > 0) {
        const firstAnimal = animals[0];
        firstAnimal.age += 1;
        ZooStorage.saveAnimal(firstAnimal);
    }
}

// Start the application
initApp();