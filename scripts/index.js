let events = []; // To store fetched events
let currentIndex = 0; // Index of the currently displayed event

function fetchEvents() {
    var eventsRef = db.collection("events").limit(6);

    eventsRef.get()
        .then((querySnapshot) => {
            events = querySnapshot.docs.map((doc) => doc.data());
            if (events.length > 0) {
                displayEvent(currentIndex); // Display the first event
            }
        })
        .catch((error) => {
            console.error("Error fetching events:", error);
        });
}
// Display the event at the specified index
function displayEvent(index) {
    const eventPreview = document.getElementById("event-preview");
    const event = events[index];
    if (!event) return;

    // Format the date and time
    let formattedDate;
    let formattedTime = ""; // To store formatted time

    if (event.time) {
        try {
            // Convert the timestamp string to a Date object by removing the time zone part
            const eventDate = new Date(event.time.split(' UTC')[0]);

            // Check if the date is valid
            if (!isNaN(eventDate)) {
                // Format the date (month, day, year)
                formattedDate = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                }).format(eventDate);

                // Format the time (hours, minutes)
                formattedTime = new Intl.DateTimeFormat('en-US', {
                    hour: 'numeric',
                    minute: 'numeric',
                    hour12: true,
                }).format(eventDate);
            } else {
                console.warn("Invalid date format:", event.time);
            }
        } catch (error) {
            console.warn("Error formatting date:", error);
        }
    }

    eventPreview.innerHTML = `
        <article>
            <h3>${event.title || "Untitled Event"}</h3>
            <img src="${event.picture || 'default-image.jpg'}" alt="Event Image" style="max-width:100%; height:auto;">
            <p>Log in to see details</p>
            ${formattedTime ? `<p>Time: ${formattedTime}</p>` : ''}
        </article>
    `;
}




// Navigate to the previous or next event
function navigateEvent(direction) {
    currentIndex += direction;
    if (currentIndex < 0) {
        currentIndex = events.length - 1; // Wrap around to the last event
    } else if (currentIndex >= events.length) {
        currentIndex = 0; // Wrap around to the first event
    }
    displayEvent(currentIndex);
}

// Event listeners for navigation buttons
document.addEventListener("DOMContentLoaded", () => {
    fetchEvents();
    document.getElementById("prev-event").addEventListener("click", () => navigateEvent(-1));
    document.getElementById("next-event").addEventListener("click", () => navigateEvent(1));
});
