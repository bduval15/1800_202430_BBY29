// Firebase Configuration (your Firebase project's details)
const firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.appspot.com",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
  };
  
  // Initialize Firebase
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import { getFirestore, collection, getDocs, query, limit } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
  
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  
  // Get the container where events will be displayed
  const eventsContainer = document.getElementById("events-container");
  
  // Fetch 6 events from Firestore
  async function fetchEvents() {
    const eventsRef = collection(db, "events");
    const eventsQuery = query(eventsRef, limit(6));
  
    try {
      const querySnapshot = await getDocs(eventsQuery);
      querySnapshot.forEach((doc) => {
        const eventData = doc.data();
        const eventHTML = `
          <article>
            <h3>${eventData.title}</h3>
            <img src="${eventData.picture}" alt="Event Image" style="max-width:100%; height:auto;">
            <p> Date:  ${eventData.time}</p>
            <p>Location: ${eventData.place}</p>
          </article>`;
        // Append the event HTML to the container
        eventsContainer.innerHTML += eventHTML;
      });
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }
  
  // Call the function to fetch events on page load
  fetchEvents();
  