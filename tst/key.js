const firebaseConfig = {
    apiKey: "AIzaSyAs_vjXlDu10wwiMzlAu03QjwAb0MSlJTc",
    authDomain: "chat-project-cool.firebaseapp.com",
    projectId: "chat-project-cool",
    storageBucket: "chat-project-cool.appspot.com",
    messagingSenderId: "336227358012",
    appId: "1:336227358012:web:2b792eaf8990379f887a39",
    measurementId: "G-W343CBML5M"
};

firebase.initializeApp(firebaseConfig);

const database = firebase.database();
const auth = firebase.auth();
const messages = database.ref("messages");
const accounts = database.ref("accounts");
