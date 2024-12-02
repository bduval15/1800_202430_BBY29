let events = []; // To store fetched events
let currentIndex = 0; // Index of the currently displayed event
const scrollInterval = 4000; // Time between scrolls (in milliseconds)

// 1. Fetches a maximum of 6 events from the Firestore database.
function fetchEvents() {
    const eventsRef = db.collection("events").limit(6); // Fetch a maximum of 6 events

    eventsRef.get()
        .then((querySnapshot) => {
            events = querySnapshot.docs.map((doc) => doc.data());
            if (events.length > 0) {
                populateCarousel(); // Inject events into the carousel
                startAutoScroll(); // Start auto-scrolling
            }
        })
        .catch((error) => {
            console.error("Error fetching events:", error);
        });
}

// 2. Dynamically generates HTML for each event and injects it into the carousel track.
async function populateCarousel() {
    const carouselTrack = document.getElementById("carousel-track");
    carouselTrack.innerHTML = ""; // Clear previous content

    for (const event of events) {
        // Initialize default values
        let ownerProfile = "/images/profilePics/default.webp"; // Default avatar
        let ownerName = event.owner || "Unknown Owner";

        // Fetch owner's profile details
        try {
            if (event.ownerId) {
                const profileDoc = await db.collection("profileSettings").doc(event.ownerId).get();
                if (profileDoc.exists) {
                    const profileData = profileDoc.data();
                    ownerProfile = profileData.avatar || ownerProfile;
                    ownerName = profileData.fname || ownerName;
                }
            }
        } catch (error) {
            console.error("Error fetching owner profile:", error);
        }

        // Format date and time
        let formattedDate = "No Date Provided";
        let formattedTime = "No Time Provided";

        if (event.time) {
            try {
                let eventDate;
                
                // Check if the event.time is a Firebase Timestamp or a string
                if (event.time instanceof firebase.firestore.Timestamp) {
                    eventDate = event.time.toDate(); // Convert Firebase Timestamp to JavaScript Date
                } else {
                    eventDate = new Date(event.time); // If it's a string, directly convert to Date
                }

                // Format the date and time
                formattedDate = eventDate.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
                formattedTime = eventDate.toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "numeric",
                    hour12: true,
                });
            } catch (error) {
                console.warn("Error formatting date:", error);
            }
        }

        // Format price
        const price = event.price && event.price !== "Free" ? `Price: $${event.price}` : "Price: Free";

        // Populate event card
        const eventHTML = `
        <div class="unique-event-container">
            <h3 class="unique-event-title">${event.title || "Untitled Event"}</h3>
            <img src="${event.picture || '/images/events/default.jpg'}" alt="Event Image" class="unique-event-image">
            <div class="unique-owner-info">
                <div class="owner-details">
                    <img src="${ownerProfile}" alt="Owner Profile Picture" class="unique-owner-img">
                    <span class="unique-owner-name">${ownerName}</span>
                </div>
                <span class="unique-owner-price">${price}</span>
            </div>
            <div class="unique-event-details">
                <div class="unique-event-left">
                    <p class="unique-event-date"><strong>Date:</strong> ${formattedDate}</p>
                </div>
                <div class="unique-event-right">
                    <p class="unique-event-time"><strong>Time:</strong> ${formattedTime}</p>
                </div>
            </div>
        </div>
        `;

        carouselTrack.innerHTML += eventHTML;
    }
}

// 3/ Enables automatic scrolling of the carousel by periodically shifting the visible event.
function startAutoScroll() {
    const carouselTrack = document.getElementById("carousel-track");

    setInterval(() => {
        currentIndex = (currentIndex + 1) % events.length; // Increment index and loop back if needed
        const translateX = -currentIndex * 100; // Calculate the shift percentage
        carouselTrack.style.transform = `translateX(${translateX}%)`; // Apply smooth slide effect
    }, scrollInterval);
}

// Fetch and display events on page load
document.addEventListener("DOMContentLoaded", fetchEvents);
