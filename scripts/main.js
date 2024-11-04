import { initializeApp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";
import { serverTimestamp } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-firestore.js";



// Initialize Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.appspot.com",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
};

// Initialize Firebase
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
    cancelButton.addEventListener('click', closePopup); // Add event listener to cancel button

    document.getElementById('eventForm').addEventListener('submit', async (event) => {
        event.preventDefault(); 

        // Retrieve values from form
        const title = document.getElementById('title').value;
        const picture = document.getElementById('picture').value;
        const description = document.getElementById('description').value;
        const time = document.getElementById('time').value;
        const place = document.getElementById('place').value;

        // Create a new event object
        const newEvent = {
            title: title,
            picture: picture,
            description: description,
            time: time,
            place: place,
            timestamp: serverTimestamp()
        };

        // Add the new event to Firestore
        try {
            await db.collection('events').add(newEvent);
            closePopup();
            eventForm.reset(); // Reset the form
            loadEvents(); // Reload events to display the new one
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    });

    // Load existing events on page load
    loadEvents();
});
// Function to open the popup
function openPopup() {
    overlay.style.display = 'block';
    popup.style.display = 'block';
}

// Function to close the popup
function closePopup() {
    overlay.style.display = 'none';
    popup.style.display = 'none';
}

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
