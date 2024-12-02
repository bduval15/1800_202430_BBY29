/**
 * @file profile.js
 * @description This script manages user profile functionalities, including user authentication, 
 *              profile settings, profile picture updates, event management, and displaying 
 *              liked and created events. It integrates with Firebase Authentication and Firestore 
 *              to provide dynamic and personalized features for users.
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
 *    - Detects authentication state changes and updates the UI with the user's display name.
 *    - Fetches and displays user-specific profile and event data.
 * 
 * 2. **Profile Settings Management:**
 *    - Loads and displays user profile settings, including avatar, website, GitHub link, school, 
 *      and preferences.
 *    - Allows users to update and save their profile settings to Firestore.
 * 
 * 3. **Profile Picture Management:**
 *    - Enables users to select, preview, and save profile pictures.
 *    - Updates the navbar profile picture dynamically.
 * 
 * 4. **Event Management:**
 *    - Loads and displays events created by the user in the "My Events" tab.
 *    - Supports event deletion with confirmation modal pop-ups.
 * 
 * 5. **Liked Events:**
 *    - Fetches and displays events liked by the user in the "Liked Events" tab.
 *    - Provides options to unlike events directly from the UI.
 * 
 * 6. **Toast Notifications:**
 *    - Displays success or error notifications for actions such as saving profile settings or 
 *      deleting events.
 * 
 * 7. **State Persistence:**
 *    - Saves and restores profile picture and preferences using `localStorage` for improved 
 *      user experience across sessions.
 * 
 * 8. **Responsive Event Management UI:**
 *    - Dynamically generates and displays event cards with details such as title, date, time, 
 *      location, and price.
 *    - Includes buttons for editing or deleting events.
 * 
 *
 * Functions:
 * 
 * // ========================== PROFILE MANAGEMENT ==========================
 * 
 * 1. **`loadProfileSettings(uid)`**
 *    - Fetches the user's profile settings from Firestore using their UID.
 *    - Populates the form with profile information such as avatar, website, GitHub link, school, and preferences.
 *    - Sets the checkboxes for preferences based on Firestore data.
 * 
 * 2. **`saveProfileSettings()`**
 *    - Gathers and validates user inputs for profile settings.
 *    - Saves the updated profile information (including avatar, preferences, and links) to Firestore.
 *    - Reloads the page to reflect changes and stores the updated data in `localStorage`.
 * 
 * 3. **`updateNavbarProfilePicture()`**
 *    - Fetches the user's avatar from Firestore and updates the navbar with the profile image.
 *    - Falls back to a default avatar if none is found.
 * 
 * 4. **`populateEmail(uid)`**
 *    - Retrieves the user's email from the Firestore `users` collection using their UID.
 *    - Populates the email input field in the form with the retrieved email.
 * 
 * 5. **`saveProfilePicture(avatarUrl)`**
 *    - Updates the user's profile picture in Firestore with the selected avatar URL.
 *    - Displays a toast notification upon successfully saving the new profile picture.
 * 
 * 6. **`saveProfileState()`**
 *    - Saves the user's current profile picture and preferences to `localStorage`.
 *    - Ensures the profile state is preserved across sessions.
 * 
 * 7. **`restoreProfileState()`**
 *    - Restores the user's profile picture and preferences from `localStorage`.
 *    - Updates the UI elements (e.g., avatar image, checkboxes) with the restored state.
 * 
 * // ========================== EVENT MANAGEMENT ==========================
 * 
 * 8. **`loadMyEvents()`**
 *    - Fetches and displays events created by the logged-in user from Firestore.
 *    - Generates event cards with options to delete or edit events.
 *    - Displays a message if no events are found.
 * 
 * 9. **`deleteEvent(eventId)`**
 *    - Displays a confirmation modal before deleting the specified event.
 *    - Deletes the event from Firestore and updates the UI to remove the deleted event card.
 *    - Shows a toast notification upon successful deletion.
 * 
 * 10. **`displayUserLikedEvents()`**
 *     - Fetches and displays events liked by the user from Firestore.
 *     - Loads event details such as title, time, location, price, and owner avatar.
 *     - Provides the option to unlike events directly from the interface.
 * 
 * // ========================== NOTIFICATIONS ==========================
 * 
 * 11. **`showToast()`**
 *     - Displays a success toast notification for profile updates.
 *     - Dismisses the toast automatically after 3 seconds or when clicked outside the toast.
 * 
 * 12. **`showToast2()`**
 *     - Displays a success toast notification for event deletions.
 *     - Dismisses the toast automatically after 3 seconds or when clicked outside the toast.
 * 
 * // ========================== UTILITIES ==========================
 * 
 * 13. **`formatTimestamp(timestamp)`**
 *     - Formats a Firebase `Timestamp` or JavaScript `Date` object into a human-readable string.
 *     - Outputs the date and time in the format "Month Day, Year Hour:Minute AM/PM."
 *     - Provides a fallback if no timestamp is available.
 * 
 * 14. **`formatPrice(price)`**
 *     - Converts a numeric price value into a CAD currency string.
 *     - Displays "Free" if the price is `0` or not provided.
 * 
 * // ========================== EVENT LISTENERS ==========================
 * 
 * 1. **DOMContentLoaded:**
 *    - Initializes Firebase and loads user-specific data (e.g., profile settings, created events).
 *    - Attaches event listeners for dynamic UI interactions.
 * 
 * 2. **Profile Picture Events:**
 *    - Handles click events on the profile picture to open the avatar selection modal.
 *    - Updates the selected avatar when a user clicks on an avatar option.
 * 
 * 3. **Save Button:**
 *    - Saves the updated profile settings when the user clicks the save button.
 * 
 * 4. **Tab Navigation:**
 *    - Loads the user's liked events or created events when the respective tabs are clicked.
 * 
 * Dependencies:
 * - Requires Bootstrap for toast notifications.
 * - Uses Font Awesome for icons in the UI.
 * - Profile Avatar Icons provided by https://www.flaticon.com/free-icons
 * 
 */
