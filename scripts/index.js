// scripts/index.js
var eventsContainer = document.getElementById("events-container");

function fetchEvents() {
  var eventsRef = db.collection("events").limit(6);

  eventsRef.get()
    .then((querySnapshot) => {
      let eventsHTML = "";
      querySnapshot.forEach((doc) => {
        var eventData = doc.data();
        eventsHTML += `
          <article>
            <h3>${eventData.title || "Untitled Event"}</h3>
            <img src="${eventData.picture || 'default-image.jpg'}" alt="Event Image" style="max-width:100%; height:auto;">
            <p>Date: ${eventData.time || "TBD"}</p>
            <p>Location: ${eventData.place || "Location Unavailable"}</p>
          </article>`;
      });
      eventsContainer.innerHTML = eventsHTML;
    })
    .catch((error) => {
      console.error("Error fetching events:", error);
    });
}

document.addEventListener("DOMContentLoaded", fetchEvents);
