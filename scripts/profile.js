console.log("profile.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; // Make sure the version matches

const firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.firebasestorage.app",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
console.log("Firebase app initialized");

const db = getFirestore(app); // Initialize Firestore
const auth = getAuth(app); // Initialize Auth
console.log("Auth initialized");

async function saveProfileSettings() {
    console.log("Save button clicked");

    // Retrieve the current user
    const user = auth.currentUser; 
    if (user) {
        console.log("User is authenticated:", user.uid);

        // Retrieve fname from the text content of the element
        const fname = document.getElementById('fname').textContent;
        console.log("Retrieved fname:", fname);

        const website = document.querySelector('input[name="website"]').value;
        const git = document.querySelector('input[name="git"]').value;
        const email = document.querySelector('input[name="email"]').value;
        const school = document.querySelector('input[name="school"]').value;

        const preferences = {
            sports: document.getElementById('sports').checked,
            clubs: document.getElementById('clubs').checked,
            music: document.getElementById('music').checked,
            art: document.getElementById('art').checked,
            festivals: document.getElementById('festivals').checked,
            networking: document.getElementById('networking').checked
        };

        const data = {
            website,
            git,
            fname, 
            email,
            school,
            preferences
        };

        console.log("Data to be saved:", data);

        const profileRef = doc(db, "profileSettings", user.uid);
        try {
            await setDoc(profileRef, data);
            console.log("Profile settings saved successfully!");
            localStorage.setItem('fname', fname);
        } catch (error) {
            console.error("Error saving profile settings:", error);
        }
    } else {
        console.log("User not authenticated");
    }
}

// Event listener for the save button
document.getElementById('saveButton').addEventListener('click', saveProfileSettings);
