function initFirebase(){
  var config = {
    apiKey: "yourApiKey",
    authDomain: "yourAuthDomain",
    projectId: "yourProjectId"
  };
  firebase.initializeApp(config);
}

M.Tabs.init(document.querySelector('.tabs'))
