
        function openPopup() {
            document.getElementById('popup').style.display = 'block';
            document.getElementById('overlay').style.display = 'block';
        }

        function closePopup() {
            document.getElementById('popup').style.display = 'none';
            document.getElementById('overlay').style.display = 'none';
        }

        document.getElementById('eventForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const title = document.getElementById('title').value;
            const picture = document.getElementById('picture').value;
            const description = document.getElementById('description').value;
            const time = document.getElementById('time').value;
            const place = document.getElementById('place').value;

            // Create a new event element
            const eventItem = document.createElement('div');
            eventItem.classList.add('event');
            eventItem.innerHTML = `
                <h3>${title}</h3>
                <img src="${picture}" alt="${title}" style="width: 100px; height: auto;">
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Time:</strong> ${new Date(time).toLocaleString()}</p>
                <p><strong>Place:</strong> ${place}</p>
            `;

            // Append the new event to the event list
            document.getElementById('eventList').appendChild(eventItem);

            // Clear the form
            document.getElementById('eventForm').reset();
            closePopup(); // Close the popup after submission
        });

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function fetchEvents() {
    const eventsContainer = document.getElementById('events-container');
    try {
        const querySnapshot = await db.collection('events').get();
        querySnapshot.forEach((doc) => {
            const event = doc.data();

            // Create event card
            const eventCard = document.createElement('div');
            eventCard.className = 'col-md-4';

            eventCard.innerHTML = `
                <div class="card mb-4 shadow-sm">
                    <img src="images/default.jpg" class="card-img-top" alt="Event Image">
                    <div class="card-body">
                        <h5 class="card-title">${event.title}</h5>
                        <p class="card-text">${event.description}</p>
                        <p><strong>Location:</strong> ${event.location}</p>
                        <p><strong>Category:</strong> ${event.category}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="btn-group">
                                <button type="button" class="btn btn-sm btn-outline-secondary">View</button>
                                <button type="button" class="btn btn-sm btn-outline-secondary">RSVP</button>
                            </div>
                            <small class="text-muted">${new Date(event.timestamp.seconds * 1000).toLocaleDateString()} at ${event.timeofevent}</small>
                        </div>
                    </div>
                </div>
            `;

            eventsContainer.appendChild(eventCard);
        });
    } catch (error) {
        console.error('Error fetching events:', error);
    }
}

fetchEvents();
