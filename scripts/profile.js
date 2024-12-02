console.log("profile.js loaded");
console.log("Firebase app initialized");

var auth = firebase.auth(); // Firebase v8 auth
window.db = firebase.firestore(); // Ensure Firestore is initialized

// 1. Initializes Firebase and loads user-specific data (e.g., profile settings, created events).
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM fully loaded and parsed");

    // Listen for authentication state changes
    auth.onAuthStateChanged((user) => {
        if (user) {
            console.log("User is signed in:", user.displayName);
            document.getElementById('userName').textContent = user.displayName || "Unknown User";
            populateEmail(user.uid);
            loadProfileSettings(user.uid);
            updateNavbarProfilePicture();
        } else {
            console.log("No user signed in.");
        }
    });
});

// 13. Formats a Firebase Timestamp or JavaScript Date into a readable string.
function formatTimestamp(timestamp) {
    if (!timestamp) return "No Time Provided";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const options = { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric", hour12: true };
    return date.toLocaleString("en-US", options);
}

// 14. Formats a price as a CAD currency string or returns "Free" if the price is not provided.
function formatPrice(price) {
    if (!price || price === "Free" || price === 0) return "Free";
    return `${new Intl.NumberFormat('en-CA', { style: 'currency', currency: 'CAD' }).format(price)} / Person`;
}


// 1. Fetches the user's profile settings from Firestore using their UID.
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

// 2. Saves updated profile settings to Firestore.
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
        var avatarUrl = selectedAvatar ? `/images/profilePics/${selectedAvatar.value}` : "";

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
            location.reload();
        }).catch((error) => {
            console.error("Error saving profile settings:", error);
        });
    } else {
        console.log("User not authenticated");
    }
}

// 3. Updates the navbar with the user's avatar if available.
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

// 4. Fetches and populates the user's email address in the form.
function populateEmail(uid) {
    console.log("Fetching email for UID:", uid);

    var userRef = window.db.collection("users").doc(uid);
    userRef.get().then((docSnap) => {
        if (docSnap.exists) {
            var data = docSnap.data();
            if (data.email) {
                console.log("Email fetched from users collection:", data.email);
                const emailInput = document.getElementById("emailInput");
                if (emailInput) {
                    emailInput.value = data.email;
                } else {
                    console.error("emailInput element not found in the DOM.");
                }
            } else {
                console.log("No email field found in users collection.");
            }
        } else {
            console.log("No document found in users collection for the user.");
        }
    }).catch((error) => {
        console.error("Error fetching email from users collection:", error);
    });
}

// Event listeners
document.getElementById("profileImage").addEventListener("click", function () {
    document.getElementById("avatarModal").style.display = "flex";
});

document.querySelector(".close-button").addEventListener("click", function () {
    document.getElementById("avatarModal").style.display = "none";
});

document.querySelectorAll(".avatar-option").forEach(avatar => {
    avatar.addEventListener("click", function () {
        document.getElementById("profileImage").src = avatar.src;
        document.getElementById("avatarModal").style.display = "none";
    });
});

document.getElementById("myevents-tab").addEventListener("click", () => {
    loadMyEvents();
});

document.addEventListener("DOMContentLoaded", () => {
    const likesTab = document.getElementById("likes-tab");

    if (likesTab) {
        likesTab.addEventListener("click", () => {
            displayUserLikedEvents();
        });
    }
});

document.getElementById('saveButton').addEventListener('click', saveProfileSettings);

window.addEventListener('load', function () {
    const createIcon = document.getElementById('createIcon');

    createIcon.addEventListener('click', function (event) {
        event.preventDefault();
        localStorage.setItem('openCreateEventForm', 'true');
        window.location.href = '/main.html';
    });
});

