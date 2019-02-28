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

function authStateObserver(user) {
  if (user) {
      console.log("User is signed in");
      status.innerText = "Status: user is signed in";
  } else {
      console.log("User is signed out");
      status.innerText = "Status: user is signed out";
  }
}

function getFormData(form){
    console.log(form);
    let formData = {};
    for(let element of form.elements){
        if(element.tagName.toLowerCase() === "input") {
            formData[element.name] = element.value;
        }
    }

    return formData;
}

function signUpWithEmail(ev) {
    ev.preventDefault();
    let formElement = ev.target;
    let formData = getFormData(formElement);
    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).catch((error) => {
        console.log("An error ocurred while signing in with email. Error", error);
    });
}

function loginWithEmail(ev) {
    ev.preventDefault();
    let formElement = ev.target;
    let formData = getFormData(formElement);
    firebase.auth().signInWithEmailAndPassword(formData.email, formData.password).catch((error) => {
        console.log("An error ocurred while login in with email. Error:", error);
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

let emailLoginForm = document.getElementById("email-login-form");
let emailSignUpForm = document.getElementById('email-sign-up-form');
let githubLoginBtn = document.getElementById("github-login-btn");
let signOutBtn = document.getElementById("sign-out-btn");
let status = document.getElementById("status");

emailLoginForm.addEventListener("submit", loginWithEmail);
emailSignUpForm.addEventListener("submit", signUpWithEmail);
githubLoginBtn.addEventListener("click", signInWithGithub);
signOutBtn.addEventListener("click", signOut);

M.Tabs.init(document.querySelector('.tabs'));

initFirebase();
initFirebaseAuth();
