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
      status.innerText = "Status: user is signed in";
  } else {
      console.log("User is signed out");
      status.innerText = "Status: user is signed out";
  }
}

// Triggers when the send new message form is submitted.
function onEmailSubmit(ev) {
    ev.preventDefault();
    let emailAdress = document.getElementById('email-address');
    let emailPassword = document.getElementById('email-password');
    let formData = {
        email: emailAdress.value,
        password: emailPassword.value
    };
    createUserWithEmailAndPassword(formData);
}

function createUserWithEmailAndPassword(formData){
    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch((error) => {
        console.log("An error ocurred while signing in. Error code: " + error.code + error.message);
    });
}

let status = document.getElementById("status");
let emailForm = document.getElementById('email-form');

emailForm.addEventListener("submit", onEmailSubmit);

M.Tabs.init(document.querySelector('.tabs'));

initFirebase();
initFirebaseAuth();