// Save profile picture immediately when a new one is selected
document.querySelectorAll(".avatar-option").forEach((avatar) => {
    avatar.addEventListener("click", function () {
        const selectedAvatar = avatar.src;

        // Convert full URL to relative path
        const baseUrl = window.location.origin;
        const relativePath = selectedAvatar.startsWith(baseUrl)
            ? selectedAvatar.replace(baseUrl, "") // Strip base URL if it exists
            : selectedAvatar; // Use the relative path directly

        // Update the profile image on the page
        document.getElementById("profileImage").src = relativePath;

        // Close the avatar modal
        document.getElementById("avatarModal").style.display = "none";

        // Save the selected avatar to Firestore
        saveProfilePicture(relativePath);
    });
});

// 11. Displays a success toast notification for profile updates.
function showToast() {
    const toastElement = document.getElementById("profileToast");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    document.addEventListener("click", function dismissToast(event) {
        if (!toastElement.contains(event.target)) {
            toast.hide();
            document.removeEventListener("click", dismissToast);
        }
    });
    setTimeout(() => toast.hide(), 3000);
}

// 12. Displays a success toast notification for event deletions.
function showToast2() {
    const toastElement = document.getElementById("deleteToast");
    const toast = new bootstrap.Toast(toastElement);
    toast.show();

    document.addEventListener("click", function dismissToast(event) {
        if (!toastElement.contains(event.target)) {
            toast.hide();
            document.removeEventListener("click", dismissToast);
        }
    });
    setTimeout(() => toast.hide(), 3000);
}

// 5. Updates the user's profile picture in Firestore with the selected avatar URL.
function saveProfilePicture(avatarUrl) {
    const user = auth.currentUser;
    if (user) {
        const profileRef = window.db.collection("profileSettings").doc(user.uid);

        profileRef
            .set({ avatar: avatarUrl }, { merge: true })
            .then(() => {
                console.log("Profile picture updated successfully!");
                showToast();
            })
            .catch((error) => {
                console.error("Error updating profile picture:", error);
                alert("Failed to update profile picture. Please try again.");
            });
    } else {
        console.error("User not authenticated. Cannot save profile picture.");
    }
}

// 8. Fetches and displays events created by the logged-in user from Firestore.
function loadMyEvents() {
    console.log("Loading My Events...");
    const myEventsContainer = document.getElementById("myEventsContainer");

    myEventsContainer.innerHTML = "<p>Loading your events...</p>";

    const user = firebase.auth().currentUser;
    if (user) {
        const profileSettingsRef = firebase.firestore().collection("profileSettings").doc(user.uid);

        profileSettingsRef.get().then((doc) => {
            if (doc.exists) {
                const userName = doc.data().fname;
                console.log("Fetched user name:", userName);

                const eventsRef = firebase.firestore().collection("events");
                eventsRef
                    .where("owner", "==", userName)
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            myEventsContainer.innerHTML = "<p>No events created yet.</p>";
                            myEventsContainer.style.minHeight = "150px";
                        } else {
                            myEventsContainer.innerHTML = "";
                            querySnapshot.forEach((doc) => {
                                const eventData = doc.data();
                                const eventId = doc.id;

                                const eventCard = `
                                <div class="card mb-4" id="event-${eventId}" style="border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 400px; margin: auto;">
                                    <img src="${eventData.picture || '/images/events/default.jpg'}" 
                                        class="card-img-top" alt="${eventData.title}" style="height: 200px; object-fit: cover;">
                                    <div class="card-body">
                                        <!-- Title and Delete Button -->
                                        <div class="d-flex justify-content-between align-items-center mb-3">
                                            <h5 class="card-title" style="font-weight: bold; font-size: 1.5rem; margin-bottom: 0;">${eventData.title}</h5>
                                            <button class="btn btn-danger btn-sm" style="border-radius: 50%;" onclick="deleteEvent('${eventId}')">
                                                <i class="fa fa-trash"></i>
                                            </button>
                                        </div>
                                        <!-- Description -->
                                        <p class="card-text" style="color: #555;">${eventData.description}</p>
                                        <!-- Time and Place -->
                                        <p class="card-text" style="font-size: 0.9rem; color: #555;"><strong>Time:</strong> ${formatTimestamp(eventData.time)}</p>
                                        <p class="card-text" style="font-size: 0.9rem; color: #555;"><strong>Place:</strong> ${eventData.place || 'No Location Provided'}</p>
                                        <!-- Price and Edit Button -->
                                        <div class="d-flex justify-content-between align-items-center mt-3">
                                            <span style="font-size: 0.9rem; font-weight: bold; color: black;">${formatPrice(eventData.price)}</span>
                                            <button class="edit-button" style="border-radius: 50%; font-size: 1.2rem; margin-top: -5px; right: 23px;" onclick="editEvent('${eventId}')">
                                                <i class="fa-solid fa-pen-to-square"></i>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                `;


                                myEventsContainer.innerHTML += eventCard;
                            });
                        }
                    })
                    .catch((error) => {
                        console.error("Error loading events:", error);
                        myEventsContainer.innerHTML = "<p>Failed to load events. Please try again later.</p>";
                    });
            } else {
                console.log("No profile settings found for user.");
                myEventsContainer.innerHTML = "<p>No events found.</p>";
            }
        }).catch((error) => {
            console.error("Error fetching profile settings:", error);
            myEventsContainer.innerHTML = "<p>Failed to load events. Please try again later.</p>";
        });
    } else {
        console.log("User not signed in.");
        myEventsContainer.innerHTML = "<p>Please sign in to view your events.</p>";
    }
}

