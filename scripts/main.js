// ========================== AUTHENTICATION ==========================
const db = firebase.firestore();
const auth = firebase.auth();
let currentUser = null;
let tempEventData = null; 

auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        console.log("User is signed in:", user.displayName);
        updateNavbarProfilePicture();
    } else {
        currentUser = null;
        console.log("No user is signed in");
    }
});

const eventCategoryImages = {
    sports: "/images/events/sports.jpg",
    clubs: "/images/events/clubs.jpg",
    music: "/images/events/music.jpg",
    art: "/images/events/art.jpg",
    festivals: "/images/events/festivals.jpg",
    networking: "/images/events/networking.jpg",
    other: "/images/events/other.jpg",
    default: "/images/events/default.jpg" // Fallback image if no category matches
};

// DOMContentLoaded Listener
document.addEventListener('DOMContentLoaded', () => {
    initializeEventHandlers();
    loadFilteredEvents();

    // Open event creation form if flagged in localStorage
    const shouldOpenForm = localStorage.getItem('openCreateEventForm');
    if (shouldOpenForm === 'true') {
        openPopup();
        localStorage.removeItem('openCreateEventForm');
    }
});

// Initialization and Event Handlers
function initializeEventHandlers() {
    // Open/close event creation popup
    document.getElementById('createButton')?.addEventListener('click', openPopup);
    document.getElementById('overlay')?.addEventListener('click', closePopup);
    document.getElementById('createIcon')?.addEventListener("click", openPopup);

    // Form submission
    document.getElementById('eventForm')?.addEventListener('submit', handleFormSubmit);

    // Confirmation Popup Controls
    document.getElementById('undoButton')?.addEventListener('click', handleUndo);
    document.getElementById('homeButton')?.addEventListener('click', () => {
        closeConfirmationPopup();
        window.location.href = 'main.html'; 
    });

    // Live preview for event image based on category selection
    document.querySelectorAll('input[name="preferences"]').forEach((checkbox) => {
        checkbox.addEventListener('change', () => {
            const selectedCategory = document.querySelector('input[name="preferences"]:checked')?.value || "default";
            const previewImage = document.getElementById('eventPreviewImage');
            if (previewImage) {
                previewImage.src = eventCategoryImages[selectedCategory] || eventCategoryImages.default;
            }
        });
    });

}

// Popup Controls
function openPopup() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('popup').style.display = 'block';

    const radios = document.querySelectorAll('input[name="preferences"]');
    radios.forEach(radio => {
        radio.checked = false;
    });
}

function closePopup() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('popup').style.display = 'none';
}

function openConfirmationPopup(eventData) {
    const confirmationPopup = document.getElementById('confirmationPopup');
    const overlay = document.getElementById('overlay');

    // Elements to populate
    const confirmImage = document.getElementById('confirmImage');
    const confirmTitle = document.getElementById('confirmTitle');
    const confirmOwner = document.getElementById('confirmOwner');
    const confirmDate = document.getElementById('confirmDate');
    const confirmDescription = document.getElementById('confirmDescription');

    // Check if the popup elements exist
    if (confirmationPopup && overlay && confirmImage && confirmTitle && confirmOwner && confirmDate && confirmDescription) {
        // Populate modal with event details
        confirmImage.src = eventData.picture || '/images/events/default.jpg'; // Default fallback image
        confirmTitle.innerText = eventData.title || 'No Title Provided';
        confirmOwner.innerText = eventData.owner || 'Unknown Owner';

        // Format the date based on its type
        let eventDate = 'No Date Provided';
        if (eventData.time) {
            if (eventData.time.toDate) {
                // Firestore Timestamp
                eventDate = eventData.time.toDate().toLocaleString();
            } else {
                // String or Date object
                eventDate = new Date(eventData.time).toLocaleString();
            }
        }
        confirmDate.innerText = eventDate;

        confirmDescription.innerText = eventData.description || 'No Description Provided';

        // Show the modal
        confirmationPopup.style.display = 'block';
        overlay.style.display = 'block';
    } else {
        console.error('Error: One or more popup elements not found!');
    }
}



