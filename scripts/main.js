import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";


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

document.addEventListener('DOMContentLoaded', () => {
    const createButton = document.getElementById('createButton');
    const overlay = document.getElementById('overlay');
    const popup = document.getElementById('popup');
    const eventForm = document.getElementById('eventForm');
    const cancelButton = document.querySelector('.popup button[type="button"]');

    createButton.addEventListener('click', openPopup);
    overlay.addEventListener('click', closePopup);
    cancelButton.addEventListener('click', closePopup);
    createIcon.addEventListener("click", openPopup)
    const confirmationPopup = document.getElementById('confirmationPopup');

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
    
        const owner = localStorage.getItem('fname') || 'Unknown Owner';
        
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
            closePopup(); // Close the event creation form popup
            eventForm.reset(); // Reset the form fields
            loadEvents(); // Reload events to display the new one
    
            // Show confirmation popup with the event details
            openConfirmationPopup(newEvent); // Display the confirmation popup
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
    // Populate the confirmation popup with event details
    document.getElementById('confirmTitle').innerText = eventData.title;
    document.getElementById('confirmPicture').innerText = eventData.picture;
    document.getElementById('confirmDescription').innerText = eventData.description;
    document.getElementById('confirmSettings').innerText = Object.keys(eventData.preferences)
        .filter(key => eventData.preferences[key])
        .join(', ');

    // Show the confirmation popup and overlay
    document.getElementById('confirmationPopup').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
}


// Function to load events from Firestore
// Function to load events from Firestore
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
                        <p class="card-text"><strong>Owner:</strong> ${eventData.owner || 'Unknown Owner'}</p>
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
    eventsContainer.innerHTML = ''; // Clear the container before loading events

    try {
        const eventsQuery = query(collection(db, 'events'), orderBy('timestamp', 'desc'));
        const snapshot = await getDocs(eventsQuery);
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const eventPreferences = eventData.preferences;

            // Check if the event matches any selected categories
            const matchesCategory = categories.some(category => eventPreferences[category.toLowerCase()]);

            if (categories.length === 0 || matchesCategory) { // Show all if no category selected
                const eventCard = document.createElement('div');
                eventCard.className = 'col-md-4'; // Bootstrap column
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