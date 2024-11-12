import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, doc, getDoc, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

let currentUser = null; 

const firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.appspot.com",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
};


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Wait for the authentication state to change
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        currentUser = user;  // Store the user object in the global variable
        console.log("User is signed in: ", user.displayName);
    } else {
        // No user is signed in
        currentUser = null;  // Reset the global variable when no user is signed in
        console.log("No user is signed in");
    }
});


document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('createButton');
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const eventForm = document.getElementById('eventForm');
    const cancelButton = document.querySelector('.popup button[type="button"]');
    const confirmationPopup = document.getElementById('confirmationPopup');

    createButton.addEventListener('click', openPopup);
    overlay.addEventListener('click', closePopup);
    cancelButton.addEventListener('click', closePopup);
    createIcon.addEventListener("click", openPopup)


    createButton.addEventListener('click', openPopup);
    overlay.addEventListener('click', closePopup);
    cancelButton.addEventListener('click', closePopup);

    eventForm.addEventListener('submit', async (event) => {
        event.preventDefault();
    
        // Retrieve values from form
        const title = document.getElementById('title').value;
        const picture = document.getElementById('picture').value;
        const description = document.getElementById('description').value;
        const time = document.getElementById('time').value;
        const place = document.getElementById('place').value;
        const owner = currentUser.displayName || 'Unknown Owner'; // Use the user's name or default to 'Unknown Owner'

        
        const preferences = {
            sports: document.getElementById('sports')?.checked || false,
            clubs: document.getElementById('clubs')?.checked || false,
            music: document.getElementById('music')?.checked || false,
            art: document.getElementById('art')?.checked || false,
            festivals: document.getElementById('festivals')?.checked || false,
            networking: document.getElementById('networking')?.checked || false
        };
    
        // Create a new event object
        const newEvent = {
            title,
            picture,
            description,
            time,
            place,
            owner,
            preferences,
            timestamp: serverTimestamp()
        };
        
        // Add the new event to Firestore
        try {
            await addDoc(collection(db, 'events'), newEvent);
            closePopup();
            openConfirmationPopup(newEvent);
             // Show confirmation popup immediately
            eventForm.reset(); // Reset the form fields
            setTimeout(loadEvents, 300); // Optional: delay loading to prevent conflicts
            
        } catch (error) {
            console.error("Error adding document: ", error);
        }     
       
    });

   
    document.getElementById('undoButton').addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
        overlay.style.display = 'none';
        // Additional undo logic can be added here if needed
    });

    document.getElementById('homeButton').addEventListener('click', () => {
        confirmationPopup.style.display = 'none';
        overlay.style.display = 'none';
        window.location.href = 'main.html';
    });

    // Load existing events on page load
    loadEvents();
});

function openPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function openConfirmationPopup(eventData) {
    document.getElementById('confirmTitle').innerText = eventData.title;
    document.getElementById('confirmPicture').innerText = eventData.picture;
    document.getElementById('confirmDescription').innerText = eventData.description;
    document.getElementById('confirmSettings').innerText = Object.keys(eventData.preferences)
        .filter(key => eventData.preferences[key])
        .join(', ');

    document.getElementById('confirmationPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}

async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear the container before loading events
   

    try {
        const eventsQuery = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(eventsQuery);
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventCard = document.createElement('div');
            eventCard.className = 'col-md-4'; // Bootstrap column
            eventCard.innerHTML = `
                <div class="card mb-4">
                    <img src="${eventData.picture}" class="card-img-top" alt="${eventData.title}">
                    <div class="card-body">
                        <h5 class="card-title">${eventData.title}</h5>
                        <p class="card-text">${eventData.description}</p>
                        <p class="card-text"><strong>Owner:</strong> ${eventData.owner}</p> <!-- Display owner's name -->
                        <p class="card-text"><strong>Time:</strong> ${new Date(eventData.time).toLocaleString()}</p>
                        <p class="card-text"><strong>Place:</strong> ${eventData.place}</p>
                    </div>
                </div>
            `;
            eventsContainer.appendChild(eventCard);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}


// Display dropdown on textbox click
const selectedCategoriesDisplay = document.getElementById('selectedCategoriesDisplay');
const dropdownContent = document.getElementById('dropdownContent');

selectedCategoriesDisplay.addEventListener('click', () => {
    dropdownContent.style.display = dropdownContent.style.display === 'block' ? 'none' : 'block';
});

// Function to update the textbox with selected categories
function updateSelectedCategoriesDisplay() {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    selectedCategoriesDisplay.value = selectedCategories.join(', ') || 'Select Categories';
}

// Update textbox when checkboxes are clicked
document.querySelectorAll('input[name="category"]').forEach((checkbox) => {
    checkbox.addEventListener('change', updateSelectedCategoriesDisplay);
});

// Event Listener for Submit button
document.getElementById('submitFilter').addEventListener('click', () => {
    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked')).map(cb => cb.value);
    loadFilteredEvents(selectedCategories); // Filter events based on selected categories
    dropdownContent.style.display = 'none'; // Close dropdown after submitting
});

// Event Listener for Cancel button
document.getElementById('cancelFilter').addEventListener('click', () => {
    document.querySelectorAll('input[name="category"]').forEach(cb => cb.checked = false); // Uncheck all checkboxes
    selectedCategoriesDisplay.value = 'Select Categories'; // Reset textbox display
    loadEvents(); // Show all events without filters
    dropdownContent.style.display = 'none'; // Close dropdown after cancelling
});

// Function to load filtered events
async function loadFilteredEvents(categories) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = ''; // Clear previous events

    try {
        const eventsQuery = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(eventsQuery);
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventPreferences = eventData.preferences;

            const matchesCategory = categories.some(category => eventPreferences[category.toLowerCase()]);
            const isMyEvent = categories.includes("myevents") && eventData.owner === currentUser.displayName;

            if (categories.length === 0 || matchesCategory) {
                const eventCard = document.createElement('div');
                eventCard.className = 'col-md-4';
                eventCard.innerHTML = `
                    <div class="card mb-4">
                        <img src="${eventData.picture}" class="card-img-top" alt="${eventData.title}">
                        <div class="card-body">
                            <h5 class="card-title">${eventData.title}</h5>
                            <p class="card-text">${eventData.description}</p>
                            <p class="card-text"><strong>Owner:</strong> ${eventData.owner || 'Unknown Owner'}</p>
                            <p class="card-text"><strong>Time:</strong> ${new Date(eventData.time).toLocaleString()}</p>
                            <p class="card-text"><strong>Place:</strong> ${eventData.place}</p>
                        </div>
                    </div>
                `;
                eventsContainer.appendChild(eventCard);
            }
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

async function updateNavbarProfilePicture() {
    if (!currentUser) {
        console.log("No user is logged in");
        return;
    }

    try {

        const profileSettingsRef = doc(db, 'profileSettings', currentUser.uid); 
        const profileSettingsSnap = await getDoc(profileSettingsRef);

        if (profileSettingsSnap.exists()) {
            const profileData = profileSettingsSnap.data();
            const avatarFilePath = profileData.avatar; 
            const navbarImage = document.getElementById('navProfileImage');
            const userIcon = document.querySelector('.dropdown i'); 

            if (avatarFilePath) {
                navbarImage.src = avatarFilePath; 
                navbarImage.style.display = 'block';  
                userIcon.style.display = 'none';     
            } else {
                console.log("Avatar not found for user");
            }
        } else {
            console.log("No profile settings found for user");
        }
    } catch (error) {
        console.error("Error fetching avatar: ", error);
    }
}

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;  
        updateNavbarProfilePicture();  
    } else {
        currentUser = null;
    }
});

document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('avatar');

    signOut(auth).then(() => {
        console.log('User logged out');
    });
});
