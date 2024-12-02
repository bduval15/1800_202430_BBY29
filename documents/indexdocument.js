/**
 * @file index.js
 * @description Theis script dynamically fetches events from a Firestore database, formats the data, 
 *              populates an event carousel, and enables auto-scrolling functionality. It ensures 
 *              proper data formatting, handles missing or default values, and provides a smooth 
 *              user experience for event browsing.
 * 
 * @author Braeden Duval, Natalia Arseniuk, Aleen Dawood
 * @version 1.0
 * 
 * @requires Firebase Firestore
 * @requires Font Awesome (for icons)
 * @requires Bootstrap (for modals and other UI components)
 * 
 * Functions:
 * 1. fetchEvents:
 *    - Fetches a maximum of 6 events from the Firestore database.
 *    - Populates the global `events` array and initializes the carousel if events are available.
 *    - Handles errors during the fetching process.
 * 
 * 2. populateCarousel:
 *    - Dynamically generates HTML for each event and injects it into the carousel track.
 *    - Formats event details such as title, date, time, price, and owner information.
 *    - Fetches owner profile data from the database to display avatars and names.
 *    - Handles missing data by providing default values.
 * 
 * 3. startAutoScroll:
 *    - Enables automatic scrolling of the carousel by periodically shifting the visible event.
 *    - Smoothly transitions between events using CSS `transform`.
 * 
 * @event DOMContentLoaded
 * - Triggers the `fetchEvents` function to load events and initialize the carousel once the page is loaded.
 * 
 */
