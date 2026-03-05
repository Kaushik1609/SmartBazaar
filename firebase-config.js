// ====== Firebase Configuration ======
// Replace these values with your Firebase project config
// Get them from: Firebase Console > Project Settings > General > Your apps > Config

const firebaseConfig = {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if SDK is loaded)
let firebaseApp = null;
let firebaseAuth = null;

function initFirebase() {
    try {
        if (typeof firebase !== 'undefined') {
            firebaseApp = firebase.initializeApp(firebaseConfig);
            firebaseAuth = firebase.auth();
            firebaseAuth.languageCode = 'en';
            console.log('Firebase initialized successfully');
        } else {
            console.warn('Firebase SDK not loaded — OTP login will use demo mode');
        }
    } catch (error) {
        console.warn('Firebase init error:', error.message);
    }
}

// Initialize on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFirebase);
} else {
    initFirebase();
}
