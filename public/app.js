function initFirebase(){
  var config = {
    apiKey: "yourApiKey",
    authDomain: "yourAuthDomain",
    databaseURL: "yourDatabaseURL",
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
    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then(() => {
        console.log("User signed up with email succesfully");
        firebase.database().ref().child("users").push(formData);
    }).catch((error) => {
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

function addDatabaseListeners() {
    firebase.database().ref().child("users").on('child_added', addUserToList);
    firebase.database().ref().child("users").on('child_removed', removeUserFromList);
}

function addUserToList(user) {
    let userListElement = document.getElementById("user-list");
    let userItemTemplate = replaceNullData `${createUserItemTemplate(user.key, user.val())}`;
    userListElement.insertAdjacentHTML('beforeend', userItemTemplate);
}

function removeUserFromList(user){
    document.getElementById(user.key).remove();
    firebase.database().ref().child("users").child(user.key).remove();
}

function createUserItemTemplate(userKey, userData){
    let userItemTemplate = `
        <li id="${userKey}" class="collection-item avatar">
            <img src="#" alt="avatar" class="circle">
            <span class="title">Name</span>
            <p>${userData.email}</p>
        </li>
    `;

    return userItemTemplate;
}

function replaceNullData(strings, ...parts) {
    var checkedMarkup = "";
    parts.forEach((part, index) => {
        if (!part) {
            part = "data not available";
        }

        checkedMarkup += strings[index] + part;
    });

    return checkedMarkup + strings[strings.length - 1];
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
addDatabaseListeners();
