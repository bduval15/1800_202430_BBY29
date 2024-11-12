console.log("profile.js loaded");

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-auth.js";

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
        document.getElementById('userName').textContent = user.displayName || "Unknown User"; 
        
        loadProfileSettings(user.uid);
    } else {
        console.log("No user signed in.");
    }
});

async function loadProfileSettings(uid) {
    const profileRef = doc(db, "profileSettings", uid);
    try {
        const docSnap = await getDoc(profileRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("Profile settings loaded:", data);

            if (data.avatar) {
                document.getElementById("profileImage").src = data.avatar;
            }

            document.querySelector('input[name="website"]').value = data.website || "";
            document.querySelector('input[name="git"]').value = data.git || "";
            document.querySelector('input[name="email"]').value = data.email || "";
            document.querySelector('input[name="school"]').value = data.school || "";

            document.getElementById('sports').checked = data.preferences?.sports || false;
            document.getElementById('clubs').checked = data.preferences?.clubs || false;
            document.getElementById('music').checked = data.preferences?.music || false;
            document.getElementById('art').checked = data.preferences?.art || false;
            document.getElementById('festivals').checked = data.preferences?.festivals || false;
            document.getElementById('networking').checked = data.preferences?.networking || false;
        } else {
            console.log("No profile settings found.");
        }
    } catch (error) {
        console.error("Error loading profile settings:", error);
    }
}

async function saveProfileSettings() {
    console.log("Save button clicked");

    const user = auth.currentUser; 
    if (user) {
        const displayName = user.displayName || "Unknown User"; 
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

        const fname = displayName;
        
        const selectedAvatar = document.querySelector('input[name="avatar"]:checked');
        const avatarUrl = selectedAvatar ? `/images/${selectedAvatar.value}` : "";

        const data = {
            website,
            git,
            fname,
            email,
            school,
            preferences,
            avatar: avatarUrl
        };

        console.log("Data to be saved:", data);

        const profileRef = doc(db, "profileSettings", user.uid);
        try {
            await setDoc(profileRef, data, { merge: true });
            console.log("Profile settings saved successfully!");
            localStorage.setItem('fname', fname); 
        } catch (error) {
            console.error("Error saving profile settings:", error);
        }
    } else {
        console.log("User not authenticated");
    }
}

document.getElementById("profileImage").addEventListener("click", function() {
    document.getElementById("avatarModal").style.display = "flex";
});

document.querySelector(".close-button").addEventListener("click", function() {
    document.getElementById("avatarModal").style.display = "none";
});
  
document.querySelectorAll(".avatar-option").forEach(avatar => {
    avatar.addEventListener("click", function() {
        document.getElementById("profileImage").src = avatar.src;
        document.getElementById("avatarModal").style.display = "none"; 
    });
});
  
document.getElementById('saveButton').addEventListener('click', saveProfileSettings);
