
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
