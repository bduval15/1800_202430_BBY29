/**
 * @file main.js
 * @description This script handles user authentication, event creation, filtering, 
 *              joining/leaving events, profile updates, and managing event-related interactions.
 *              It integrates Firebase Authentication and Firestore for dynamic, personalized features.
 * 
 * @author Braeden Duval, Natalia Arseniuk, Aleen Dawood
 * @version 1.0
 * 
 * @requires Firebase Authentication
 * @requires Firebase Firestore
 * @requires Font Awesome (for icons)
 * @requires Bootstrap (for modals and other UI components)
 * 
 * Key Features:
 * 1. **User Authentication:**
 *    - Detects and handles user authentication state changes via Firebase Authentication.
 *    - Initializes Firestore user data for new users and updates the navbar with the user's profile picture.
 *    - Logs out users and clears cached data when the logout button is clicked.
 * 
 * 2. **Event Management:**
 *    - Enables users to create, update, and delete events via an intuitive UI.
 *    - Automatically removes outdated events from Firestore based on configurable thresholds.
 *    - Allows users to join or leave events, dynamically updating the attendance list and UI in real-time.
 *    - Supports commenting on events and dynamically displays comments in the event detail popup.
 * 
 * 3. **Event Display and Filtering:**
 *    - Fetches and displays events based on active filters such as category, user preferences, or ownership.
 *    - Dynamically generates event cards with rich details such as title, date, time, location, and price.
 *    - Updates the state of the like button in both the main feed and event detail popup to reflect the user's preferences.
 * 
 * 4. **Popup Controls:**
 *    - Provides reusable controls for managing popups, including the event creation form, confirmation dialogs, and event detail view.
 *    - Dynamically populates popups with relevant event data and ensures seamless interaction.
 * 
 * 5. **Profile Management:**
 *    - Updates and synchronizes the user's profile settings, including profile picture, preferences, and personal information.
 *    - Dynamically loads the user's profile picture and integrates it into the navbar and event details.
 * 
 * 6. **Responsive UI Enhancements:**
 *    - Implements a live preview of event images based on category selection.
 *    - Provides intuitive feedback through toast notifications for actions such as saving settings or deleting events.
 * 
 * 7. **Utility Functions:**
 *    - Includes reusable utilities for formatting timestamps and prices into user-friendly formats.
 *    - Dynamically toggles UI elements, such as enabling/disabling price inputs or updating the display of selected categories.
 * 
 * 8. **State Persistence:**
 *    - Saves and restores user preferences, such as profile picture and filter settings, using `localStorage`.
 *    - Ensures a consistent and seamless user experience across sessions.
 * 
 * 
 * Functions:
 * 
 * // ========================== AUTHENTICATION ==========================
 * 1. **`onAuthStateChanged(user)`**
 *    - Tracks user authentication state changes.
 *    - Initializes Firestore data for new users.
 *    - Updates the navbar profile picture upon successful login.
 *    - Logs out users and resets the UI when no user is signed in.
 * 
 * // ========================== EVENT MANAGEMENT ==========================
 * 2.  **`handleFormSubmit(event)`**
 *    - Handles form submission for creating or updating events.
 *    - Validates input fields, constructs the event object, and saves it to Firestore.
 *    - Opens a confirmation popup with event details after saving.
 *    - Resets the form for the next event creation.

 * 3.  **`removeOldEvents()`**
 *    - Automatically removes events older than the configured `THRESHOLD_HOURS`.
 *    - Compares event timestamps with the current time to identify outdated events.
 *    - Deletes old events from Firestore and updates the UI.

 * 4.  **`joinEvent(eventData)`**
 *    - Adds the current user to the event's attendees list.
 *    - Updates the attendance count and "Join/Leave" button in real-time.
 *    - Saves the updated attendees list to Firestore.

 * 5.  **`leaveEvent(eventData)`**
 *    - Removes the current user from the event's attendees list.
 *    - Updates the attendance count and "Join/Leave" button in real-time.
 *    - Saves the updated attendees list to Firestore.

 * 6.  **`updateAttendance(eventData)`**
 *    - Updates the displayed attendee count for an event.
 *    - Toggles the "Join/Leave" button text based on the user's attendance status.

 * 7.  **`postComment(eventData)`**
 *    - Adds a new comment to the specified event.
 *    - Saves the comment to Firestore and updates the event details popup.
 *    - Clears the input field after successfully posting the comment.
 * 
 * 8.  **handleUndo(eventData)`**
 *    - Checks if `tempEventData` exists; logs an error if it does not.
 *    - Repopulates form fields (`title`, `picture`, `description`, `time`, and `place`) with data from `tempEventData`.
 *    - Ensures the `time` field is formatted in ISO format (`YYYY-MM-DDTHH:mm`) for compatibility.
 *    - Updates radio buttons to match the event category stored in `tempEventData`.
 *    - Closes the confirmation popup and reopens the event creation popup.
 * 
 * 9.  **`updateSelectedCategoriesDisplay()`**
 *    - Updates the text display for selected event categories in the filter section.
 *    - Maps the selected category values to their human-readable labels and combines them into a string for display.
 * 
 * 10. **`eventCategoryImages`**
 *    - An object that maps event category keys to their corresponding image file paths.
 *    - Provides the appropriate image URL for each event category to display a visual representation.
 *    - Includes a default fallback image in case the category does not match any predefined key.

---

 * // ========================== EVENT DISPLAY AND FILTERING ==========================
 * 11. **`loadFilteredEvents(categories)`**
 *    - Fetches events from Firestore based on active filters (e.g., category, user preferences).
 *    - Displays events that match the selected filters or shows all events if no filters are active.

 * 12. **`displayEvent(eventData, container)`**
 *    - Dynamically generates and renders a card for a single event.
 *    - Populates event details such as title, date, time, location, price, and the like button.
 *    - Loads the event owner's profile details (e.g., avatar, name) for display.

 * 13. **`updateMainFeedHeart(eventId)`**
 *     - Synchronizes the like/unlike state of an event in the main feed with Firestore.
 *     - Updates the heart icon to reflect the current user's like status.

 * 14. **`updatePopupHeartIcon(eventId)`**
 *     - Updates the like button's icon in the event detail popup to reflect the current user's like status for the specified event.
 *     - Checks if the user has liked the event and toggles the button's icon accordingly.
---

 * // ========================== POPUP CONTROLS ==========================
 * 15. **`openPopup()`**
 *     - Displays the event creation form popup.
 *     - Resets form fields and deselects any previously selected categories.

 * 16. **`closePopup(event)`**
 *     - Closes the popup triggered by the specified event.
 *     - Hides the overlay and resets the popup state.

 * 17. **`closePopupById(popupId)`**
 *     - Closes a specific popup by its ID.
 *     - Hides the overlay associated with the popup.

 * 18. **`openConfirmationPopup(eventData)`**
 *     - Displays a confirmation popup with the newly created or updated event details.
 *     - Populates the popup with details such as title, description, date, price, and owner information.

 * 19. **`closeConfirmationPopup()`**
 *     - Closes the event confirmation popup.
 *     - Hides the overlay associated with the popup.

 * 20. **`openEventDetailPopup(eventData)`**
 *      - Opens the event detail popup and populates it with the provided event data.
 *      - Dynamically updates the modal's content with event details such as title, description, owner, attendees, comments, and more.
 *      - Sets up event listeners for the "Join/Leave" and "Like/Unlike" buttons.
 
 * 21. **`initializeEventHandlers()`**
 *      - Sets up event listeners for various UI elements related to event creation, editing, and interaction.
 *      - Handles opening/closing of popups, form submissions, and live preview updates for event images.
---

 * // ========================== NAVBAR AND PROFILE MANAGEMENT ==========================
 * 22. **`updateNavbarProfilePicture()`**
 *     - Updates the user's profile picture in the navbar.
 *     - Fetches the profile picture from Firestore and sets it in the navbar.

---

 * // ========================== UTILITY FUNCTIONS ==========================
 * 23. **`formatTimestamp(timestamp)`**
 *     - Converts a Firestore `Timestamp` or JavaScript `Date` object into a readable date/time string.
 *     - Formats the date and time in "Month Day, Year Hour:Minute AM/PM" format.

 * 24. **`formatPrice(price)`**
 *     - Formats a price value into a CAD currency string.
 *     - Displays "Free" if the price is 0 or not provided.

 * 25. **`togglePriceInput()`**
 *     - Disables or enables the price input field based on whether the "Free" option is selected.

 * 26. **`Logout Functionality`**
 *     - Attaches a click event listener to the logout button.
 *     - Handles user logout by clearing local storage and signing the user out using Firebase Authentication.
 * 
---
 */
