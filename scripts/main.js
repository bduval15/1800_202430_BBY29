// Firebase Firestore and Authentication Setup
const db = firebase.firestore();
const auth = firebase.auth();
let currentUser = null;

// Authentication State Listener
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        console.log("User is signed in: ", user.displayName);
        updateNavbarProfilePicture();
    } else {
        currentUser = null;
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

        // Get form values
        const title = document.getElementById('title').value;
        const picture = document.getElementById('picture').value;
        const description = document.getElementById('description').value;
        const time = document.getElementById('time').value;
        const place = document.getElementById('place').value;
        const owner = currentUser.displayName || 'Unknown Owner';

        const preferences = {
            sports: document.getElementById('sports')?.checked || false,
            clubs: document.getElementById('clubs')?.checked || false,
            music: document.getElementById('music')?.checked || false,
            art: document.getElementById('art')?.checked || false,
            festivals: document.getElementById('festivals')?.checked || false,
            networking: document.getElementById('networking')?.checked || false
        };

        const newEvent = {
            title,
            picture,
            description,
            time,
            place,
            owner,
            preferences,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await db.collection('events').add(newEvent);
            closePopup();
            openConfirmationPopup(newEvent);
            eventForm.reset();
            setTimeout(loadEvents, 300);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    });

    // Confirmation Popup Controls
    document.getElementById('undoButton').addEventListener('click', closeConfirmationPopup);
    document.getElementById('homeButton').addEventListener('click', () => {
        closeConfirmationPopup();
        window.location.href = 'main.html';
    });

    // Load initial events
    loadEvents();
});

window.addEventListener('load', function() {
    // Check if the "create event" form should be opened
    const shouldOpenForm = localStorage.getItem('openCreateEventForm');
    console.log("Should open form: ", shouldOpenForm); // Debug log to check the flag value

    if (shouldOpenForm === 'true') {
        // Open the create event form
        openCreateEventForm(); // This function will show the form
        // Reset the flag after the form is shown
        localStorage.removeItem('openCreateEventForm');
    }
});

// Function to show the create event form (popup)
function openCreateEventForm() {
    const popup = document.getElementById('popup'); // Reference the form by its ID 'popup'
    if (popup) {
        popup.style.display = 'block'; // Show the popup (or use any other logic)
        console.log("Create Event Popup is now visible.");
    } else {
        console.log("Create Event Popup not found!");
    }
}


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

function closeConfirmationPopup() {
    document.getElementById('confirmationPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Load Events from Firestore
async function loadEvents() {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';

    try {
        const snapshot = await db.collection('events').orderBy('timestamp', 'desc').get();
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            displayEvent(eventData, eventsContainer);
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Display Single Event
function displayEvent(eventData, container) {
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
    container.appendChild(eventCard);
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

// Load Filtered Events
async function loadFilteredEvents(categories) {
    const eventsContainer = document.getElementById('events-container');
    eventsContainer.innerHTML = '';

    try {
        const eventsQuery = db.collection('events').orderBy('timestamp', 'desc');
        const snapshot = await eventsQuery.get();
        
        snapshot.forEach((doc) => {
            const eventData = doc.data();
            const matchesCategory = categories.some(category => eventData.preferences[category.toLowerCase()]);
            const isMyEvent = categories.includes("myevents") && eventData.owner === (currentUser?.displayName || "");

            if (categories.length === 0 || matchesCategory || isMyEvent) {
                displayEvent(eventData, eventsContainer);
            }
        });
    } catch (error) {
        console.error("Error getting documents: ", error);
    }
}

// Update Navbar Profile Picture
async function updateNavbarProfilePicture() {
    if (!currentUser) return;

    try {
        const profileSettingsRef = db.collection('profileSettings').doc(currentUser.uid);
        const profileSettingsSnap = await profileSettingsRef.get();

        if (profileSettingsSnap.exists) {
            const profileData = profileSettingsSnap.data();
            const avatarFilePath = profileData.avatar;
            const navbarImage = document.getElementById('navProfileImage');
            const userIcon = document.querySelector('.dropdown i');

            if (avatarFilePath) {
                navbarImage.src = avatarFilePath;
                navbarImage.style.display = 'block';
                userIcon.style.display = 'none';
            }
        }
    } catch (error) {
        console.error("Error fetching avatar: ", error);
    }
}

// Logout Function
document.getElementById('logoutButton').addEventListener('click', () => {
    localStorage.removeItem('avatar');
    auth.signOut()
        .then(() => console.log('User logged out'))
        .catch((error) => console.error("Logout error: ", error));
});

