function initFirebase(){
  var config = {
    apiKey: "yourApiKey",
    authDomain: "yourAuthDomain",
    projectId: "yourProjectId",
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
        console.log("An error ocurred while signing in with email. Error code: " + error.code + error.message);
    });
}

function signInWithGithub() {
    var provider = new firebase.auth.GithubAuthProvider();
    firebase.auth().signInWithPopup(provider).then(function(result) {
        console.log("Sign in with Github succesful.", result);
    }).catch(function(error) {
        console.log("An error ocurred while signing in with Github. Error:", error);
    });
}

function signOut() {
    firebase.auth().signOut();
}

let status = document.getElementById("status");
let emailForm = document.getElementById('email-form');
let signOutBtn = document.getElementById("sign-out-btn");
let githubSignInBtn = document.getElementById("github-submit-btn");

emailForm.addEventListener("submit", onEmailSubmit);
githubSignInBtn.addEventListener("click", signInWithGithub);
signOutBtn.addEventListener("click", signOut);

M.Tabs.init(document.querySelector('.tabs'));

initFirebase();
initFirebaseAuth();
