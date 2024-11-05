console.log("profile.js loaded");

// Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.1.3/firebase-auth.js";

// Firebase configuration
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

async function saveProfileSettings() {

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

    const docRef = doc(db, "profileSettings", "dDpB8KYPNodX8mfHphS9"); 
    
    const data = {
        website,
        git,
        fname,
        email,
        school,
        preferences 
    };

    try {
        await setDoc(docRef, data);
        console.log("Profile settings saved successfully!");

        localStorage.setItem('fname', fname);
    } catch (error) {
        console.error("Error saving profile settings: ", error);
    }
}
document.getElementById('saveButton').addEventListener('click', saveProfileSettings);