function closeConfirmationPopup() {
    document.getElementById('confirmationPopup').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

// Event Form Handling
async function handleFormSubmit(event) {
    event.preventDefault();

    const title = document.getElementById('title')?.value || '';
    const description = document.getElementById('description')?.value || '';
    const time = document.getElementById('time')?.value ? firebase.firestore.Timestamp.fromDate(new Date(document.getElementById('time').value)) : null;
    const place = document.getElementById('place')?.value || '';
    const owner = currentUser?.displayName || 'Unknown Owner';

    // Get the selected category and corresponding image path
    const selectedCategory = document.querySelector('input[name="preferences"]:checked')?.value || 'default';
    const picture = eventCategoryImages[selectedCategory] || eventCategoryImages.default;

    // Create the new event object
    const newEvent = {
        title,
        picture, // Store the category-based image path
        description,
        time,
        place,
        owner,
        preferences: selectedCategory, // Store the selected category
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    };

    try {
        let docRef;
        if (tempEventData && tempEventData.id) {
            await db.collection('events').doc(tempEventData.id).set(newEvent, { merge: true });
            console.log('Event updated in Firestore!');
            newEvent.id = tempEventData.id;
        } else {
            docRef = await db.collection('events').add(newEvent);
            console.log('Event added to Firestore with ID:', docRef.id);
            newEvent.id = docRef.id;
        }

        closePopup();
        openConfirmationPopup(newEvent);
        event.target.reset(); // Reset the form for a new event
        tempEventData = newEvent;
    } catch (error) {
        console.error('Error adding or updating event:', error);
    }
}


function handleUndo() {
    if (!tempEventData) {
        console.error("No event data to undo!");
        return;
    }

    console.log("Undoing event data:", tempEventData);

    // Safely populate form fields
    const titleElement = document.getElementById('title');
    if (titleElement) titleElement.value = tempEventData.title || '';

    const pictureElement = document.getElementById('picture');
    if (pictureElement) pictureElement.value = tempEventData.picture || '';

    const descriptionElement = document.getElementById('description');
    if (descriptionElement) descriptionElement.value = tempEventData.description || '';

    const timeElement = document.getElementById('time');
    if (timeElement) {
        // Ensure the time is in the correct ISO format (YYYY-MM-DDTHH:mm)
        timeElement.value = tempEventData.time
            ? new Date(tempEventData.time).toISOString().slice(0, 16)
            : '';
    }

    const placeElement = document.getElementById('place');
    if (placeElement) placeElement.value = tempEventData.place || '';

    // Update preferences (radio buttons)
    document.querySelectorAll('input[name="preferences"]').forEach((radio) => {
        radio.checked = tempEventData.preferences === radio.value;
    });

    closeConfirmationPopup();
    openPopup();
}

// Navbar Profile Picture
async function updateNavbarProfilePicture() {
    if (!currentUser) return;

    try {
        const profileSettingsSnap = await db.collection('profileSettings').doc(currentUser.uid).get();
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
        console.error("Error fetching avatar:", error);
    }
}

async function loadFilteredEvents(categories = []) {
    const eventsContainer = document.getElementById('events-container');
    const upcomingHeader = document.getElementById('upcoming');
    eventsContainer.innerHTML = ''; // Clear existing events

    try {
        let userPreferences = [];

        // Check if "mypreferences" (For You) is included
        if (categories.includes('mypreferences') && currentUser) {
            const profileDoc = await db.collection('profileSettings').doc(currentUser.uid).get();
            if (profileDoc.exists) {
                const preferencesObject = profileDoc.data().preferences || {};
                userPreferences = Object.keys(preferencesObject).filter(key => preferencesObject[key]);
                console.log("User Preferences:", userPreferences);
            } else {
                console.warn("No preferences found for the user.");
            }
        }

        // Default to "All Events" if no categories are active
        if (categories.length === 0) {
            upcomingHeader.innerText = "All Events"; // Default header
        } else {
            const categoryLabels = {
                myevents: "My Events",
                mypreferences: "Recommended for You",
                sports: "Sports",
                clubs: "Clubs",
                music: "Music",
                art: "Art",
                festivals: "Festivals",
                networking: "Networking"
            };

            // Generate a header string for active filters
            const activeCategoryLabels = categories.map(cat => categoryLabels[cat] || cat);
            upcomingHeader.innerText = activeCategoryLabels.join(" / ");
        }

        // Fetch events from Firestore
        const snapshot = await db.collection('events').orderBy('timestamp', 'desc').get();

        if (snapshot.empty) {
            console.warn("No events found in the database.");
            return;
        }

        snapshot.forEach((doc) => {
            const eventData = doc.data();

            // Check if the event matches any selected category
            const matchesCategory = categories.some(category =>
                eventData.preferences && eventData.preferences.toLowerCase() === category
            );

            // Check if the event matches user preferences (For You)
            const matchesUserPreferences = userPreferences.some(preference =>
                eventData.preferences && eventData.preferences.toLowerCase() === preference.toLowerCase()
            );

            // Check if the event belongs to the current user (My Events filter)
            const isMyEvent = categories.includes('myevents') &&
                eventData.owner === (currentUser?.displayName || '');

            // Display the event if it matches any filter or if no filters are active
            if (
                categories.length === 0 || // Show all events if no filters are active
                matchesCategory ||
                (categories.includes('mypreferences') && matchesUserPreferences) ||
                isMyEvent
            ) {
                displayEvent(eventData, eventsContainer);
            }
        });
    } catch (error) {
        console.error("Error loading filtered events:", error);
    }
}


function displayEvent(eventData, container) {
    const fallbackImage = '/images/events/default.jpg';
    const imagePath = eventData.picture || fallbackImage;

    console.log('Event Data:', eventData);
    console.log('Image Path Used:', imagePath);

    const eventCard = document.createElement('div');
    eventCard.className = 'col-md-4';

    // Handle time formatting
    let formattedTime = 'No Date Provided';
    if (eventData.time) {
        const eventDate = eventData.time.toDate ? eventData.time.toDate() : new Date(eventData.time);
        formattedTime = eventDate.toLocaleString();
    }

    eventCard.innerHTML = `
        <div class="card mb-4">
            <img src="${imagePath}" class="card-img-top" alt="${eventData.title}">
            <div class="card-body">
                <h5 class="card-title">${eventData.title}</h5>
                <p class="card-text">${eventData.description}</p>
                <p class="card-text"><strong>Owner:</strong> ${eventData.owner || 'Unknown Owner'}</p>
                <p class="card-text"><strong>Time:</strong> ${formattedTime}</p>
                <p class="card-text"><strong>Place:</strong> ${eventData.place}</p>
            </div>
        </div>
    `;
    container.appendChild(eventCard);

    eventCard.addEventListener('click', () => {
        openEventDetailPopup(eventData);
    });
    
}

function openEventDetailPopup(eventData) {
    const popup = document.getElementById('eventDetailPopup');
    document.getElementById('eventTitle').innerText = eventData.title || 'No Title';
    document.getElementById('eventImage').src = eventData.picture || '/images/events/default.jpg';
    document.getElementById('eventDescription').innerText = eventData.description || 'No Description';
    document.getElementById('eventTime').innerText = new Date(eventData.time).toLocaleString() || 'No Time';
    document.getElementById('eventPlace').innerText = eventData.place || 'No Place';
    document.getElementById('eventCategory').innerText = eventData.preferences || 'No Category';
    document.getElementById('eventOwner').innerText = eventData.owner || 'Unknown Owner';

    // Manage attendance
    const attendeeCount = eventData.attendees?.length || 0;
    document.getElementById('eventAttendeesCount').innerText = attendeeCount;

    const joinButton = document.getElementById('joinEventButton');
    const leaveButton = document.getElementById('leaveEventButton');
    if (eventData.attendees?.includes(currentUser.uid)) {
        joinButton.style.display = 'none';
        leaveButton.style.display = 'block';
    } else {
        joinButton.style.display = 'block';
        leaveButton.style.display = 'none';
    }

    joinButton.onclick = () => handleAttendance(eventData, true);
    leaveButton.onclick = () => handleAttendance(eventData, false);

    // Load additional pictures
    const gallery = document.getElementById('eventGallery');
    gallery.innerHTML = ''; // Clear existing images
    (eventData.pictures || []).forEach((pic) => {
        const img = document.createElement('img');
        img.src = pic;
        gallery.appendChild(img);
    });

    // Load comments
    const commentsSection = document.getElementById('commentsSection');
    commentsSection.innerHTML = ''; // Clear existing comments
    (eventData.comments || []).forEach((comment) => {
        const commentElement = document.createElement('p');
        commentElement.innerText = `${comment.user}: ${comment.text}`;
        commentsSection.appendChild(commentElement);
    });

    const postButton = document.getElementById('postCommentButton');
    postButton.onclick = () => postComment(eventData);

    popup.style.display = 'block';
}

function handleAttendance(eventData, isJoining) {
    const eventRef = db.collection('events').doc(eventData.id);
    eventRef.update({
        attendees: isJoining
            ? firebase.firestore.FieldValue.arrayUnion(currentUser.uid)
            : firebase.firestore.FieldValue.arrayRemove(currentUser.uid),
    }).then(() => {
        console.log(isJoining ? 'Joined event' : 'Left event');
        openEventDetailPopup({ ...eventData, attendees: isJoining 
            ? [...(eventData.attendees || []), currentUser.uid] 
            : (eventData.attendees || []).filter(uid => uid !== currentUser.uid) });
    }).catch(console.error);
}

function postComment(eventData) {
    const commentInput = document.getElementById('commentInput');
    const comment = commentInput.value.trim();
    if (!comment) return;

    const eventRef = db.collection('events').doc(eventData.id);
    eventRef.update({
        comments: firebase.firestore.FieldValue.arrayUnion({
            user: currentUser.displayName,
            text: comment,
        }),
    }).then(() => {
        commentInput.value = '';
        openEventDetailPopup({
            ...eventData,
            comments: [...(eventData.comments || []), { user: currentUser.displayName, text: comment }],
        });
    }).catch(console.error);
}


// Keep Track of Active Filters 
document.addEventListener('DOMContentLoaded', () => {
    const activeFilters = new Set(); 

    document.querySelectorAll('.row .col-3').forEach((category) => {
        category.addEventListener('click', () => {
            const selectedCategory = category.querySelector('p').textContent.trim().toLowerCase().replace(' ', '');

            const categoryKey = selectedCategory === 'foryou' ? 'mypreferences' : selectedCategory;

            if (activeFilters.has(categoryKey)) {
                activeFilters.delete(categoryKey);
                category.classList.remove('active');
                console.log(`Deactivated Filter: ${categoryKey}`);
            } else {
                activeFilters.add(categoryKey);
                category.classList.add('active');
                console.log(`Activated Filter: ${categoryKey}`);
            }

            loadFilteredEvents([...activeFilters]);
        });
    });
});

function updateSelectedCategoriesDisplay() {
    const categoryLabels = {
        myevents: "My Events",
        mypreferences: "For You",
        sports: "Sports",
        clubs: "Clubs",
        music: "Music",
        art: "Art",
        festivals: "Festivals",
        networking: "Networking"
    };

    const selectedCategories = Array.from(document.querySelectorAll('input[name="category"]:checked'))
        .map(cb => categoryLabels[cb.value] || cb.value);

    document.getElementById('selectedCategoriesDisplay').value = selectedCategories.join(', ') || 'Select Categories';
}

// Logout
document.getElementById('logoutButton')?.addEventListener('click', () => {
    localStorage.removeItem('avatar');
    auth.signOut()
        .then(() => console.log('User logged out'))
        .catch((error) => console.error("Logout error:", error));
});

// this function is called automatically each time the page loads to clean up firestore of old events
var THRESHOLD_HOURS = 1; // Set the threshold to 1 hour
function removeOldEvents() {
    db.collection("events")
        .get()
        .then(function (list) {
            list.forEach(function (doc) {
                // Get the current time
                let d1 = new Date();
                // Get the event's scheduled time (time of the event) and convert it to JS Date object
                let d2 = doc.data().time.toDate(); 

                // Calculate the "time difference" between the current time and event's scheduled time
                const timeDifference = Math.abs(d1 - d2);

                // Convert milliseconds to hours
                const hoursDifference = timeDifference / (1000 * 60 * 60);

                // Check if the time difference is greater than the threshold (1 hour) 
                // and if the event's scheduled time has already passed
                if (hoursDifference > THRESHOLD_HOURS && d1 > d2) {
                    db.collection("events").doc(doc.id).delete()
                        .then(() => {
                            console.log(`Deleted event: ${doc.id}`);
                            // Optionally, refresh the page after deletion
                            location.reload();
                        })
                        .catch((error) => console.error(`Error deleting event ${doc.id}:`, error));
                }
            });
        })
        .catch((error) => console.error("Error fetching events: ", error));
}
removeOldEvents();

function togglePriceInput() {
    const freeOption = document.getElementById('free');
    const priceInput = document.getElementById('priceInput');

    if (freeOption.checked) {
        priceInput.disabled = true; // Disable the input if "Free" is selected
        priceInput.value = ''; // Clear the input value
    } else {
        priceInput.disabled = false; // Enable the input if "Paid" is selected
    }
}



