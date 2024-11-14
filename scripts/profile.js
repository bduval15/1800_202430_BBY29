// Ensure Firebase has been initialized (this script should run after `firebase-config.js`)
console.log("profile.js loaded");
console.log("Firebase app initialized");

var auth = firebase.auth();  // Firebase v8 auth

auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.displayName);
        document.getElementById('userName').textContent = user.displayName || "Unknown User"; 

        loadProfileSettings(user.uid);
        updateNavbarProfilePicture();
    } else {
        console.log("No user signed in.");
    }
});

function loadProfileSettings(uid) {
    var profileRef = window.db.collection("profileSettings").doc(uid);
    profileRef.get().then((docSnap) => {
        if (docSnap.exists) {
            var data = docSnap.data();
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
    }).catch((error) => {
        console.error("Error loading profile settings:", error);
    });
}

function saveProfileSettings() {
    console.log("Save button clicked");

    var user = auth.currentUser; 
    if (user) {
        var displayName = user.displayName || "Unknown User"; 
        var website = document.querySelector('input[name="website"]').value;
        var git = document.querySelector('input[name="git"]').value;
        var email = document.querySelector('input[name="email"]').value;
        var school = document.querySelector('input[name="school"]').value;

        var preferences = {
            sports: document.getElementById('sports').checked,
            clubs: document.getElementById('clubs').checked,
            music: document.getElementById('music').checked,
            art: document.getElementById('art').checked,
            festivals: document.getElementById('festivals').checked,
            networking: document.getElementById('networking').checked
        };

        var fname = displayName;

        var selectedAvatar = document.querySelector('input[name="avatar"]:checked');
        var avatarUrl = selectedAvatar ? `/images/${selectedAvatar.value}` : "";

        var data = {
            website,
            git,
            fname,
            email,
            school,
            preferences,
            avatar: avatarUrl
        };

        console.log("Data to be saved:", data);

        var profileRef = window.db.collection("profileSettings").doc(user.uid);
        profileRef.set(data, { merge: true }).then(() => {
            console.log("Profile settings saved successfully!");
            localStorage.setItem('fname', fname); 
        }).catch((error) => {
            console.error("Error saving profile settings:", error);
        });
    } else {
        console.log("User not authenticated");
    }
}

function updateNavbarProfilePicture() {
    var user = auth.currentUser; 
    if (!user) {
        console.log("No user is logged in");
        return;
    }

    var profileSettingsRef = window.db.collection('profileSettings').doc(user.uid);
    profileSettingsRef.get().then((profileSettingsSnap) => {
        if (profileSettingsSnap.exists) {
            var profileData = profileSettingsSnap.data();
            console.log("Profile Data:", profileData);

            var avatarFilePath = profileData.avatar;
            var navbarImage = document.getElementById("navProfileImage");
            var userIcon = document.querySelector('.dropdown i');

            if (avatarFilePath) {
                console.log("Avatar File Path:", avatarFilePath);
                navbarImage.src = avatarFilePath;
                navbarImage.style.display = 'block'; 
                if (userIcon) {
                    userIcon.style.display = 'none'; 
                }
                console.log("Navbar Image URL updated:", avatarFilePath);
            } else {
                console.log("No avatar file path found for user");
            }
        } else {
            console.log("No profile settings found for user");
        }
    }).catch((error) => {
        console.error("Error fetching avatar: ", error);
    });
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

window.addEventListener('load', function() {
    const createIcon = document.getElementById('createIcon');

    createIcon.addEventListener('click', function(event) {
        // Prevent default anchor behavior (it would scroll to the #add section)
        event.preventDefault();

        // Set the flag in localStorage to notify the main page
        localStorage.setItem('openCreateEventForm', 'true');

        // Redirect to the main page
        window.location.href = '/main.html'; // Ensure this is the correct path
    });
});


