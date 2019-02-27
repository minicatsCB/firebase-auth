function initFirebase(){
  var config = {
    apiKey: "yourApiKey",
    authDomain: "yourAuthDomain",
    projectId: "yourProjectId"
  };
  firebase.initializeApp(config);
}

function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged(authStateObserver);
}

// Triggers when the auth state change for instance when the user signs-in or signs-out.
function authStateObserver(user) {
  if (user) {
      console.log("User is signed in");
  } else {
      console.log("User is signed out");
  }
}

M.Tabs.init(document.querySelector('.tabs'));

initFirebase();
initFirebaseAuth();
