// Shared auth helpers for all pages
// Requires firebase-config.js to be loaded first (which sets window.auth, window.db)
(function(){
  if (!window.auth) {
    console.warn('auth.js loaded before firebase-config initialization.');
  }

  window.signInWithGoogle = async function signInWithGoogle(){
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const res = await auth.signInWithPopup(provider);
      await ensureUserDoc(res.user);
      return res.user;
    } catch (e) {
      console.error('Google sign-in failed', e);
      throw e;
    }
  };

  window.signOutUser = async function signOutUser(){
    try { await auth.signOut(); } catch(e){ console.error(e); }
  };

  // Gate: require authentication, then run cb(user)
  window.requireAuth = function requireAuth(cb){
    if (!window.auth) {
      console.error('Auth not available');
      return;
    }
    const unsub = auth.onAuthStateChanged(async (user) => {
      if (user) {
        await ensureUserDoc(user);
        cb && cb(user);
      } else {
        // If on a subpage, redirect to landing
        try { window.location.href = 'mainmain.html#signin'; } catch(_) {}
      }
      unsub && unsub();
    });
  };
})();