// 9. Deletes the event from Firestore and updates the UI to remove the deleted event card.
function deleteEvent(eventId) {
    const modalHtml = `
        <div class="custom-modal-overlay">
            <div class="custom-modal">
                <h3>Are you sure?</h3>
                <p>Do you want to delete this event? This action cannot be undone.</p>
                <div class="custom-modal-actions">
                    <button id="cancelDelete" class="btn btn-secondary">Cancel</button>
                    <button id="confirmDelete" class="btn btn-danger">Delete</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML("beforeend", modalHtml);

    document.getElementById("confirmDelete").addEventListener("click", () => {
        const eventRef = firebase.firestore().collection("events").doc(eventId);

        eventRef
            .delete()
            .then(() => {
                console.log(`Event ${eventId} deleted successfully.`);
                const eventElement = document.getElementById(`event-${eventId}`);
                if (eventElement) {
                    eventElement.remove();
                }
                showToast2();
            })
            .catch((error) => {
                console.error("Error deleting event:", error);
                showToast("Failed to delete event. Please try again.", "error");
            });

        closeModal();
    });

    document.getElementById("cancelDelete").addEventListener("click", closeModal);

    function closeModal() {
        const modal = document.querySelector(".custom-modal-overlay");
        if (modal) modal.remove();
    }
}
window.deleteEvent = deleteEvent;

// 6. Saves the user's profile picture and preferences to `localStorage`.
function saveProfileState(profilePicture, preferences) {
    const existingProfilePicture = localStorage.getItem('avatar');
    const finalProfilePicture = profilePicture || existingProfilePicture;

    localStorage.setItem('profilePicture', finalProfilePicture);
    localStorage.setItem('preferences', JSON.stringify(preferences));
}

// 7. Restores the user's profile picture and preferences from `localStorage`
function restoreProfileState() {
    const profilePicture = localStorage.getItem('avatar');
    const preferences = JSON.parse(localStorage.getItem('preferences'));
    if (profilePicture) {
        document.getElementById('avatar').src = profilePicture;
    }

    // Restore preferences
    if (preferences) {
        Object.keys(preferences).forEach((key) => {
            const field = document.querySelector(`[name="${key}"]`);
            if (field) field.value = preferences[key];
        });
    }
}

// Restore state on page load
restoreProfileState();

// 10. Fetches and displays events liked by the user.
async function displayUserLikedEvents() {
    const likedEventsContainer = document.getElementById("likedEventsContainer");

    if (!likedEventsContainer) {
        console.error("Liked Events container not found.");
        return;
    }

    likedEventsContainer.innerHTML = "<p>Loading liked events...</p>";

    const user = firebase.auth().currentUser;
    if (!user) {
        likedEventsContainer.innerHTML = "<p>Please sign in to view your liked events.</p>";
        return;
    }

    try {
        // Get the liked events for the current user
        const userRef = firebase.firestore().collection("users").doc(user.uid);
        const userDoc = await userRef.get();

        if (!userDoc.exists) {
            likedEventsContainer.innerHTML = "<p>No liked events found.</p>";
            return;
        }

        let likedEventIds = userDoc.data().likedEvents || [];

        if (likedEventIds.length === 0) {
            likedEventsContainer.innerHTML = "<p>You haven't liked any events yet.</p>";
            return;
        }

        // Reverse the order to show the most recently liked events first
        likedEventIds = likedEventIds.reverse();

        likedEventsContainer.innerHTML = ""; // Clear the loading message

        const eventsRef = firebase.firestore().collection("events");
        const profileSettingsRef = firebase.firestore().collection("profileSettings");

        const promises = likedEventIds.map(async (eventId) => {
            const eventDoc = await eventsRef.doc(eventId).get();
            if (!eventDoc.exists) return null;

            const eventData = eventDoc.data();
            const ownerId = eventData.ownerId || null;

            // Fetch the owner's avatar from the `profileSettings` collection
            let ownerAvatar = "/images/default-profile.png"; // Default avatar
            if (ownerId) {
                const ownerProfileDoc = await profileSettingsRef.doc(ownerId).get();
                if (ownerProfileDoc.exists) {
                    ownerAvatar = ownerProfileDoc.data().avatar || "/images/default-profile.png";
                }
            }

            return { id: eventId, ...eventData, ownerAvatar };
        });

        const eventDataList = (await Promise.all(promises)).filter((event) => event !== null);

        if (eventDataList.length === 0) {
            likedEventsContainer.innerHTML = "<p>No liked events available.</p>";
            return;
        }

        // Render each liked event
        eventDataList.forEach((eventData) => {
            const formattedTime = eventData.time ? formatTimestamp(eventData.time) : "No Date Provided";
            const formattedPrice = formatPrice(eventData.price);

            const eventCard = `
                <div class="card mb-4" id="liked-event-${eventData.id}" style="border-radius: 15px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden; max-width: 400px; margin: auto;">
                    <img src="${eventData.picture || '/images/events/default.jpg'}" 
                         class="card-img-top" alt="${eventData.title}" style="height: 200px; object-fit: cover;">
                    <div class="card-body">
                        <!-- Title and Like Button -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <h5 class="card-title" style="font-weight: bold; font-size: 1.5rem; margin-bottom: 0;">${eventData.title}</h5>
                            <i class="fa-solid fa-heart" 
                               style="cursor: pointer; font-size: 1.5rem; color: #dc3545;" 
                               onclick="unlikeEvent('${eventData.id}')"></i>
                        </div>
                        <!-- Owner Info -->
                        <div class="d-flex align-items-center mb-3">
                            <img src="${eventData.ownerAvatar}" 
                                 alt="Owner Avatar" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; margin-right: 10px;">
                            <span style="font-weight: bold; font-size: 1rem;">${eventData.owner || 'Unknown Owner'}</span>
                        </div>
                        <!-- Time and Place -->
                        <p class="card-text" style="font-size: 0.9rem; color: #555;"><strong>Time:</strong> ${formattedTime}</p>
                        <p class="card-text" style="font-size: 0.9rem; color: #555;"><strong>Place:</strong> ${eventData.place || 'No Place Provided'}</p>
                        <!-- Price -->
                        <p class="card-text" style="font-size: 0.9rem; font-weight: bold; color: black;">${formattedPrice}</p>
                    </div>
                </div>
            `;

            likedEventsContainer.innerHTML += eventCard;
        });
    } catch (error) {
        console.error("Error fetching liked events:", error);
        likedEventsContainer.innerHTML = "<p>Failed to load liked events. Please try again later.</p>";
    }
}
