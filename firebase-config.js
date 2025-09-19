// Firebase initialization for AttendEase
// 1) Fill in your real config below OR set window.__FIREBASE_CONFIG__ before this script loads.
// 2) This exports global firebaseApp, auth, db for use across pages.

// Load compat SDKs in HTML before this file:
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore-compat.js"></script>

(function(){
    const firebaseConfig = {
        apiKey: "AIzaSyBb1Bn4PFd6816UN9q0C1XohKjokOD_bE4",
        authDomain: "attendease-b9f9d.firebaseapp.com",
        projectId: "attendease-b9f9d",
        storageBucket: "attendease-b9f9d.appspot.com",
        messagingSenderId: "522248146907",
        appId: "1:522248146907:web:6136c628e18e0d19a5a1fe",
        measurementId: "G-4TT6BMQ89M"
      };

  if (!window.firebase || !firebase.initializeApp) {
    console.error('Firebase SDKs not loaded. Please include compat SDKs before firebase-config.js');
    return;
  }

  // Diagnostics: running from local file protocol can cause auth issues.
  const proto = location.protocol;
  const origin = location.origin;
  if (proto === 'file:') {
    console.warn('You are opening the HTML via file:// protocol. Firebase Auth may fail. Please serve over http://localhost instead.');
  }
  console.log('[Firebase] SDK version:', firebase.SDK_VERSION, '| Origin:', origin, '| Protocol:', proto);

  if (!firebase.apps.length) {
    window.firebaseApp = firebase.initializeApp(firebaseConfig);
  } else {
    window.firebaseApp = firebase.app();
  }
  window.auth = firebase.auth();
  window.db = firebase.firestore();

  // Expose a small debugger utility
  window.debugFirebase = function(){
    try {
      console.log('[Firebase Debug] apps:', firebase.apps.length, 'initialized:', !!window.firebaseApp);
      console.log('[Firebase Debug] auth:', !!window.auth, 'db:', !!window.db);
      console.log('[Firebase Debug] currentUser:', window.auth?.currentUser || null);
      return {
        version: firebase.SDK_VERSION,
        apps: firebase.apps.map(a=>a.name),
        origin,
        protocol: proto
      };
    } catch (e) { console.error(e); }
  }

  // Helper: ensure user doc exists
  window.ensureUserDoc = async function ensureUserDoc(user){
    try {
      if (!user || !window.db) return;
      const ref = db.collection('users').doc(user.uid);
      const snap = await ref.get();
      if (!snap.exists) {
        const profile = {
          uid: user.uid,
          email: user.email || null,
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        };
        await ref.set(profile, { merge: true });
      }
    } catch (e) { console.warn('ensureUserDoc error', e); }
  }
})();
