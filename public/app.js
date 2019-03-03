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
      signOutBtn.classList.remove("hide");
      loginCol.classList.add("hide");
      userCol.innerHTML = createCurrentUserTemplate(user);
      userCol.classList.remove("hide");
  } else {
      console.log("User is signed out");
      signOutBtn.classList.add("hide");
      userCol.classList.add("hide");
      loginCol.classList.remove("hide");
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
    formData.photoURL = `https://api.adorable.io/avatars/200/${formData.email}.png`;
    firebase.auth().createUserWithEmailAndPassword(formData.email, formData.password).then((result) => {
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
        let userData = {
            email: result.additionalUserInfo.profile.email || "no data available",
            photoURL: result.additionalUserInfo.profile.avatar_url
        };
        firebase.database().ref().child("users").push(userData);
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
            <img src="${userData.photoURL}" alt="avatar" class="circle">
            <span class="title">Name</span>
            <p>${userData.email}</p>
        </li>
    `;

    return userItemTemplate;
}

function createCurrentUserTemplate(user){
    let currentUserMarkup = replaceNullData `
        <div class="card-content">
          <span class="card-title grey-text text-darken-4">Logged in!</span>
        </div>

        <div class="card-content">
            <div class="row">
                <div class="col s12 center-align">
                    <img src="${user.photoURL}" alt="avatar" class="circle">
                    <p>${user.email}</p>
                </div>
            </div>
        </div>
    `;

    return currentUserMarkup;
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

let loginCol = document.getElementById("login-col");
let userCol = document.getElementById("user-col");

emailLoginForm.addEventListener("submit", loginWithEmail);
emailSignUpForm.addEventListener("submit", signUpWithEmail);
githubLoginBtn.addEventListener("click", signInWithGithub);
signOutBtn.addEventListener("click", signOut);

M.Tabs.init(document.querySelector('.tabs'));

initFirebase();
initFirebaseAuth();
addDatabaseListeners();
