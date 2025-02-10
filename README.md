# NotEFY

## 1. Project Description
This browser based web application to host events, and find events in your area. All while staying organized enough to ensure you never miss out on a function you want to attend. 

## 2. Names of Contributors
List team members and/or short bio's here... 
* Brady Duval - I like to make music.
* Aleen Dawood - I like potatos. 
* Natalia Arseniuk- I like to learn new things and code.
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* FontAwesome (Icon Library https://kit.fontawesome.com/62f3b3a061.js)
* Tech Tips (Carly's Library of technical expertise)
* Provile Avatars (Provided by https://www.flaticon.com/free-icons)
* ChatGPT (Used for troubleshooting and assistance with building functions) 
**Disclaimer** ChatGPT helped us flesh out our functions so we could get the intended use out of them. We also used it to add console log errors to help with debugging throughout the implementation process.

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...

**When looking at the scripts. Please refer to the documentation corresponding to each script under the documents folder.**

* Login using the account 
    username: demo15@email.ca
    password: pass1234

* After login you are directed to the main page. Here you can filter by events, view events in the main feed or host a new event. 

* Filtering by My Events will show the events the User has created. For You filters events set up in the Event Preferences tab on the profile page. The rest filter the events by categories selected when creating the event. 

* Scroll through the main feed and click on an event you find interesting. Here you will find the complete details of the event. The heart button under the event picture, allows you to "like" the event and view it under the Likes tab on the profile page. Join event allows you to join the event. Leave a comment for the owner to see on their event page and like an event so you can view it later!

* Now click the "Create Event" button in the floating navbar. Fill out of the details of your event such as the "Event Title", select a category in which best describes your event. Notice the Event Image will change based on what category you select. Fill out the rest of the event details, the description, whether it is free or paid, the time and choose between hosting the event at BCIT or in Vancouver. After you click "Submit New Event" you will be brought to a confirmation page where you can double check that all of the information you provided is accurate. If you notice any errors, you can click the Undo button to bring you back to the event page and make any changes necessary. Click the "Done" button when you are finished and watch as your new event is immediately populated in the main feed. 

* Click on the dropdown menu in the top right or the "profile" icon in the bottom right of the floating navbar and head on over to the profile page. Click on the avatar so select a new avatar for your profile. Under the Settings tab, select some events you would like to see when filtering with the "For You" filter. You can also fill out your Email, Website, Github, and School for other users to see. Make sure to hit the save button so all of your information can be recalled upon whenever you or another user visits your page.

* Click on the My Events tab. This is where the user will see all the events created by them. Here is where you can delete or edit (coming soon) the event.

* Click on the Likes tab. This is where you will see all the events you have liked from the main page.

* Click the "Create Event" button at any time to be brough back to the main page and start creating a new event. The "Home" button to the left of the "Create Event" button will also bring you back to the main feed. 

* Thank you for visiting NotEFY! 

## 5. Known Bugs and Limitations
Here are some known bugs:
* Undo feature does not work on some browsers. (Mainly Google Chrome)

## 6. Features for Future
What we'd like to build in the future:
* Being able to set events to private.
* A calender for better representation of event dates and planning.
* A chat service to better message event owners and other participants to 
* enhance coordination between users. 
* A notifcation system to update users when events are close to starting or if we have reccomendations for the user when a new event they might be interested in are created.
	
## 7. Contents of Folder
Content of the project folder:

├── documents
    └── indexdocument.js    # Document containing all the information regarding 
    the functions in index.js
    
    └── maindocument.js     # Document containing all the information regarding the functions in main.js
    
    └── profiledocument.js  # Document containing all the information regarding the functions in profile.js

├── images # Contains all the images used throughout our web app.
    
    └── events # Pictures for event categories. (Created using ChatGPT)
        └── art.jpg
        └── clubs.jpg
        └── default.jpg
        └── festivals.jpg
        └── music.jpg
        └── networking.jpg
        └── sports.jpg
    
    └── profilePics # Avatars for Users to choose from. (Provided by 
    https://www.flaticon.com/free-icons)
        └── cat.png
        └── chicken.png
        └── cow.png
        └── default.webp
        └── dog.png
        └── panda.png
        └── sloth.png
    
    └── logo.png # Favicon
    
    └── NotEFY.png # Navbar Logo

├── scripts 
    
    └── authentication.js # Script for handling login authentication.
    
    └── firebaseAPI_TEAM29.js # Holds our firebase authentication key.
    
    └── index.js # Contains scripts for the index page. 
    Please see indexdocument.js for more details.
    
    └── main.js # Contains scripts for the main page.
    Please see maindocument.js for more details.

    └── profile.js # Contains scripts for the Users profile page.
    Please see profiledocument.js for more details. 

├── styles
    └── global.css # Contains global styling for all pages.

    └── index.css # Contains styling specific to the index page.

    └── main.css # Contains styling for the main page.

    └── profile.css # Contains styling for the profile page.

├── .gitignore              # Git ignore file

├── index.html              # landing HTML file, this is what users see when they first visit the web application.

├── login.html              # Where users can signup / login to their profile.

├── main.html               # The main page of our app where events are displayed, created, and filtered.

├── profile.html            # Users profile pages where they can set a custom avatar, set event preferences, fill out information pertaining to their socials, see own created events, and "liked" events.   

└── README.md

```