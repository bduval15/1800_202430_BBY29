// scripts/firebase-config.js
var firebaseConfig = {
    apiKey: "AIzaSyCgoRZsTUjYcglJhubcVWGlbzA0s3QnpZc",
    authDomain: "notefy-39045.firebaseapp.com",
    projectId: "notefy-39045",
    storageBucket: "notefy-39045.appspot.com",
    messagingSenderId: "955603975402",
    appId: "1:955603975402:web:fc7713afd606b621fa2b93"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Attach Firestore and Storage to the global window object
window.db = firebase.firestore();
window.storage = firebase.storage();