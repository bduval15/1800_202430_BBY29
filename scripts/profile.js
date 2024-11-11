console.log("profile.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js"; // Add onAuthStateChanged

const firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.firebasestorage.app",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app); 
const auth = getAuth(app);

console.log("Firebase app initialized");

onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is signed in:", user.displayName);
        document.getElementById('userName').textContent = user.displayName || "Unknown User"; // Set display name
    } else {
        console.log("No user signed in.");
    }
});

async function saveProfileSettings() {
    console.log("Save button clicked");

    const user = auth.currentUser; 
    if (user) {
        // Collect profile data from form
        const displayName = user.displayName || "Unknown User"; // Default if no displayName
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

        const fname = displayName; // Use displayName from user

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
            localStorage.setItem('fname', fname); // Save fname in localStorage
        } catch (error) {
            console.error("Error saving profile settings:", error);
        }
    } else {
        console.log("User not authenticated");
    }
}

document.getElementById('saveButton').addEventListener('click', saveProfileSettings);
